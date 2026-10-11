import { useState } from 'react';
import portraits from '@/lib/actor-portraits.json';

export function ActorPortrait({ name }: { name: string }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const normalizedName = name.replace(/[’‘]/g, "'");
  const url = (portraits as Record<string, string>)[normalizedName];
  const initials = name.split(/\s+/).filter(Boolean).map(part => part.charAt(0)).slice(0, 2).join('');
  if (!url || failedUrl === url) {
    return <span aria-label={`Portrait unavailable for ${name}`} role="img" className="grid size-14 shrink-0 place-items-center rounded-lg border border-border bg-secondary text-sm font-semibold text-secondary-foreground">{initials}</span>;
  }
  return <img src={url} alt={`Portrait of ${name}`} width={56} height={56} loading="lazy" decoding="async" onError={() => setFailedUrl(url)} className="size-14 shrink-0 rounded-lg border border-border object-cover" />;
}