import type { ReactNode } from 'react';
export function Section({ number, title, subtitle, action, children }: { number: string; title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="space-y-5 border-t border-border pt-7"><div className="flex items-start justify-between gap-3"><div><div className="mb-1 flex items-center gap-2"><span className="text-xs font-semibold text-muted-foreground">{number}</span><h2 className="text-xl font-semibold">{title}</h2></div>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</div>{action}</div>{children}</section>;
}
