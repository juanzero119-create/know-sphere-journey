import { useState, type FormEvent } from 'react';
import { Check, ChevronLeft, ChevronRight, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Section } from '@/components/Section';
import { FilmChip } from '@/components/FilmChip';
import { filmographyForActor } from '@/lib/film-search';
import { movies } from '@/lib/movies';

const highlights = [
 { id: 'none', label: 'None', className: '', swatch: 'bg-card' },
 { id: 'gold', label: 'Gold', className: 'bg-name-gold', swatch: 'bg-name-gold' },
 { id: 'blue', label: 'Blue', className: 'bg-name-blue', swatch: 'bg-name-blue' },
 { id: 'rose', label: 'Rose', className: 'bg-name-rose', swatch: 'bg-name-rose' },
 { id: 'green', label: 'Green', className: 'bg-name-green', swatch: 'bg-name-green' },
] as const;
type Highlight = (typeof highlights)[number]['id'];
type ActorDraft = { firstName: string; lastName: string; role: string; film: string; bio: string; firstHighlight: Highlight; lastHighlight: Highlight };
type Actor = ActorDraft & { id: number };
const emptyDraft: ActorDraft = { firstName: '', lastName: '', role: '', film: '', bio: '', firstHighlight: 'gold', lastHighlight: 'blue' };
// "The 50 Most Talented Male Actors By Screen Achievement" (imdb.com/list/ls000759379)
import imdbBios from '@/lib/actor-bios.json';
import imdbPortraits from '@/lib/actor-portraits.json';
const bios = imdbBios as Record<string, string>;
const portraits = imdbPortraits as Record<string, string>;
function ActorPortrait({ firstName, lastName }: { firstName: string; lastName: string }) {
 const url = portraits[`${firstName} ${lastName}`];
 if (url) return <img src={url} alt={`Portrait of ${firstName} ${lastName}`} loading="lazy" className="size-14 shrink-0 rounded-xl border border-border object-cover"/>;
 return <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-sm font-semibold text-secondary-foreground">{firstName.charAt(0)}{lastName.charAt(0)}</span>;
}
const imdbNames = ['Leonardo DiCaprio','Jeff Bridges','Daniel Day-Lewis','Anthony Hopkins','Al Pacino','Philip Seymour Hoffman','Denzel Washington','Robert De Niro','Jack Nicholson','Javier Bardem','Tom Hanks','Christian Bale','Ben Kingsley','Edward Norton','Tom Hardy','George Clooney','Michael Caine','Robert Downey Jr.','Ralph Fiennes','Ryan Gosling','Sam Rockwell','Tom Wilkinson','Forest Whitaker','Kevin Spacey','Brad Pitt','Christopher Plummer','Robert Duvall','Joaquin Phoenix','Gary Oldman','Samuel L. Jackson','Benicio Del Toro','Jamie Foxx','Liam Neeson','Mark Wahlberg','Gene Hackman','Tim Roth','Sean Penn','Morgan Freeman','Tommy Lee Jones','Clint Eastwood','Ian McKellen','Don Cheadle','Colin Farrell','Johnny Depp','Ray Winstone','Stephen Rea','William H. Macy','Adrien Brody','Michael Gambon','Brendan Gleeson','Marlon Brando','Paul Newman','James Stewart','Gregory Peck','Kirk Douglas','Burt Lancaster','Sidney Poitier','Henry Fonda','Cary Grant','Humphrey Bogart','Spencer Tracy','Laurence Olivier','Alec Guinness',"Peter O'Toole",'Richard Burton','Robert Mitchum','Charlton Heston','James Mason','Orson Welles','James Cagney','Dustin Hoffman','Jon Voight','Christopher Walken','Harvey Keitel','Willem Dafoe','John Malkovich','Geoffrey Rush','Russell Crowe','Hugh Jackman','Matthew McConaughey','Jake Gyllenhaal','Michael Fassbender','Benedict Cumberbatch','Eddie Redmayne','Casey Affleck','Viggo Mortensen','Ethan Hawke','Ed Harris','Bill Murray','Steve Buscemi','John Goodman','Jeff Goldblum','Kurt Russell','Harrison Ford','Mel Gibson','Bruce Willis','Keanu Reeves','Nicolas Cage','John Travolta','Robin Williams'];
const seedActors: Actor[] = imdbNames.map((name, i) => { const parts = name.split(' '); const lastName = parts.pop() ?? ''; return { id: i + 1, firstName: parts.join(' '), lastName, role: '', film: '', bio: bios[name] ?? '', firstHighlight: 'gold', lastHighlight: 'blue' }; });

