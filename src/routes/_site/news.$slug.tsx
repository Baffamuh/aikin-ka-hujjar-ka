import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { newsBySlugQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/news/$slug")({
  head: () => ({
    meta: [
      { title: "News article — IMBA" },
      { name: "description", content: "News and activities from Hon. Ibrahim Mohammed Baba (IMBA)." },
      { property: "og:title", content: "IMBA News" },
      { property: "og:description", content: "News and activities from Hon. IMBA." },
    ],
  }),
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: n, isLoading } = useQuery(newsBySlugQuery(slug));
  if (isLoading) return <p className="mx-auto max-w-3xl px-4 py-20 text-muted-foreground">Loading…</p>;
  if (!n) return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-3xl font-semibold">Article not found</h1>
      <Link to="/news" className="mt-4 inline-block text-primary">← Back to news</Link>
    </div>
  );
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/news" className="inline-flex items-center gap-1 text-sm text-primary"><ArrowLeft className="h-4 w-4" />All news</Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">{n.category} · {new Date(n.published_at).toLocaleDateString("en-NG", { dateStyle: "long" })}</p>
      <h1 className="mt-2 text-4xl font-semibold leading-tight">{n.title}</h1>
      {n.excerpt && <p className="mt-4 text-lg text-muted-foreground">{n.excerpt}</p>}
      {n.image_url && <img src={n.image_url} alt={n.title} className="mt-8 w-full rounded-2xl object-cover" />}
      <div className="mt-8 space-y-4 whitespace-pre-line leading-relaxed">{n.body}</div>
    </article>
  );
}
