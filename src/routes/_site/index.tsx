import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Megaphone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApcBadge, ContestBadge } from "@/components/site/SiteChrome";
import { ProjectCard } from "@/components/site/ProjectCard";
import { UpcomingEvents } from "@/components/site/UpcomingEvents";
import { EvidenceGallery } from "@/components/site/EvidenceGallery";
import { LGAS, PORTRAIT, POSTER, CAMPAIGN_POSTER, newsQuery, projectsQuery, settingsQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Hon. Ibrahim Mohammed Baba (IMBA) — APC Senate, Bauchi North" },
      { name: "description", content: "Aikin Ka Hujjar Ka. Verify IMBA's 2015–2019 projects, read the senatorial agenda, and submit or track community requests." },
      { property: "og:title", content: "Hon. Ibrahim Mohammed Baba (IMBA) — APC, Bauchi North" },
      { property: "og:description", content: "Your work is your proof. Official platform and citizen accountability portal." },
    ],
  }),
  component: Home,
});

const STATS = [
  { n: "50+", l: "Classrooms Built" },
  { n: "3", l: "ICT Centres" },
  { n: "3", l: "School Buses" },
  { n: "10,000+", l: "Textbooks" },
  { n: "7", l: "LGAs in Bauchi North" },
];

function Home() {
  const { data: s } = useQuery(settingsQuery());
  const { data: projects = [] } = useQuery(projectsQuery());
  const { data: news = [] } = useQuery(newsQuery());
  const [cat, setCat] = useState("All");
  const completed = projects.filter((p) => p.tenure === "completed");
  const cats = ["All", ...Array.from(new Set(completed.map((p) => p.category)))];
  const shown = completed.filter((p) => cat === "All" || p.category === cat).slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden bg-hero text-on-deep">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <div className="flex flex-wrap gap-2"><ApcBadge /><ContestBadge /></div>
            <p className="mt-6 font-display text-xl italic text-gold">“{s?.slogan ?? "Aikin Ka Hujjar Ka"}”</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-6xl">{s?.hero_title ?? "Hon. Ibrahim Mohammed Baba (IMBA)"}</h1>
            <p className="mt-5 max-w-xl text-base opacity-90 md:text-lg">{s?.hero_subtitle}</p>
            <p className="mt-3 max-w-xl text-sm opacity-75">
              Former Member, House of Representatives for Katagum Federal Constituency (2015–2019). Classrooms, ICT centres, school buses and textbooks — delivered, documented, and open to verification.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/projects">View Track Record <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="border-on-deep/40 bg-transparent text-on-deep hover:bg-on-deep/10 hover:text-on-deep"><Link to="/complaints">Submit a Complaint/Request</Link></Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-[2rem] border-2 border-gold/50" />
            <img src={CAMPAIGN_POSTER} alt="People’s Choice 2027: Vote Hon. Ibrahim Mohammed Baba (IMBA), APC, for Senator" className="relative w-full rounded-[1.6rem] shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-7xl px-4">
        <div className="relative rounded-2xl border bg-card p-6 shadow-elegant md:p-8">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Aikin Ka Hujjar Ka</p>
              <h2 className="mt-1 text-2xl font-semibold md:text-3xl">The record speaks for itself</h2>
            </div>
            <Link to="/projects" className="text-sm font-medium text-primary">See every project →</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            {STATS.map((x) => (
              <div key={x.l} className="rounded-xl bg-secondary p-4 text-center">
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">{x.n}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground md:text-sm">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <h2 className="text-3xl font-semibold">Featured constituency projects</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Hujja · Photo proof</p>
            <h2 className="mt-1 text-3xl font-semibold">Schools, water, power, health — on the ground</h2>
          </div>
          <Link to="/achievements" className="text-sm font-medium text-primary">See all achievements →</Link>
        </div>
        <EvidenceGallery limit={8} />
      </section>



      <section className="mx-auto mt-20 grid max-w-7xl gap-10 px-4 md:grid-cols-2">
        <img src={POSTER} alt="Aikin Ka Hujjar Ka project evidence" className="w-full rounded-2xl object-cover shadow-elegant md:max-h-[560px]" />
        <div className="self-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Senatorial Vision</p>
          <h2 className="mt-2 text-3xl font-semibold">One district, seven LGAs, one standard of delivery</h2>
          <p className="mt-4 text-muted-foreground">The same results-first approach that transformed schools in Katagum, extended across all of Bauchi North: healthcare, clean water, jobs, rural roads and the dividends of democracy.</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LGAS.map((l) => <span key={l} className="rounded-lg border bg-card px-3 py-2 text-center text-sm font-medium">{l}</span>)}
          </div>
          <Button asChild className="mt-6"><Link to="/senatorial-agenda">Read the agenda</Link></Button>
        </div>
      </section>

      <UpcomingEvents />

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Latest activities & news</h2>
          <Link to="/news" className="text-sm font-medium text-primary">All news →</Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {news.slice(0, 3).map((n) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group overflow-hidden rounded-2xl border bg-card">
              {n.image_url && <img src={n.image_url} alt={n.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{n.category}</p>
                <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{n.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <div className="grid gap-6 rounded-2xl bg-accent p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-accent-foreground"><Megaphone className="h-6 w-6" /> Your voice, on record</h2>
            <p className="mt-2 max-w-2xl text-accent-foreground/80">Submit a complaint, petition or community request — no account needed. You'll get a tracking code to follow every step.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/complaints">Submit request</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/track"><Search className="mr-1 h-4 w-4" />Track</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
