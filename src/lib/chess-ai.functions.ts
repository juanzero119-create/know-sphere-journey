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
    const prompt = `You are a strong chess engine playing ${game.turn() === 'w' ? 'White' : 'Black'}. Position (FEN): ${data.fen}\nLegal moves (SAN): ${legal.join(' ')}\nPick the best move. Reply with ONLY one move from the list, nothing else.`;
    const out = await ask(data.model, prompt, key);
    if ('error' in out) return { error: out.error };
    const tokens = (out.text ?? '').replace(/[.,!*`"]/g, ' ').split(/\s+/).filter(Boolean);
    const move = [...tokens].reverse().find(t => legal.includes(t)) ?? legal.find(m => out.text?.includes(m));
    if (move) return { move, fallback: false };
    return { move: legal[Math.floor(Math.random() * legal.length)], fallback: true };
  });
