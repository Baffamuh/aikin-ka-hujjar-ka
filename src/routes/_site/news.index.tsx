import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/site/SiteChrome";
import { newsQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/news/")({
  head: () => ({
    meta: [
      { title: "News & Activities — IMBA" },
      { name: "description", content: "Community engagements, rallies, project inspections and press statements from Hon. IMBA." },
      { property: "og:title", content: "IMBA News & Activities" },
      { property: "og:description", content: "Latest updates from the IMBA campaign across Bauchi North." },
    ],
  }),
  component: NewsList,
});

function NewsList() {
  const { data = [] } = useQuery(newsQuery());
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(data.map((n) => n.category)))];
  const list = data.filter((n) => cat === "All" || n.category === cat);
  return (
    <>
      <PageHeader eyebrow="Newsroom" title="News & activities" />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group overflow-hidden rounded-2xl border bg-card">
              {n.image_url && <img src={n.image_url} alt={n.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{n.category} · {new Date(n.published_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
                <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">{n.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