function HighlightPicker({ label, value, onChange }: { label: string; value: Highlight; onChange: (value: Highlight) => void }) {
 return <fieldset><legend className="mb-2 text-sm font-medium">{label}</legend><div className="flex gap-2">{highlights.map(h => <Button key={h.id} type="button" variant="outline" size="icon" title={`${label}: ${h.label}`} aria-label={`${label}: ${h.label}`} aria-pressed={value === h.id} onClick={() => onChange(h.id)} className={`border-2 hover:bg-muted ${value === h.id ? 'border-primary' : 'border-border'}`}><span className={`grid size-6 place-items-center rounded-sm text-foreground ${h.swatch}`}>{value === h.id ? <Check className="size-4"/> : h.id === 'none' ? <X className="size-3"/> : null}</span></Button>)}</div></fieldset>;
}
function ActorName({ actor, preview = false }: { actor: ActorDraft; preview?: boolean }) {
 const part = (name: string, color: Highlight, fallback: string) => <span className={`rounded-sm px-1 py-0.5 ${highlights.find(h => h.id === color)?.className ?? ''}`}>{name || (preview ? fallback : '')}</span>;
 return <span className="flex flex-wrap gap-x-1 gap-y-2 break-words [overflow-wrap:anywhere]">{part(actor.firstName, actor.firstHighlight, 'First name')}{part(actor.lastName, actor.lastHighlight, 'Last name')}</span>;
}
/** Beveled tiles for every film this actor appears in, revealed by the Details button. */
function ActorFilms({ name, films }: { name: string; films: ReturnType<typeof filmographyForActor> }) {
 if (films.length === 0) return null;
 return <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Films featuring ${name}`}>{films.map(f => <FilmChip key={f.movie.id} movie={f.movie} note={f.role}/>)}</div>;
}
export function ActorEditor() {
 const [actors, setActors] = useState<Actor[]>(seedActors);
 const [draft, setDraft] = useState<ActorDraft>({ ...emptyDraft });
  const [editingId, setEditingId] = useState<number | null>(null);
   const [openId, setOpenId] = useState<number | null>(null);
   const [detailsId, setDetailsId] = useState<number | null>(null);
 const [message, setMessage] = useState('');
 const update = <K extends keyof ActorDraft>(key: K, value: ActorDraft[K]) => setDraft(old => ({ ...old, [key]: value }));
 function reset() { setDraft({ ...emptyDraft }); setEditingId(null); }
 function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (!draft.firstName.trim() || !draft.lastName.trim()) { setMessage('Enter a first and last name.'); return; }
  const actor = { ...draft, firstName: draft.firstName.trim(), lastName: draft.lastName.trim(), role: draft.role.trim(), bio: draft.bio.trim() };
  if (editingId !== null) { setActors(old => old.map(a => a.id === editingId ? { ...actor, id: editingId } : a)); setMessage('Actor updated.'); }
  else { setActors(old => [...old, { ...actor, id: Date.now() }]); setMessage('Actor added.'); }
  reset();
 }
 return <Section number="02" title="Actors" subtitle="Your cast collection · This visit">
 <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
 <form onSubmit={submit} className="min-w-0 space-y-5">
 <h3 className="text-base font-semibold">{editingId !== null ? 'Edit actor' : 'Add an actor'}</h3>
 <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium"><span>First name</span><Input required maxLength={80} value={draft.firstName} onChange={e => update('firstName', e.target.value)} placeholder="First name" className="bg-card"/></label><label className="space-y-2 text-sm font-medium"><span>Last name</span><Input required maxLength={80} value={draft.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Last name" className="bg-card"/></label></div>
 <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium"><span>Film <span className="font-normal text-muted-foreground">(optional)</span></span><select aria-label="Actor film" value={draft.film} onChange={e => update('film', e.target.value)} className="h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 text-sm"><option value="">No film selected</option>{movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select></label><label className="space-y-2 text-sm font-medium"><span>Character <span className="font-normal text-muted-foreground">(optional)</span></span><Input maxLength={100} value={draft.role} onChange={e => update('role', e.target.value)} placeholder="Character name" className="bg-card"/></label></div>
  <label className="space-y-2 text-sm font-medium"><span>Bio <span className="font-normal text-muted-foreground">(optional)</span></span><textarea aria-label="Actor bio" maxLength={600} rows={3} value={draft.bio} onChange={e => update('bio', e.target.value)} placeholder="A short bio for this actor" className="w-full min-w-0 rounded-md border border-input bg-card px-3 py-2 text-sm"/></label>
  <div className="grid gap-5 sm:grid-cols-2"><HighlightPicker label="First-name highlight" value={draft.firstHighlight} onChange={v => update('firstHighlight', v)}/><HighlightPicker label="Last-name highlight" value={draft.lastHighlight} onChange={v => update('lastHighlight', v)}/></div>
 <div className="flex gap-3"><Button type="submit">{editingId !== null ? <Check/> : <Plus/>}{editingId !== null ? 'Save changes' : 'Add actor'}</Button>{editingId !== null && <Button type="button" variant="secondary" onClick={reset}>Cancel</Button>}</div>
 <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">{message}</p>
 </form>
 <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="text-xs font-semibold text-muted-foreground">NAME PREVIEW</p><div className="mt-5 min-h-20 text-2xl font-semibold"><ActorName actor={draft} preview/></div><p className="mt-3 text-sm text-muted-foreground">{draft.role || 'Character'}{draft.film && ` · ${movies.find(m => m.id === draft.film)?.title}`}</p></div>
 </div>
 <div className="border-t border-border pt-5"><h3 className="mb-4 text-sm font-semibold">Added actors <span className="ml-1 text-muted-foreground">({actors.length})</span></h3>{actors.length === 0 ? <p className="py-4 text-sm text-muted-foreground">No actors added yet.</p> : <div className="divide-y divide-border">{actors.map(a => { const name = `${a.firstName} ${a.lastName}`; const films = filmographyForActor(name); return <article key={a.id} className="flex items-start justify-between gap-3 py-4"><ActorPortrait firstName={a.firstName} lastName={a.lastName}/><div className="min-w-0"><h4 className="text-lg font-semibold"><ActorName actor={a}/></h4>{(a.role || a.film) && <p className="mt-2 text-sm text-muted-foreground">{[a.role, movies.find(m => m.id === a.film)?.title].filter(Boolean).join(' · ')}</p>}{openId === a.id && <p className="mt-2 text-sm text-muted-foreground">{a.bio || 'No bio yet — edit this actor to add one.'}</p>}{films.length > 0 && <Button type="button" size="sm" variant="outline" className="mt-3" aria-expanded={detailsId === a.id} aria-label={`${detailsId === a.id ? 'Hide' : 'Show'} details for ${name}`} onClick={() => setDetailsId(old => old === a.id ? null : a.id)}>{detailsId === a.id ? <ChevronLeft/> : <ChevronRight/>}Details</Button>}{detailsId === a.id && <ActorFilms name={name} films={films}/>}</div><div className="flex shrink-0 gap-1"><Button type="button" size="icon" variant="ghost" aria-label={openId === a.id ? `Hide bio for ${a.firstName} ${a.lastName}` : `Show bio for ${a.firstName} ${a.lastName}`} title={openId === a.id ? 'Hide bio' : 'Show bio'} aria-expanded={openId === a.id} onClick={() => setOpenId(old => old === a.id ? null : a.id)}>{openId === a.id ? <ChevronLeft/> : <ChevronRight/>}</Button><Button type="button" size="icon" variant="ghost" aria-label={`Edit ${a.firstName} ${a.lastName}`} title="Edit actor" onClick={() => { setDraft({ ...a }); setEditingId(a.id); setMessage(''); }}><Pencil/></Button><Button type="button" size="icon" variant="ghost" aria-label={`Remove ${a.firstName} ${a.lastName}`} title="Remove actor" onClick={() => {setActors(old => old.filter(actor => actor.id !== a.id)); if (editingId === a.id) reset(); setMessage('Actor removed.');}}><Trash2/></Button></div></article>; })}</div>}</div>
 </Section>;
}
