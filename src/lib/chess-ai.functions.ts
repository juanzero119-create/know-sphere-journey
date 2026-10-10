import { createServerFn } from '@tanstack/react-start';
import { Chess } from 'chess.js';

const BASE = 'https://ai.gateway.lovable.dev/v1';

async function readSse(res: Response, pick: (data: any) => string | undefined) {
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = '', text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n'); buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === '[DONE]') continue;
      try { text += pick(JSON.parse(raw)) ?? ''; } catch { /* ignore partial */ }
    }
  }
  return text;
}

async function ask(model: string, prompt: string, key: string) {
  const headers = { 'Content-Type': 'application/json', 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'fetch' };
  let res: Response; let pick: (d: any) => string | undefined;
  if (model.startsWith('openai/')) {
    res = await fetch(`${BASE}/responses`, { method: 'POST', headers, body: JSON.stringify({ model, input: prompt, stream: true, store: false, reasoning: { effort: 'low', summary: 'auto' }, include: ['reasoning.encrypted_content'] }) });
    pick = d => d.type === 'response.output_text.delta' ? d.delta : undefined;
  } else if (model.startsWith('anthropic/')) {
    res = await fetch(`${BASE}/messages`, { method: 'POST', headers: { ...headers, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model, max_tokens: 1024, stream: true, messages: [{ role: 'user', content: prompt }] }) });
    pick = d => d.type === 'content_block_delta' && d.delta?.type === 'text_delta' ? d.delta.text : undefined;
  } else {
    res = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers, body: JSON.stringify({ model, stream: true, messages: [{ role: 'user', content: prompt }] }) });
    pick = d => d.choices?.[0]?.delta?.content;
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let msg = ''; try { msg = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? ''; } catch { /* */ }
    const reason = res.status === 402 ? 'Out of AI credits.' : res.status === 429 ? 'AI is busy — try again shortly.' : res.status === 404 ? 'This model is not available.' : msg || `AI request failed (${res.status}).`;
    return { error: reason };
  }
  return { text: await readSse(res, pick) };
}

export const getAiMove = createServerFn({ method: 'POST' })
  .inputValidator((d: { fen: string; model: string }) => {
    if (typeof d?.fen !== 'string' || typeof d?.model !== 'string' || d.model.length > 160) throw new Error('Invalid input');
    return d;
  })
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) return { error: 'AI is not configured.' };
    let game: Chess;
    try { game = new Chess(data.fen); } catch { return { error: 'Invalid position.' }; }
    const legal = game.moves();
    if (!legal.length) return { error: 'No legal moves.' };
    const tactics = [
      'Fork: one piece attacks two or more enemy pieces at once — knights are best, but any piece can fork.',
      'Pin: attack a piece that cannot move without exposing a more valuable piece behind it; absolute pins (king behind) freeze the piece completely.',
      'Skewer: attack a valuable piece so that when it moves away, you capture the piece behind it.',
      'Discovered attack / discovered check: move one piece to unleash an attack from a piece behind it; discovered checks are the most dangerous.',
      'Double check: two pieces give check at once — the king must move.',
      'Deflection: force a defending piece away from a square or piece it protects.',
      'Decoy: lure an enemy piece onto a bad square, often with a sacrifice.',
      'Removing the defender: capture or chase off the piece guarding a target, then take the target.',
      'Back rank mate: trap a king behind its own pawns with a rook or queen on the back rank.',
      'Overloading: attack a piece that is defending too many things at once.',
      'Interference: place a piece between two enemy pieces to cut their communication.',
      'Zwischenzug (in-between move): before making an expected recapture, insert a forcing move like a check.',
      'X-ray attack: attack through an enemy piece to a target behind it.',
      'Trapped piece: leave an enemy piece with no safe squares.',
      'Pawn promotion: push passed pawns; a pawn about to queen is worth a piece.',
      'General technique: develop pieces early, castle to safety, control the center, connect rooks, keep the king safe, and never hang pieces — before moving, check what your opponent threatens.',
    ].map((t, i) => `${i + 1}. ${t}`).join('\n');
    const prompt = `You are a strong chess engine playing ${game.turn() === 'w' ? 'White' : 'Black'}. Position (FEN): ${data.fen}\nLegal moves (SAN): ${legal.join(' ')}\n\nUse these tactics and techniques when choosing your move:\n${tactics}\n\nLook for winning tactics first (checks, captures, threats), then improve your position. Pick the best move. Reply with ONLY one move from the list, nothing else.`;
    const out = await ask(data.model, prompt, key);
    if ('error' in out) return { error: out.error };
    const tokens = (out.text ?? '').replace(/[.,!*`"]/g, ' ').split(/\s+/).filter(Boolean);
    const move = [...tokens].reverse().find(t => legal.includes(t)) ?? legal.find(m => out.text?.includes(m));
    if (move) return { move, fallback: false };
    return { move: legal[Math.floor(Math.random() * legal.length)], fallback: true };
  });
