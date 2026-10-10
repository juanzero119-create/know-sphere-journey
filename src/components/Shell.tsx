import { Link } from "@tanstack/react-router";
import { BookA, Bone, GraduationCap, Clapperboard } from "lucide-react";
import type { ReactNode } from "react";
import { useProgress } from "@/lib/progress";

const tabs = [
  { to: "/words", label: "Words", icon: BookA },
  { to: "/", label: "Practice", icon: GraduationCap },
  { to: "/anatomy", label: "Anatomy", icon: Bone },
  { to: "/watch", label: "Watch", icon: Clapperboard },
] as const;

export function Shell({ title, children }: { title: string; children: ReactNode }) {
  const { xp, streak } = useProgress();
  return (
    <div className="mx-auto min-h-screen max-w-xl pb-28">
      <header className="flex items-end justify-between px-5 pt-8 pb-4">
        <h1 className="font-display text-5xl">{title}</h1>
        <div className="flex gap-2 text-sm font-semibold">
          <span className="chunky rounded-full bg-accent px-3 py-1 text-accent-foreground">🔥 {streak}</span>
          <span className="chunky rounded-full bg-gold px-3 py-1 text-ink">{xp} XP</span>
        </div>
      </header>
      <main className="space-y-6 px-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 border-t-2 bg-muted">
        <div className="mx-auto grid max-w-xl grid-cols-4 py-3">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 text-sm text-muted-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              <Icon className="size-6" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
