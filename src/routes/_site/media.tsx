import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHeader } from "@/components/site/SiteChrome";
import { EvidenceGallery } from "@/components/site/EvidenceGallery";
import { mediaQuery, MEDIA_CATEGORIES, type MediaItem } from "@/lib/site";

export const Route = createFileRoute("/_site/media")({
  head: () => ({
    meta: [
      { title: "Media Centre & Gallery — IMBA" },
      { name: "description", content: "Official portraits, community engagements, rallies and project verification photos of Hon. IMBA." },
      { property: "og:title", content: "IMBA Media Centre" },
      { property: "og:description", content: "Photos and videos from the IMBA campaign." },
    ],
  }),
  component: Media,
});

function embed(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  if (/facebook\.com|fb\.watch/.test(url)) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560`;
  return url;
}

function Media() {
  const { data = [] } = useQuery(mediaQuery());
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<MediaItem | null>(null);
  const list = data.filter((m) => m.media_type !== "video" && (cat === "All" || m.category === cat));
  return (
    <>
      <PageHeader eyebrow="Media Centre" title="Photo & video gallery" />
      {data.some((m) => m.media_type === "video") && (
        <section className="mx-auto max-w-7xl px-4 pt-10">
          <h2 className="text-2xl font-semibold">Videos</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.filter((m) => m.media_type === "video").map((m) => (
              <figure key={m.id} className="overflow-hidden rounded-2xl border bg-card">
                <div className={/facebook|fb\.watch/.test(m.url) ? "aspect-[9/16] w-full" : "aspect-video w-full"}>
                  <iframe src={embed(m.url)} title={m.title} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen />
                </div>
                <figcaption className="p-3 text-sm font-semibold">{m.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <h2 className="text-2xl font-semibold">Project verification evidence</h2>
        <div className="mt-2"><EvidenceGallery /></div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-2xl font-semibold">Campaign & community photos</h2>
        <div className="flex flex-wrap gap-2">
          {["All", ...MEDIA_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {list.map((m) => (
            <button key={m.id} onClick={() => setOpen(m)} className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border bg-card text-left">
              {m.media_type === "video" ? (
                <div className="aspect-video w-full"><iframe src={embed(m.url)} title={m.title} className="h-full w-full" allowFullScreen /></div>
              ) : (
                <img src={m.url} alt={m.title} loading="lazy" className="w-full object-cover" />
              )}
              <div className="p-3">
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.category}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      {open && open.media_type !== "video" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-background p-2" aria-label="Close"><X className="h-5 w-5" /></button>
          <figure className="max-h-full max-w-4xl">
            <img src={open.url} alt={open.title} className="max-h-[85vh] rounded-xl object-contain" />
            <figcaption className="mt-2 text-center text-sm text-background">{open.caption ?? open.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
