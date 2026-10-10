import { useState, useSyncExternalStore } from 'react';
import { BookOpen, Bone, Star, Heart, Music, Globe, FlaskConical, Pencil, Trash2, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const iconChoices = [
  { name: 'Book', icon: BookOpen }, { name: 'Anatomy', icon: Bone },
  { name: 'Star', icon: Star }, { name: 'Heart', icon: Heart },
  { name: 'Music', icon: Music }, { name: 'Globe', icon: Globe },
  { name: 'Science', icon: FlaskConical }, { name: 'Pencil', icon: Pencil },
] as const;
const destinations = [
  { to: '/studies', label: 'Studies' }, { to: '/words', label: 'Vocabulary' },
  { to: '/anatomy', label: 'Anatomy' }, { to: '/', label: 'Practice' },
  { to: '/watch', label: 'Watch' }, { to: '/movies', label: 'Movies' },
] as const;
type Destination = typeof destinations[number]['to'];
type IconName = typeof iconChoices[number]['name'];
export type CustomNavigationItem = { id: string; label: string; iconName: IconName; to: Destination };
const emptyItems: CustomNavigationItem[] = [];
let items = emptyItems;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function updateItems(next: CustomNavigationItem[]) { items = next; listeners.forEach(listener => listener()); }
export function useCustomNavigation() { return useSyncExternalStore(subscribe, () => items, () => emptyItems); }

export function NavigationEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const entries = useCustomNavigation();
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState<IconName>('Star');
  const [to, setTo] = useState<Destination>('/studies');
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState('');
  function reset() { setName(''); setIconName('Star'); setTo('/studies'); setEditing(null); setError(''); }
  const Icon = iconChoices.find(choice => choice.name === iconName)?.icon ?? Star;
  return <Dialog open={open} onOpenChange={value => { if (!value) reset(); onOpenChange(value); }}>
    <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg shadow-none">
      <DialogHeader><DialogTitle>Navigation icons</DialogTitle><DialogDescription>Custom icons · This visit only</DialogDescription></DialogHeader>
      <form className="space-y-5" onSubmit={event => {
        event.preventDefault();
        const label = name.trim();
        if (!label) { setError('Enter a name for your icon.'); return; }
        const entry = { id: editing ?? crypto.randomUUID(), label, iconName, to };
        updateItems(editing ? entries.map(item => item.id === editing ? entry : item) : [...entries, entry]);
        reset();
      }}>
        <div className="space-y-2"><label htmlFor="navigation-name" className="text-sm font-semibold">Name</label><Input id="navigation-name" maxLength={20} value={name} placeholder="e.g. Science" onChange={event => { setName(event.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'navigation-error' : undefined}/>{error && <p id="navigation-error" role="alert" className="text-sm text-destructive">{error}</p>}</div>
        <fieldset><legend className="mb-2 text-sm font-semibold">Icon</legend><div className="grid grid-cols-4 gap-2">{iconChoices.map(({name: choice, icon: ChoiceIcon}) => <Button key={choice} type="button" variant={choice === iconName ? 'secondary' : 'outline'} className="h-12" aria-label={choice + ' icon'} title={choice} aria-pressed={choice === iconName} onClick={() => setIconName(choice)}><ChoiceIcon/></Button>)}</div></fieldset>
        <div className="space-y-2"><label htmlFor="navigation-destination" className="block text-sm font-semibold">Opens</label><select id="navigation-destination" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={to} onChange={event => { const destination = destinations.find(item => item.to === event.target.value); if (destination) setTo(destination.to); }}>{destinations.map(item => <option key={item.to} value={item.to}>{item.label}</option>)}</select></div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4"><span className="flex min-w-0 items-center gap-2 text-sm"><Icon className="size-5 shrink-0"/><span className="break-all">{name.trim() || 'New icon'}</span></span><Button type="submit">{editing ? <Check/> : <Plus/>}{editing ? 'Save icon' : 'Add icon'}</Button></div>
        {editing && <Button variant="ghost" type="button" onClick={reset}>Cancel editing</Button>}
      </form>
      {entries.length > 0 && <div className="space-y-2 border-t border-border pt-4"><h3 className="text-sm font-semibold">Your icons</h3>{entries.map(entry => {
        const EntryIcon = iconChoices.find(choice => choice.name === entry.iconName)?.icon ?? Star;
        return <div key={entry.id} className="flex items-center gap-2"><EntryIcon className="size-4 shrink-0"/><span className="min-w-0 flex-1 break-words text-sm">{entry.label}</span><Button size="icon" variant="ghost" title={'Edit ' + entry.label} aria-label={'Edit ' + entry.label} onClick={() => { setName(entry.label); setIconName(entry.iconName); setTo(entry.to); setEditing(entry.id); setError(''); }}><Pencil/></Button><Button size="icon" variant="ghost" title={'Remove ' + entry.label} aria-label={'Remove ' + entry.label} onClick={() => { updateItems(entries.filter(item => item.id !== entry.id)); if (editing === entry.id) reset(); }}><Trash2/></Button></div>;
      })}</div>}
    </DialogContent>
  </Dialog>;
}