import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { NotebookPen, Pencil, Plus, Trash2 } from 'lucide-react';
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

type Note = { id: string; title: string; body: string; updatedAt: number };

const STORAGE_KEY = 'lexi-notes';

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed.filter(note => note && typeof note.title === 'string') : [];
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
      update(notes.map(note => note.id === editingId ? { ...note, title, body, updatedAt: Date.now() } : note));
    } else {
      update([{ id: String(Date.now()), title: title || 'Untitled note', body, updatedAt: Date.now() }, ...notes]);
    }
    setDraftTitle('');
    setDraftBody('');
    setEditingId(null);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setDraftTitle(note.title === 'Untitled note' ? '' : note.title);
    setDraftBody(note.body);
  };

  const removeNote = (id: string) => {
    update(notes.filter(note => note.id !== id));
    if (editingId === id) { setEditingId(null); setDraftTitle(''); setDraftBody(''); }
  };

  return <Shell title="Notes">
    <Section number="01" title="Write a note" subtitle="Saved on this device">
      <div className="rounded-lg border border-border bg-card p-6">
        <Input value={draftTitle} onChange={event => setDraftTitle(event.target.value)} placeholder="Note title" aria-label="Note title" maxLength={80}/>
        <Textarea value={draftBody} onChange={event => setDraftBody(event.target.value)} placeholder="Write your note…" aria-label="Note text" className="mt-3 min-h-28" maxLength={4000}/>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={saveDraft} disabled={!draftTitle.trim() && !draftBody.trim()}>
            {editingId ? <Pencil/> : <Plus/>}{editingId ? 'Save changes' : 'Add note'}
          </Button>
          {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setDraftTitle(''); setDraftBody(''); }}>Cancel</Button>}
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
              {note.body && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{note.body}</p>}
              <p className="mt-3 text-xs text-muted-foreground">{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </article>
          ))}
        </div>
      )}
    </Section>
  </Shell>;
}
