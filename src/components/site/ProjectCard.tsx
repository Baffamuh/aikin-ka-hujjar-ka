import { MapPin, CalendarDays, School } from "lucide-react";
import type { Project } from "@/lib/site";

export function ProjectCard({ p }: { p: Project }) {
  const done = p.tenure === "completed";
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-elegant">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {p.image_url ? (
          <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center bg-hero text-on-deep">
            <School className="h-12 w-12 opacity-60" />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"}`}>
          {done ? "✓ Completed" : "Senatorial Commitment"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.scope ?? p.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location ? `${p.location}, ` : ""}{p.lga}</span>
          {p.year && <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{p.year}</span>}
        </div>
      </div>
    </article>
  );
}
