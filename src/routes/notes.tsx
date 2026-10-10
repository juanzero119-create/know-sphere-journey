import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Check, Highlighter, NotebookPen, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HighlightedNote } from '@/components/HighlightedNote';
import { adjustHighlights, applyHighlight, noteColors, type NoteColor, type NoteHighlight } from '@/lib/note-highlights';

export const Route = createFileRoute('/notes')({
  head: () => ({ meta: [
    { title: 'Notes — Lexi' },
    { name: 'description', content: 'Write and keep your own notes in Lexi, saved on this device.' },
    { property: 'og:title', content: 'Notes — Lexi' },
    { property: 'og:description', content: 'Write and keep your own notes in Lexi, saved on this device.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Notes,
});

type Note = { id: string; title: string; body: string; updatedAt: number; highlights?: NoteHighlight[] };

const STORAGE_KEY = 'lexi-notes';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed.filter(note => note && typeof note.title === 'string' && typeof note.body === 'string').map(note => ({ ...note, highlights: Array.isArray(note.highlights) ? note.highlights.filter(range => range && Number.isInteger(range.start) && Number.isInteger(range.end) && range.start >= 0 && range.end > range.start && range.end <= note.body.length && noteColors.some(color => color.id === range.color)).sort((a, b) => a.start - b.start) : [] })) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* storage full or blocked */ }
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<NoteHighlight[]>([]);
  const [color, setColor] = useState<NoteColor>('gold');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const editor = useRef<HTMLTextAreaElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const colorRef = useRef(color);
  colorRef.current = color;
  useEffect(() => () => window.clearTimeout(settleTimer.current), []);
  const applyEditorSelection = () => {
    const element = editor.current;
    if (!element || element.selectionStart === element.selectionEnd) return;
    const { selectionStart: start, selectionEnd: end } = element;
    setHighlights(old => applyHighlight(old, start, end, colorRef.current));
    setSelection({ start, end });
    // Collapse the selection so the system's blue selection gives way to the app's highlight.
    element.setSelectionRange(end, end);
  };
  const captureSelection = () => {
    const element = editor.current;
    if (!element) return;
    setSelection({ start: element.selectionStart, end: element.selectionEnd });
    // Phones adjust selections with drag handles that never send a pointer-up to the box,
    // so apply the highlight once the selection stops changing.
    window.clearTimeout(settleTimer.current);
    if (element.selectionStart !== element.selectionEnd) settleTimer.current = window.setTimeout(applyEditorSelection, 700);
  };
  const highlightSelection = (chosen: NoteColor | null) => {
    setHighlights(old => applyHighlight(old, selection.start, selection.end, chosen));
    editor.current?.focus();
    editor.current?.setSelectionRange(selection.end, selection.end);
  };
  const highlightDraggedText = () => {
    requestAnimationFrame(() => { window.clearTimeout(settleTimer.current); applyEditorSelection(); });
  };
  const highlightSavedText = (element: HTMLParagraphElement, note: Note) => {
    const selected = window.getSelection();
    if (!selected || selected.isCollapsed || selected.rangeCount === 0) return;
    const range = selected.getRangeAt(0);
    if (!element.contains(range.startContainer) || !element.contains(range.endContainer)) return;
    const prefix = range.cloneRange();
    prefix.selectNodeContents(element);
    prefix.setEnd(range.startContainer, range.startOffset);
    const start = prefix.toString().length;
    const end = start + range.toString().length;
    const nextHighlights = applyHighlight(note.highlights ?? [], start, end, color);
    update(notes.map(item => item.id === note.id ? { ...item, highlights: nextHighlights, updatedAt: Date.now() } : item));
    if (editingId === note.id && draftBody === note.body) setHighlights(nextHighlights);
    selected.removeAllRanges();
  };

  useEffect(() => { setNotes(loadNotes()); }, []);

  const savedHighlighter = useRef(highlightSavedText);
  savedHighlighter.current = highlightSavedText;
  const notesRef = useRef(notes);
  notesRef.current = notes;
  useEffect(() => {
    // Touch selections on saved notes finish with drag handles, so apply once the selection settles.
    let timer: number | undefined;
    const onChange = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const selected = window.getSelection();
        if (!selected || selected.isCollapsed || !selected.anchorNode) return;
        const start = selected.anchorNode instanceof Element ? selected.anchorNode : selected.anchorNode.parentElement;
        const element = start?.closest<HTMLParagraphElement>('[data-note-id]');
        const note = element && notesRef.current.find(item => item.id === element.dataset.noteId);
        if (element && note) savedHighlighter.current(element, note);
      }, 700);
    };
    document.addEventListener('selectionchange', onChange);
    return () => { document.removeEventListener('selectionchange', onChange); window.clearTimeout(timer); };
  }, []);

  const update = (next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  };

  const saveDraft = () => {
    const title = draftTitle.trim();
    const body = draftBody;
    if (!title && !body.trim()) return;
    if (editingId) {
      update(notes.map(note => note.id === editingId ? { ...note, title: title || 'Untitled note', body, highlights, updatedAt: Date.now() } : note));
    } else {
      update([{ id: String(Date.now()), title: title || 'Untitled note', body, highlights, updatedAt: Date.now() }, ...notes]);
    }
    setDraftTitle('');
    setDraftBody('');
    setEditingId(null);
    setHighlights([]);
    setSelection({ start: 0, end: 0 });
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setDraftTitle(note.title === 'Untitled note' ? '' : note.title);
    setDraftBody(note.body);
    setHighlights(note.highlights ?? []);
    setSelection({ start: 0, end: 0 });
  };

  const removeNote = (id: string) => {
    update(notes.filter(note => note.id !== id));
    if (editingId === id) { setEditingId(null); setDraftTitle(''); setDraftBody(''); setHighlights([]); setSelection({ start: 0, end: 0 }); }
  };

  return <Shell title="Notes">
    <Section number="01" title="Write a note" subtitle="Saved on this device">
      <div className="rounded-lg border border-border bg-card p-6">
        <Input value={draftTitle} onChange={event => setDraftTitle(event.target.value)} placeholder="Note title" aria-label="Note title" maxLength={80}/>
        <div className="note-select relative mt-3" data-color={color}>
          <div ref={backdrop} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 text-base text-foreground md:text-sm"><HighlightedNote body={draftBody} highlights={highlights}/>{'\n'}</div>
          <Textarea ref={editor} value={draftBody} onSelect={captureSelection} onPointerUp={highlightDraggedText} onTouchEnd={highlightDraggedText} onScroll={event => { if (backdrop.current) backdrop.current.scrollTop = event.currentTarget.scrollTop; }} onChange={event => { const next = event.target.value; setHighlights(old => adjustHighlights(old, draftBody, next)); setDraftBody(next); }} placeholder="Write your note…" aria-label="Note text" className="note-editor-input relative min-h-28 break-words" maxLength={4000}/>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Note highlighting">
          {noteColors.map(option => <Button key={option.id} type="button" size="icon" variant="outline" aria-label={`${option.label} highlight color`} title={`${option.label} highlight color`} aria-pressed={color === option.id} onMouseDown={event => event.preventDefault()} onClick={() => setColor(option.id)} className={color === option.id ? 'border-primary' : ''}><span className={`grid size-6 place-items-center rounded-sm ${option.className}`}>{color === option.id && <Check className="size-4"/>}</span></Button>)}
          <Button type="button" size="icon" variant="outline" aria-label="Highlight selected text" title="Highlight selected text" disabled={selection.start === selection.end} onMouseDown={event => event.preventDefault()} onClick={() => highlightSelection(color)}><Highlighter/></Button>
          <Button type="button" size="icon" variant="outline" aria-label="Remove selected highlight" title="Remove selected highlight" disabled={selection.start === selection.end} onMouseDown={event => event.preventDefault()} onClick={() => highlightSelection(null)}><X/></Button>
        </div>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={saveDraft} disabled={!draftTitle.trim() && !draftBody.trim()}>
            {editingId ? <Pencil/> : <Plus/>}{editingId ? 'Save changes' : 'Add note'}
          </Button>
           {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setDraftTitle(''); setDraftBody(''); setHighlights([]); setSelection({ start: 0, end: 0 }); }}>Cancel</Button>}
        </div>
      </div>
    </Section>
    <Section number="02" title="Your notes" subtitle={`${notes.length} note${notes.length === 1 ? '' : 's'}`}>
      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <NotebookPen className="mx-auto mb-3 size-8"/>
          No notes yet — write your first one above.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map(note => (
            <article key={note.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="break-words text-lg font-semibold">{note.title}</h3>
                <div className="flex shrink-0 gap-1">
                  <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${note.title}`} onClick={() => startEdit(note)}><Pencil className="size-4"/></Button>
                  <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${note.title}`} onClick={() => removeNote(note.id)}><Trash2 className="size-4"/></Button>
                </div>
              </div>
              {note.body && <p data-note-id={note.id} data-color={color} onPointerUp={event => highlightSavedText(event.currentTarget, note)} className="note-select mt-2 select-text whitespace-pre-wrap break-words text-sm text-muted-foreground"><HighlightedNote body={note.body} highlights={note.highlights ?? []}/></p>}
              <p className="mt-3 text-xs text-muted-foreground">{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </article>
          ))}
        </div>
      )}
    </Section>
  </Shell>;
}
