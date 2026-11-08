import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Bus, CheckCircle2, Droplets, HeartPulse, Monitor, Route as RoadIcon, Users, Zap } from "lucide-react";
import { PageHeader } from "@/components/site/SiteChrome";
import { EvidenceGallery } from "@/components/site/EvidenceGallery";
import { Button } from "@/components/ui/button";
import { RECORD, EVIDENCE } from "@/lib/evidence";

export const Route = createFileRoute("/_site/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements & Photo Proof — Hon. IMBA (2015–2019)" },
      { name: "description", content: "Schools, ICT centres, buses, boreholes, transformers, health support and empowerment delivered by Hon. Ibrahim Mohammed Baba, with photo evidence." },
      { property: "og:title", content: "IMBA Achievements — Your Work Is Your Proof" },
      { property: "og:description", content: "The full record of IMBA's constituency delivery, sector by sector, with photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Achievements,
});

const ICONS = { Education: BookOpen, ICT: Monitor, Transport: Bus, Health: HeartPulse, Water: Droplets, Electricity: Zap, "Roads & Drainage": RoadIcon, Empowerment: Users, Community: Users } as const;

function Achievements() {
  return (
    <>
      <PageHeader eyebrow="IMBA Achievements · Jikan Nanna · Barden Gabas" title="Your Work Is Your Proof — the full record" intro="What Hon. Ibrahim Mohammed Baba delivered for Katagum Federal Constituency between 2015 and 2019, organised by sector and backed by photographs from the field." />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[["11", "School projects"], ["3", "ICT centres"], ["3", "Student buses"], [String(EVIDENCE.length), "Photo proofs"]].map(([n, l]) => (
            <div key={l} className="rounded-2xl border bg-card p-5 text-center shadow-elegant">
              <p className="font-display text-4xl font-bold text-primary">{n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RECORD.map((r) => {
            const Icon = ICONS[r.sector];
            return (
              <article key={r.title} className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span>
                  <h2 className="text-xl font-semibold">{r.title}</h2>
                </div>
                <ul className="mt-4 space-y-2">
                  {r.items.map((i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/85"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{i}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Some items are reported by communities and supporters; citizens are welcome to share more evidence through the contact page.</p>
      </section>
      <section className="bg-secondary py-14">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hujja · Evidence</p>
          <h2 className="mt-1 text-3xl font-semibold">Photo proof from the field</h2>
          <div className="mt-6"><EvidenceGallery /></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 text-center">
        <h2 className="text-2xl font-semibold">Now, the same standard for all of Bauchi North</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/senatorial-agenda">Read the senatorial agenda</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/projects">Browse project database</Link></Button>
        </div>
      </section>
    </>
  );
}
