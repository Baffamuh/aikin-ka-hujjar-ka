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
        {list[0] && (
          <Link to="/news/$slug" params={{ slug: list[0].slug }} className="group mt-8 grid overflow-hidden rounded-3xl border bg-card shadow-elegant md:grid-cols-[1.3fr_1fr]">
            {list[0].image_url && <div className="overflow-hidden"><img src={list[0].image_url} alt={list[0].title} className="aspect-[4/3] h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" /></div>}
            <div className="flex flex-col justify-center p-6 md:p-10">
              <span className="w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-foreground">Latest · {list[0].category}</span>
              <h2 className="mt-4 text-2xl font-semibold leading-snug group-hover:text-primary md:text-3xl">{list[0].title}</h2>
              <p className="mt-3 text-muted-foreground">{list[0].excerpt}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">{new Date(list[0].published_at).toLocaleDateString("en-NG", { dateStyle: "long" })} · Read story →</p>
            </div>
          </Link>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.slice(1).map((n) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-elegant">
              {n.image_url && <div className="overflow-hidden"><img src={n.image_url} alt={n.title} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-105" /></div>}
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
