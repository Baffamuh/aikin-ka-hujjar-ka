import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HeartPulse, Droplets, Briefcase, Route as RoadIcon, Wheat, Users, Landmark, Sprout } from "lucide-react";
import { PageHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { LGAS, projectsQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/senatorial-agenda")({
  head: () => ({
    meta: [
      { title: "Senatorial Agenda for Bauchi North — IMBA" },
      { name: "description", content: "IMBA's commitments for Bauchi North: healthcare, water, jobs, rural roads, women, farming and federal advocacy." },
      { property: "og:title", content: "IMBA Senatorial Agenda — Bauchi North" },
      { property: "og:description", content: "Transparent campaign commitments for all 7 LGAs." },
    ],
  }),
  component: Agenda,
});

const ICONS: Record<string, typeof HeartPulse> = {
  Healthcare: HeartPulse, "Clean Water": Droplets, "Jobs & Youth": Briefcase, Infrastructure: RoadIcon,
  Agriculture: Wheat, "Women Empowerment": Users, Legislation: Landmark,
};

function Agenda() {
  const { data = [] } = useQuery(projectsQuery());
  const items = data.filter((p) => p.tenure === "commitment");
  return (
    <>
      <PageHeader eyebrow="Senatorial Agenda" title="Commitments to Bauchi North" intro="Clear, published promises — so that tomorrow, like yesterday, the work will be the proof." />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p) => {
            const Icon = ICONS[p.category] ?? Sprout;
            return (
              <div key={p.id} className="flex gap-4 rounded-2xl border bg-card p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-gold"><Icon className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                  <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.scope ?? p.summary}</p>
                  <span className="mt-3 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{p.status}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-14 rounded-2xl bg-secondary p-8">
          <h2 className="text-2xl font-semibold">Serving all seven LGAs</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {LGAS.map((l) => <span key={l} className="rounded-full bg-card px-4 py-1.5 text-sm font-medium">{l}</span>)}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Have a need in your ward that belongs on this agenda? Tell us directly.</p>
          <Button asChild className="mt-4"><Link to="/complaints">Submit a community request</Link></Button>
        </div>
      </section>
    </>
  );
}
