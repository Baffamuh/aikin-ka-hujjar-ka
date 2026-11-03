import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/site/SiteChrome";
import { ProjectCard } from "@/components/site/ProjectCard";
import { projectsQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/projects")({
  head: () => ({
    meta: [
      { title: "Track Record & Projects — IMBA" },
      { name: "description", content: "Searchable database of IMBA's verified 2015–2019 constituency projects and senatorial commitments." },
      { property: "og:title", content: "IMBA Track Record & Projects" },
      { property: "og:description", content: "Classrooms, ICT centres, buses, textbooks — verify every project." },
    ],
  }),
  component: Projects,
});

const sel = "h-10 rounded-md border bg-card px-3 text-sm";

function Projects() {
  const { data = [], isLoading } = useQuery(projectsQuery());
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [lga, setLga] = useState("");
  const [tenure, setTenure] = useState("");
  const cats = Array.from(new Set(data.map((p) => p.category)));
  const lgas = Array.from(new Set(data.map((p) => p.lga)));
  const list = useMemo(() => data.filter((p) =>
    (!cat || p.category === cat) && (!lga || p.lga === lga) && (!tenure || p.tenure === tenure) &&
    (!q || `${p.title} ${p.location} ${p.scope}`.toLowerCase().includes(q.toLowerCase()))), [data, q, cat, lga, tenure]);

  return (
    <>
      <PageHeader eyebrow="Aikin Ka Hujjar Ka" title="Track record & projects" intro="Every project below is named, located and open to verification by the communities it serves." />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-4">
          <Input placeholder="Search school, community…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className={sel} value={lga} onChange={(e) => setLga(e.target.value)} aria-label="LGA">
            <option value="">All locations</option>{lgas.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className={sel} value={tenure} onChange={(e) => setTenure(e.target.value)} aria-label="Tenure">
            <option value="">All tenures</option>
            <option value="completed">2015–2019 Completed</option>
            <option value="commitment">Senatorial Commitments</option>
          </select>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{isLoading ? "Loading…" : `${list.length} project${list.length === 1 ? "" : "s"}`}</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}
