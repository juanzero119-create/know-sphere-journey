import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Check, NotebookPen, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

const noteColors = [
  { id: 'none', label: 'None', swatch: 'bg-card' },
  { id: 'yellow', label: 'Yellow', swatch: 'bg-note-yellow' },
  { id: 'green', label: 'Green', swatch: 'bg-note-green' },
  { id: 'blue', label: 'Blue', swatch: 'bg-note-blue' },
  { id: 'pink', label: 'Pink', swatch: 'bg-note-pink' },
  { id: 'purple', label: 'Purple', swatch: 'bg-note-purple' },
  { id: 'orange', label: 'Orange', swatch: 'bg-note-orange' },
] as const;
type NoteColor = (typeof noteColors)[number]['id'];
const colorById = Object.fromEntries(noteColors.map(c => [c.id, c])) as Record<NoteColor, (typeof noteColors)[number]>;

type Note = { id: string; title: string; body: string; color: NoteColor; updatedAt: number };

const STORAGE_KEY = 'lexi-notes';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed)
      ? parsed.filter(note => note && typeof note.title === 'string').map(note => ({ ...note, color: colorById[note.color] ? note.color : 'none' }))
      : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch { /* storage full or blocked */ }
}

function ColorPicker({ label, value, onChange }: { label: string; value: NoteColor; onChange: (value: NoteColor) => void }) {
  return <fieldset><legend className="mb-2 text-sm font-medium">{label}</legend><div className="flex flex-wrap gap-2">{noteColors.map(c => <Button key={c.id} type="button" variant="outline" size="icon" title={`${label}: ${c.label}`} aria-label={`${label}: ${c.label}`} aria-pressed={value === c.id} onClick={() => onChange(c.id)} className={`border-2 hover:bg-muted ${value === c.id ? 'border-primary' : 'border-border'}`}><span className={`grid size-6 place-items-center rounded-sm text-foreground ${c.swatch}`}>{value === c.id ? <Check className="size-4"/> : c.id === 'none' ? <X className="size-3"/> : null}</span></Button>)}</div></fieldset>;
}

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftColor, setDraftColor] = useState<NoteColor>('none');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { setNotes(loadNotes()); }, []);

  const update = (next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  };

  const saveDraft = () => {
    const title = draftTitle.trim();
    const body = draftBody.trim();
    if (!title && !body) return;
    if (editingId) {
      update(notes.map(note => note.id === editingId ? { ...note, title, body, color: draftColor, updatedAt: Date.now() } : note));
    } else {
      update([{ id: String(Date.now()), title: title || 'Untitled note', body, color: draftColor, updatedAt: Date.now() }, ...notes]);
    }
    setDraftTitle('');
    setDraftBody('');
    setDraftColor('none');
    setEditingId(null);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setDraftTitle(note.title === 'Untitled note' ? '' : note.title);
    setDraftBody(note.body);
    setDraftColor(note.color);
  };

  const removeNote = (id: string) => {
    update(notes.filter(note => note.id !== id));
    if (editingId === id) { setEditingId(null); setDraftTitle(''); setDraftBody(''); setDraftColor('none'); }
  };

  return <Shell title="Notes">
    <Section number="01" title="Write a note" subtitle="Saved on this device">
      <div className="rounded-lg border border-border bg-card p-6">
        <Input value={draftTitle} onChange={event => setDraftTitle(event.target.value)} placeholder="Note title" aria-label="Note title" maxLength={80}/>
        <Textarea value={draftBody} onChange={event => setDraftBody(event.target.value)} placeholder="Write your note…" aria-label="Note text" className="mt-3 min-h-28" maxLength={4000}/>
        <div className="mt-4"><ColorPicker label="Highlight color" value={draftColor} onChange={setDraftColor}/></div>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={saveDraft} disabled={!draftTitle.trim() && !draftBody.trim()}>
            {editingId ? <Pencil/> : <Plus/>}{editingId ? 'Save changes' : 'Add note'}
          </Button>
          {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setDraftTitle(''); setDraftBody(''); setDraftColor('none'); }}>Cancel</Button>}
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
          {notes.map(note => {
            const color = colorById[note.color] ?? colorById.none;
            return (
              <article key={note.id} className={`rounded-lg border border-border p-5 ${color.id === 'none' ? 'bg-card' : `note-highlighted border-transparent ${color.swatch}`}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="break-words text-lg font-semibold">{note.title}</h3>
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" variant="ghost" size="icon" className={`note-icon-btn ${color.id === 'none' ? '' : 'text-[inherit]'}`} aria-label={`Edit ${note.title}`} onClick={() => startEdit(note)}><Pencil className="size-4"/></Button>
                    <Button type="button" variant="ghost" size="icon" className={`note-icon-btn ${color.id === 'none' ? '' : 'text-[inherit]'}`} aria-label={`Delete ${note.title}`} onClick={() => removeNote(note.id)}><Trash2 className="size-4"/></Button>
                  </div>
                </div>
                {note.body && <p className="note-sub mt-2 whitespace-pre-wrap break-words text-sm">{note.body}</p>}
                <p className="note-sub mt-3 text-xs">{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  </Shell>;
}
