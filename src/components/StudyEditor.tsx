import { useState, useSyncExternalStore } from 'react';
import { Plus, Check, Pencil, Trash2, BookOpen, Bone, Star, Heart, Music, Globe, FlaskConical, Pencil as PencilIcon } from 'lucide-react';
import { iconChoices } from '@/components/NavigationEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const studyDestinations = [
  { to: '/words', label: 'Vocabulary' }, { to: '/anatomy', label: 'Anatomy' },
  { to: '/', label: 'Practice' }, { to: '/watch', label: 'Watch' }, { to: '/movies', label: 'Movies' },
] as const;
type Destination = typeof studyDestinations[number]['to'];
type IconName = typeof iconChoices[number]['name'];
export type CustomStudy = { id: string; name: string; iconName: IconName; to: Destination };
const emptyStudies: CustomStudy[] = [];
let studies = emptyStudies;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function updateStudies(next: CustomStudy[]) { studies = next; listeners.forEach(listener => listener()); }
export function useCustomStudies() { return useSyncExternalStore(subscribe, () => studies, () => emptyStudies); }

export function StudyEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const entries = useCustomStudies();
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState<IconName>('Star');
  const [to, setTo] = useState<Destination>('/words');
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  function reset() { setName(''); setIconName('Star'); setTo('/words'); setEditing(null); setError(''); }
  const Icon = iconChoices.find(choice => choice.name === iconName)?.icon ?? BookOpen;
  return <Dialog open={open} onOpenChange={value => { if (!value) reset(); onOpenChange(value); }}>
    <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg shadow-none">
      <DialogHeader><DialogTitle>Add a study</DialogTitle><DialogDescription>Custom studies · This visit only</DialogDescription></DialogHeader>
      <form className="space-y-5" onSubmit={event => {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) { setError('Enter a name for your study.'); return; }
        const entry = { id: editing ?? crypto.randomUUID(), name: trimmed, iconName, to };
        updateStudies(editing ? entries.map(item => item.id === editing ? entry : item) : [...entries, entry]);
        reset();
      }}>
        <div className="space-y-2"><label htmlFor="study-name" className="text-sm font-semibold">Name</label><Input id="study-name" maxLength={24} value={name} placeholder="e.g. Astronomy" onChange={event => { setName(event.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'study-error' : undefined}/>{error && <p id="study-error" role="alert" className="text-sm text-destructive">{error}</p>}</div>
        <fieldset><legend className="mb-2 text-sm font-semibold">Icon</legend><div className="grid grid-cols-4 gap-2">{iconChoices.map(({name: choice, icon: ChoiceIcon}) => <Button key={choice} type="button" variant={choice === iconName ? 'secondary' : 'outline'} className="h-12" aria-label={choice + ' icon'} title={choice} aria-pressed={choice === iconName} onClick={() => setIconName(choice)}><ChoiceIcon/></Button>)}</div></fieldset>
        <div className="space-y-2"><label htmlFor="study-destination" className="block text-sm font-semibold">Opens</label><select id="study-destination" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={to} onChange={event => { const destination = studyDestinations.find(item => item.to === event.target.value); if (destination) setTo(destination.to); }}>{studyDestinations.map(item => <option key={item.to} value={item.to}>{item.label}</option>)}</select></div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4"><span className="flex min-w-0 items-center gap-2 text-sm"><Icon className="size-5 shrink-0"/><span className="break-all">{name.trim() || 'New study'}</span></span><Button type="submit">{editing ? <Check/> : <Plus/>}{editing ? 'Save study' : 'Add study'}</Button></div>
        {editing && <Button variant="ghost" type="button" onClick={reset}>Cancel editing</Button>}
      </form>
      {entries.length > 0 && <div className="space-y-2 border-t border-border pt-4"><h3 className="text-sm font-semibold">Your studies</h3>{entries.map(entry => {
        const EntryIcon = iconChoices.find(choice => choice.name === entry.iconName)?.icon ?? BookOpen;
        return <div key={entry.id} className="flex items-center gap-2"><EntryIcon className="size-4 shrink-0"/><span className="min-w-0 flex-1 break-words text-sm">{entry.name}</span><Button size="icon" variant="ghost" title={'Edit ' + entry.name} aria-label={'Edit ' + entry.name} onClick={() => { setName(entry.name); setIconName(entry.iconName); setTo(entry.to); setEditing(entry.id); setError(''); }}><PencilIcon/></Button><Button size="icon" variant="ghost" title={'Remove ' + entry.name} aria-label={'Remove ' + entry.name} onClick={() => { updateStudies(entries.filter(item => item.id !== entry.id)); if (editing === entry.id) reset(); }}><Trash2/></Button></div>;
      })}</div>}
    </DialogContent>
  </Dialog>;
}
