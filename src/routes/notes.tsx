import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronRight, Folder, FolderPlus, Highlighter, Lock, NotebookPen, Pencil, Pin, PinOff, Plus, ScanFace, Search, SquarePen, Trash2, Unlock, X } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HighlightedNote } from '@/components/HighlightedNote';
import { NoteLockDialog } from '@/components/NoteLockDialog';
import { offsetAt, usePressHighlight } from '@/lib/use-press-highlight';
import { disableFaceId, enableFaceId, faceIdAvailable, hasFaceId } from '@/lib/note-lock';
import { adjustHighlights, applyHighlight, isNoteColor, noteColors, type NoteColor, type NoteHighlight } from '@/lib/note-highlights';

export const Route = createFileRoute('/notes')({
  head: () => ({ meta: [
    { title: 'Notes — Lexi' },
    { name: 'description', content: 'Write notes in folders, pin them, and lock private notes with Face ID or a password.' },
    { property: 'og:title', content: 'Notes — Lexi' },
    { property: 'og:description', content: 'Write notes in folders, pin them, and lock private notes with Face ID or a password.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Notes,
});

type Note = { id: string; title: string; body: string; updatedAt: number; highlights?: NoteHighlight[]; folder?: string; pinned?: boolean; locked?: boolean };

const STORAGE_KEY = 'lexi-notes';
const FOLDERS_KEY = 'lexi-note-folders';

function loadFolders(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FOLDERS_KEY) ?? '[]') as unknown;
    const names = Array.isArray(parsed) ? parsed.filter((n): n is string => typeof n === 'string' && n.trim() !== '' && n !== 'Notes') : [];
    return ['Notes', ...new Set(names)];
  } catch { return ['Notes']; }
}

function groupNotes(list: Note[]) {
  const now = new Date();
  const groups: { label: string; notes: Note[] }[] = [];
  const add = (label: string, note: Note) => {
    const found = groups.find(g => g.label === label);
    if (found) found.notes.push(note); else groups.push({ label, notes: [note] });
  };
  list.filter(n => n.pinned).forEach(n => add('Pinned', n));
  list.filter(n => !n.pinned).forEach(n => {
    const d = new Date(n.updatedAt);
    const days = (now.getTime() - d.getTime()) / 86_400_000;
    const label = days < 1 && d.getDate() === now.getDate() ? 'Today'
      : days < 7 ? 'Previous 7 Days'
      : days < 30 ? 'Previous 30 Days'
      : d.getFullYear() === now.getFullYear() ? d.toLocaleDateString(undefined, { month: 'long' })
      : String(d.getFullYear());
    add(label, n);
  });
  return groups;
}

function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed.filter(note => note && typeof note.title === 'string' && typeof note.body === 'string').map(note => ({ ...note, folder: typeof note.folder === 'string' ? note.folder : 'Notes', pinned: note.pinned === true, locked: note.locked === true, highlights: Array.isArray(note.highlights) ? note.highlights.filter(range => range && Number.isInteger(range.start) && Number.isInteger(range.end) && range.start >= 0 && range.end > range.start && range.end <= note.body.length && noteColors.some(color => color.id === range.color)).sort((a, b) => a.start - b.start) : [] })) : [];
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
  // Typing into the server-rendered boxes before the app wakes up gets wiped when
  // React takes over, so keep them disabled until the page is live.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<NoteHighlight[]>([]);
  const [color, setColor] = useState<NoteColor>('gold');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  // Floating color bar shown next to the current text selection (draft box or saved note).
  const [selMenu, setSelMenu] = useState<{ target: 'draft' | string; x: number; y: number; start: number; end: number } | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const draftBox = useRef<HTMLDivElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;
  const captureSelection = () => {
    const element = editor.current;
    if (!element) return;
    setSelection({ start: element.selectionStart, end: element.selectionEnd });
  };
  const highlightSelection = (chosen: NoteColor | null) => {
    // Read the live selection straight from the box — the stored state can lag on phones.
    const element = editor.current;
    const start = element && element.selectionStart !== element.selectionEnd ? element.selectionStart : selection.start;
    const end = element && element.selectionStart !== element.selectionEnd ? element.selectionEnd : selection.end;
    if (start === end) return;
    setHighlights(old => applyHighlight(old, start, end, chosen));
    setSelMenu(null);
    element?.focus();
    element?.setSelectionRange(end, end);
    setSelection({ start: end, end });
  };

  useEffect(() => { setNotes(loadNotes()); }, []);

  const captureRef = useRef(captureSelection);
  captureRef.current = captureSelection;
  const notesRef = useRef(notes);
  notesRef.current = notes;
  useEffect(() => {
    // Show the floating color bar once a text selection exists (draft box or saved note).
    let timer: number | undefined;
    const onChange = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        // Draft box selection: anchor the bar above the writing box.
        const box = editor.current;
        if (box && document.activeElement === box && box.selectionStart !== box.selectionEnd) {
          const rect = draftBox.current?.getBoundingClientRect();
          if (rect) setSelMenu({ target: 'draft', x: rect.left + rect.width / 2, y: rect.top, start: box.selectionStart, end: box.selectionEnd });
          return;
        }
        const selected = window.getSelection();
        if (!selected || selected.isCollapsed || !selected.anchorNode) { setSelMenu(null); return; }
        const start = selected.anchorNode instanceof Element ? selected.anchorNode : selected.anchorNode.parentElement;
        const element = start?.closest<HTMLParagraphElement>('[data-note-id]');
        if (!element) { setSelMenu(null); return; }
        const range = selected.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const prefix = range.cloneRange();
        prefix.selectNodeContents(element);
        prefix.setEnd(range.startContainer, range.startOffset);
        const from = prefix.toString().length;
        setSelMenu({ target: element.dataset['noteId'] ?? '', x: rect.left + rect.width / 2, y: rect.top, start: from, end: from + range.toString().length });
      }, 250);
    };
    const onEditorSelect = () => { if (document.activeElement === editor.current) captureRef.current(); };
    document.addEventListener('selectionchange', onChange);
    document.addEventListener('selectionchange', onEditorSelect);
    const box = editor.current;
    box?.addEventListener('select', onEditorSelect);
    box?.addEventListener('selectionchange', onEditorSelect);
    return () => {
      document.removeEventListener('selectionchange', onChange);
      document.removeEventListener('selectionchange', onEditorSelect);
      box?.removeEventListener('select', onEditorSelect);
      box?.removeEventListener('selectionchange', onEditorSelect);
      window.clearTimeout(timer);
    };
  }, []);

  // Dragging always paints the chosen color (so re-dragging never erases); holding still on a
  // highlight without dragging removes that highlight (undo).
  const paint = (ranges: NoteHighlight[], start: number, end: number) => {
    if (end > start) return applyHighlight(ranges, start, end, colorRef.current);
    const hit = ranges.find(range => range.start <= start && start < range.end) ?? ranges.find(range => range.start < start && start <= range.end);
    return hit ? applyHighlight(ranges, hit.start, hit.end, null) : ranges;
  };
  const { drag, begin } = usePressHighlight((id, start, end) => {
    if (id === 'draft') { setHighlights(old => paint(old, start, end)); return; }
    const note = notesRef.current.find(item => item.id === id);
    if (!note) return;
    const nextHighlights = paint(note.highlights ?? [], start, end);
    if (nextHighlights === (note.highlights ?? [])) return;
    update(notesRef.current.map(item => item.id === id ? { ...item, highlights: nextHighlights, updatedAt: Date.now() } : item));
    if (editingId === id && draftBody === note.body) setHighlights(nextHighlights);
  });
  const withDrag = (id: string, base: NoteHighlight[]) => drag && drag.id === id && drag.end > drag.start ? applyHighlight(base, drag.start, drag.end, color) : base;

  useEffect(() => {
    // iPhone: stop Safari's own long-press loupe in the writing box so press-and-hold
    // drives the highlight pill. Taps still place the caret; swipes still scroll.
    const box = draftBox.current;
    if (!box) return;
    let start: { x: number; y: number; t: number; lastY: number; moved: boolean } | null = null;
    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || event.touches.length > 1) return;
      event.preventDefault();
      start = { x: touch.clientX, y: touch.clientY, t: Date.now(), lastY: touch.clientY, moved: false };
    };
    const onMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!start || !touch || document.documentElement.classList.contains('press-highlighting')) return;
      if (Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 10) start.moved = true;
      if (start.moved) {
        const dy = start.lastY - touch.clientY;
        const area = editor.current;
        if (area && area.scrollHeight > area.clientHeight && ((dy > 0 && area.scrollTop + area.clientHeight < area.scrollHeight) || (dy < 0 && area.scrollTop > 0))) area.scrollTop += dy;
        else window.scrollBy(0, dy);
      }
      start.lastY = touch.clientY;
    };
    const onEnd = (event: TouchEvent) => {
      const s = start; start = null;
      if (!s || s.moved || Date.now() - s.t >= 350) return;
      const area = editor.current;
      if (!area || area.disabled) return;
      const touch = event.changedTouches[0];
      const offset = touch && backdrop.current ? offsetAt(backdrop.current, touch.clientX, touch.clientY) : null;
      area.focus();
      const at = offset ?? area.value.length;
      area.setSelectionRange(at, at);
      setSelection({ start: at, end: at });
    };
    box.addEventListener('touchstart', onStart, { passive: false });
    box.addEventListener('touchmove', onMove, { passive: true });
    box.addEventListener('touchend', onEnd);
    return () => { box.removeEventListener('touchstart', onStart); box.removeEventListener('touchmove', onMove); box.removeEventListener('touchend', onEnd); };
  }, []);

  const update = (next: Note[]) => {
    setNotes(next);
    saveNotes(next);
  };
  const patch = (id: string, changes: Partial<Note>) => update(notesRef.current.map(note => note.id === id ? { ...note, ...changes } : note));

  // Folders, search, grouping and the device lock.
  const [folders, setFolders] = useState<string[]>(['Notes']);
  useEffect(() => { setFolders(loadFolders()); }, []);
  const saveFolderList = (next: string[]) => { setFolders(next); try { window.localStorage.setItem(FOLDERS_KEY, JSON.stringify(next)); } catch { /* blocked */ } };
  const [activeFolder, setActiveFolder] = useState('all');
  const [draftFolder, setDraftFolder] = useState('Notes');
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [canFace, setCanFace] = useState(false);
  const [faceOn, setFaceOn] = useState(false);
  useEffect(() => { void faceIdAvailable().then(setCanFace); setFaceOn(hasFaceId()); }, []);
  const pending = useRef<(() => void) | null>(null);
  const requireUnlock = (action: () => void) => {
    if (unlocked) { action(); return; }
    pending.current = action; setLockOpen(true);
  };
  // Re-lock when the app is hidden, like Apple Notes.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') { setUnlocked(false); setOpenId(null); } };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);
  const addFolder = () => {
    const name = window.prompt('New folder name')?.trim();
    if (!name || folders.includes(name) || name === 'All Notes') return;
    saveFolderList([...folders, name]);
  };
  const renameFolder = (old: string) => {
    const name = window.prompt('Rename folder', old)?.trim();
    if (!name || name === old || folders.includes(name) || name === 'All Notes') return;
    saveFolderList(folders.map(f => f === old ? name : f));
    update(notes.map(note => note.folder === old ? { ...note, folder: name } : note));
    if (activeFolder === old) setActiveFolder(name);
  };
  const deleteFolder = (name: string) => {
    if (!window.confirm(`Delete "${name}"? Its notes move to Notes.`)) return;
    saveFolderList(folders.filter(f => f !== name));
    update(notes.map(note => note.folder === name ? { ...note, folder: 'Notes' } : note));
    if (activeFolder === name) setActiveFolder('all');
  };
  const folderOf = (note: Note) => note.folder && folders.includes(note.folder) ? note.folder : 'Notes';
  const needle = query.trim().toLowerCase();
  const visible = notes
    .filter(note => activeFolder === 'all' || folderOf(note) === activeFolder)
    .filter(note => !needle || note.title.toLowerCase().includes(needle) || (!(note.locked && !unlocked) && note.body.toLowerCase().includes(needle)))
    .sort((a, b) => b.updatedAt - a.updatedAt);
  const groups = groupNotes(visible);
  const newNote = () => { setEditingId(null); setDraftTitle(''); setDraftBody(''); setHighlights([]); setDraftFolder(activeFolder === 'all' ? 'Notes' : activeFolder); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const saveDraft = () => {
    const title = draftTitle.trim();
    const body = draftBody;
    if (!title && !body.trim()) return;
    if (editingId) {
      update(notes.map(note => note.id === editingId ? { ...note, title: title || 'Untitled note', body, highlights, folder: draftFolder, updatedAt: Date.now() } : note));
    } else {
      update([{ id: String(Date.now()), title: title || 'Untitled note', body, highlights, folder: draftFolder, updatedAt: Date.now() }, ...notes]);
    }
    setDraftTitle('');
    setDraftBody('');
    setEditingId(null);
    setHighlights([]);
    setSelection({ start: 0, end: 0 });
  };

  const startEdit = (note: Note) => {
    const go = () => {
      setEditingId(note.id);
      setDraftTitle(note.title === 'Untitled note' ? '' : note.title);
      setDraftBody(note.body);
      setHighlights(note.highlights ?? []);
      setDraftFolder(folderOf(note));
      setSelection({ start: 0, end: 0 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (note.locked) requireUnlock(go); else go();
  };

  const removeNote = (id: string) => {
    const note = notes.find(item => item.id === id);
    const go = () => {
      update(notesRef.current.filter(item => item.id !== id));
      if (editingId === id) { setEditingId(null); setDraftTitle(''); setDraftBody(''); setHighlights([]); setSelection({ start: 0, end: 0 }); }
    };
    if (note?.locked) requireUnlock(go); else go();
  };

  const pillColor = noteColors.find(option => option.id === color)?.className ?? '';
  return <Shell title="Notes">
    {drag && <div aria-hidden="true" className={`pointer-events-none fixed z-50 grid h-7 w-12 -translate-x-1/2 -translate-y-full place-items-center rounded-full shadow-lg ring-2 ring-background ${pillColor}`} style={{ left: drag.x, top: drag.y - 14 }}><Highlighter className="size-4"/></div>}
    {selMenu && !drag && <div role="toolbar" aria-label="Highlight selection" className="fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full border border-border bg-card p-1 shadow-xl" style={{ left: Math.min(Math.max(selMenu.x, 110), window.innerWidth - 110), top: Math.max(selMenu.y - 10, 60) }}>
      {noteColors.map(option => <Button key={option.id} type="button" size="icon" variant="ghost" aria-label={`${option.label} highlight`} title={`${option.label} highlight`} onPointerDown={event => event.preventDefault()} onClick={() => {
        if (selMenu.target === 'draft') { setHighlights(old => applyHighlight(old, selMenu.start, selMenu.end, option.id)); editor.current?.setSelectionRange(selMenu.end, selMenu.end); setSelection({ start: selMenu.end, end: selMenu.end }); setSelMenu(null); }
        else { const element = document.querySelector<HTMLParagraphElement>(`[data-note-id="${selMenu.target}"]`); const note = notesRef.current.find(item => item.id === selMenu.target); if (element && note) { const nextHighlights = applyHighlight(note.highlights ?? [], selMenu.start, selMenu.end, option.id); update(notesRef.current.map(item => item.id === note.id ? { ...item, highlights: nextHighlights, updatedAt: Date.now() } : item)); window.getSelection()?.removeAllRanges(); setSelMenu(null); } }
      }}><span className={`size-5 rounded-sm ${option.className}`}/></Button>)}
      <Button type="button" size="icon" variant="ghost" aria-label="Remove highlight" title="Remove highlight" onPointerDown={event => event.preventDefault()} onClick={() => {
        if (selMenu.target === 'draft') { setHighlights(old => applyHighlight(old, selMenu.start, selMenu.end, null)); setSelMenu(null); }
        else { const note = notesRef.current.find(item => item.id === selMenu.target); if (note) { update(notesRef.current.map(item => item.id === note.id ? { ...item, highlights: applyHighlight(note.highlights ?? [], selMenu.start, selMenu.end, null), updatedAt: Date.now() } : item)); window.getSelection()?.removeAllRanges(); setSelMenu(null); } }
      }}><X className="size-4"/></Button>
    </div>}
    <Section number="01" title="Write a note" subtitle="Saved on this device">
      <div className="rounded-lg border border-border bg-card p-6">
        <Input value={draftTitle} onChange={event => setDraftTitle(event.target.value)} placeholder="Note title" aria-label="Note title" maxLength={80} disabled={!ready}/>
        <div ref={draftBox} className="note-select note-press relative mt-3" data-color={color} onPointerDown={event => begin(event, 'draft', backdrop.current, editor.current)}>
          <div ref={backdrop} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 text-base text-foreground md:text-sm"><HighlightedNote body={draftBody} highlights={withDrag('draft', highlights)}/>{'\n'}</div>
          <Textarea ref={editor} value={draftBody} onSelect={captureSelection} onPointerUp={captureSelection} onTouchEnd={captureSelection} onKeyUp={captureSelection} onScroll={event => { if (backdrop.current) backdrop.current.scrollTop = event.currentTarget.scrollTop; }} onChange={event => { const next = event.target.value; setHighlights(old => adjustHighlights(old, draftBody, next)); setDraftBody(next); }} placeholder="Write your note…" aria-label="Note text" className="note-editor-input relative min-h-28 break-words" maxLength={4000} disabled={!ready}/>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Note highlighting">
          {noteColors.map(option => <Button key={option.id} type="button" size="icon" variant="outline" aria-label={`${option.label} highlight color`} title={`${option.label} highlight color`} aria-pressed={color === option.id} onMouseDown={event => event.preventDefault()} onClick={() => setColor(option.id)} className={color === option.id ? 'border-primary' : ''}><span className={`grid size-6 place-items-center rounded-sm ${option.className}`}>{color === option.id && <Check className="size-4"/>}</span></Button>)}
          <Button type="button" size="icon" variant="outline" aria-label="Highlight selected text" title="Highlight selected text" disabled={selection.start === selection.end} onMouseDown={event => event.preventDefault()} onClick={() => highlightSelection(color)}><Highlighter/></Button>
          <Button type="button" size="icon" variant="outline" aria-label="Remove selected highlight" title="Remove selected highlight" disabled={selection.start === selection.end} onMouseDown={event => event.preventDefault()} onClick={() => highlightSelection(null)}><X/></Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <select value={folders.includes(draftFolder) ? draftFolder : 'Notes'} onChange={event => setDraftFolder(event.target.value)} aria-label="Folder" className="h-10 rounded-md border border-input bg-background px-2 text-sm">
            {folders.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
          <Button type="button" onClick={saveDraft} disabled={!draftTitle.trim() && !draftBody.trim()}>
            {editingId ? <Pencil/> : <Plus/>}{editingId ? 'Save changes' : 'Add note'}
          </Button>
           {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setDraftTitle(''); setDraftBody(''); setHighlights([]); setSelection({ start: 0, end: 0 }); }}>Cancel</Button>}
        </div>
      </div>
    </Section>
    <Section number="02" title="Folders" subtitle={`${notes.length} note${notes.length === 1 ? '' : 's'}`}>
      <div className="overflow-hidden rounded-2xl bg-card">
        {[{ id: 'all', name: 'All Notes', count: notes.length }, ...folders.map(name => ({ id: name, name, count: notes.filter(note => folderOf(note) === name).length }))].map(item => (
          <div key={item.id} className="group flex items-center">
            <button type="button" onClick={() => setActiveFolder(item.id)} aria-pressed={activeFolder === item.id} className={`flex min-w-0 flex-1 items-center gap-4 px-4 py-3 text-left ${activeFolder === item.id ? 'bg-secondary' : ''}`}>
              <Folder className="size-6 shrink-0 text-primary"/>
              <span className="flex min-w-0 flex-1 items-center gap-3 border-b border-border pb-3 -mb-3">
                <span className="truncate text-base">{item.name}</span>
                <span className="ml-auto text-muted-foreground">{item.count}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground"/>
              </span>
            </button>
            {item.id !== 'all' && item.id !== 'Notes' && <div className="flex pr-2">
              <Button type="button" variant="ghost" size="icon" aria-label={`Rename ${item.name}`} onClick={() => renameFolder(item.id)}><Pencil className="size-4"/></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={`Delete ${item.name}`} onClick={() => deleteFolder(item.id)}><Trash2 className="size-4"/></Button>
            </div>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={addFolder}><FolderPlus/>New folder</Button>
        {unlocked ? <Button type="button" variant="outline" onClick={() => setUnlocked(false)}><Lock/>Lock notes now</Button>
          : notes.some(note => note.locked) && <Button type="button" variant="outline" onClick={() => requireUnlock(() => undefined)}><Unlock/>Unlock notes</Button>}
        {unlocked && canFace && !faceOn && <Button type="button" variant="outline" onClick={async () => { try { await enableFaceId(); setFaceOn(true); } catch { /* cancelled */ } }}><ScanFace/>Turn on Face ID</Button>}
        {faceOn && unlocked && <Button type="button" variant="ghost" onClick={() => { disableFaceId(); setFaceOn(false); }}>Turn off Face ID</Button>}
      </div>
    </Section>
    <Section number="03" title={activeFolder === 'all' ? 'All Notes' : activeFolder} subtitle={`${visible.length} note${visible.length === 1 ? '' : 's'}`}>
      <div className="sticky bottom-3 z-20 order-last mb-4 flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-border bg-secondary/90 px-4 py-2 backdrop-blur">
          <Search className="size-5 text-muted-foreground"/>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search" aria-label="Search notes" className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"/>
        </label>
        <Button type="button" size="icon" variant="outline" className="size-11 rounded-full" aria-label="New note" onClick={newNote}><SquarePen/></Button>
      </div>
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          <NotebookPen className="mx-auto mb-3 size-8"/>
          {query ? 'No notes match your search.' : 'No notes here yet — write one above.'}
        </div>
      ) : groups.map(group => (
        <div key={group.label} className="mb-6">
          <button type="button" className="mb-2 flex w-full items-center justify-between text-xl font-bold" onClick={() => setCollapsed(old => ({ ...old, [group.label]: !old[group.label] }))} aria-expanded={!collapsed[group.label]}>
            {group.label}<ChevronDown className={`size-5 text-muted-foreground transition-transform ${collapsed[group.label] ? '-rotate-90' : ''}`}/>
          </button>
          {!collapsed[group.label] && <div className="overflow-hidden rounded-2xl bg-card">
            {group.notes.map(note => {
              const hidden = note.locked && !unlocked;
              const open = openId === note.id && !hidden;
              return <article key={note.id} className="border-b border-border px-4 py-3 last:border-b-0">
                <div className="flex items-start gap-2">
                  {note.locked ? <Lock className="mt-1 size-4 shrink-0 text-muted-foreground"/> : <span className="w-4 shrink-0"/>}
                  <button type="button" className="min-w-0 flex-1 text-left" onClick={() => hidden ? requireUnlock(() => setOpenId(note.id)) : setOpenId(open ? null : note.id)} aria-expanded={open}>
                    <h3 className="truncate text-base font-semibold">{note.title}</h3>
                    <p className="truncate text-sm text-muted-foreground"><span className="mr-2">{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' })}</span>{hidden ? 'Locked' : note.body.split('\n')[0] || 'No additional text'}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground"><Folder className="size-3.5"/>{folderOf(note)}</p>
                  </button>
                  <div className="flex shrink-0">
                    <Button type="button" variant="ghost" size="icon" aria-label={note.pinned ? `Unpin ${note.title}` : `Pin ${note.title}`} aria-pressed={!!note.pinned} onClick={() => patch(note.id, { pinned: !note.pinned })}>{note.pinned ? <PinOff className="size-4"/> : <Pin className="size-4"/>}</Button>
                    <Button type="button" variant="ghost" size="icon" aria-label={note.locked ? `Remove lock from ${note.title}` : `Lock ${note.title}`} onClick={() => requireUnlock(() => patch(note.id, { locked: !note.locked }))}>{note.locked ? <Unlock className="size-4"/> : <Lock className="size-4"/>}</Button>
                  </div>
                </div>
                {open && <div className="mt-3 pl-6">
                  {note.body && <p data-note-id={note.id} data-color={color} onPointerDown={event => begin(event, note.id, event.currentTarget)} className="note-select note-press select-text whitespace-pre-wrap break-words text-sm text-muted-foreground"><HighlightedNote body={note.body} highlights={withDrag(note.id, note.highlights ?? [])}/></p>}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select value={folderOf(note)} onChange={event => patch(note.id, { folder: event.target.value })} aria-label={`Folder for ${note.title}`} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                      {folders.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(note)}><Pencil className="size-4"/>Edit</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeNote(note.id)}><Trash2 className="size-4"/>Delete</Button>
                  </div>
                </div>}
              </article>;
            })}
          </div>}
        </div>
      ))}
    </Section>
    <NoteLockDialog open={lockOpen} onOpenChange={open => { setLockOpen(open); if (!open) pending.current = null; }} onUnlocked={() => { setUnlocked(true); setFaceOn(hasFaceId()); const run = pending.current; pending.current = null; run?.(); }}/>
  </Shell>;
}
