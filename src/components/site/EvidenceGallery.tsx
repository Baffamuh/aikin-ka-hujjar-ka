import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { EVIDENCE, SECTORS, type Evidence } from "@/lib/evidence";

export function EvidenceGallery({ limit }: { limit?: number }) {
  const [sector, setSector] = useState<string>("All");
  const [idx, setIdx] = useState<number | null>(null);
  const all = EVIDENCE.filter((e) => sector === "All" || e.sector === sector);
  const list = limit ? all.slice(0, limit) : all;
  const used = ["All", ...SECTORS.filter((s) => EVIDENCE.some((e) => e.sector === s))];
  const open: Evidence | null = idx === null ? null : list[idx];
  const step = (d: number) => setIdx((i) => (i === null ? i : (i + d + list.length) % list.length));

  return (
    <div>
      {!limit && (
        <div className="flex flex-wrap gap-2">
          {used.map((c) => (
            <button key={c} onClick={() => setSector(c)} className={`rounded-full border px-4 py-1.5 text-sm transition ${sector === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{c}</button>
          ))}
        </div>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {list.map((e, i) => (
          <button key={e.id} onClick={() => setIdx(i)} className="group relative aspect-square overflow-hidden rounded-xl border bg-muted text-left">
            <img src={e.src} alt={e.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/85 to-transparent p-3">
              <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">{e.sector}</span>
              <p className="mt-1 text-sm font-semibold leading-tight text-background">{e.title}</p>
            </div>
          </button>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/90 p-4" onClick={() => setIdx(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-background p-2" aria-label="Close"><X className="h-5 w-5" /></button>
          <button className="absolute left-2 top-1/2 rounded-full bg-background p-2 md:left-6" aria-label="Previous" onClick={(ev) => { ev.stopPropagation(); step(-1); }}><ChevronLeft className="h-5 w-5" /></button>
          <button className="absolute right-2 top-1/2 rounded-full bg-background p-2 md:right-6" aria-label="Next" onClick={(ev) => { ev.stopPropagation(); step(1); }}><ChevronRight className="h-5 w-5" /></button>
          <figure className="max-w-4xl" onClick={(ev) => ev.stopPropagation()}>
            <img src={open.src} alt={open.title} className="max-h-[75vh] rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-background">
              <p className="font-semibold">{open.title}</p>
              <p className="text-sm opacity-80">{open.caption}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
