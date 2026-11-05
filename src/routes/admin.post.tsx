import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { CalendarDays, ImagePlus, Loader2, Megaphone, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/components/admin/CrudManager";
import { EVENT_TYPES, LGAS, NEWS_CATEGORIES, slugify } from "@/lib/site";

export const Route = createFileRoute("/admin/post")({ component: QuickPost });

const field = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

function QuickPost() {
  const qc = useQueryClient();
  const [kind, setKind] = useState<"news" | "event">("news");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(NEWS_CATEGORIES[0] ?? "Community Engagement");
  const [type, setType] = useState<string>(EVENT_TYPES[0] ?? "Campaign Rally");
  const [when, setWhen] = useState("");
  const [venue, setVenue] = useState("");
  const [lga, setLga] = useState<string>(LGAS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const pick = useRef<HTMLInputElement>(null);

  async function publish() {
    const body = text.trim();
    const t = (title.trim() || body.split("\n")[0] || "").slice(0, 120);
    if (!t) { toast.error("Write something first"); return; }
    if (kind === "event" && !when) { toast.error("Choose the event date and time"); return; }
    setBusy(true);
    try {
      const image_url = file ? await uploadImage(file) : null;
      const { error } =
        kind === "news"
          ? await supabase.from("news_articles").insert({
              title: t, slug: `${slugify(t)}-${Date.now().toString(36)}`, category,
              excerpt: body.slice(0, 200), body, image_url, published: true,
            })
          : await supabase.from("events").insert({
              title: t, event_type: type, starts_at: new Date(when).toISOString(),
              venue: venue || null, lga, description: body || null, image_url,
            });
      if (error) throw error;
      toast.success("Posted! It is now live on the website.");
      setText(""); setTitle(""); setFile(null); setWhen(""); setVenue("");
      qc.invalidateQueries({ queryKey: [kind === "news" ? "news" : "events"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Create post</h1>
      <p className="text-sm text-muted-foreground">Share news, rallies and events — it appears on the website immediately.</p>
      <div className="mt-6 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button variant={kind === "news" ? "default" : "outline"} onClick={() => setKind("news")}><Megaphone className="mr-1 h-4 w-4" />News / Update</Button>
          <Button variant={kind === "event" ? "default" : "outline"} onClick={() => setKind("event")}><CalendarDays className="mr-1 h-4 w-4" />Upcoming event</Button>
        </div>
        <input className={field} placeholder="Title (optional — first line is used)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={`${field} mt-3 min-h-32 text-base`} placeholder="What's happening in Bauchi North?" value={text} onChange={(e) => setText(e.target.value)} />
        {kind === "news" ? (
          <select className={`${field} mt-3`} value={category} onChange={(e) => setCategory(e.target.value)}>
            {NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <select className={field} value={type} onChange={(e) => setType(e.target.value)}>{EVENT_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
            <input type="datetime-local" className={field} value={when} onChange={(e) => setWhen(e.target.value)} />
            <input className={field} placeholder="Venue (e.g. Emir's Palace ground, Azare)" value={venue} onChange={(e) => setVenue(e.target.value)} />
            <select className={field} value={lga} onChange={(e) => setLga(e.target.value)}>{LGAS.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        )}
        {file && (
          <div className="relative mt-3">
            <img src={URL.createObjectURL(file)} alt="Selected" className="max-h-72 w-full rounded-lg object-cover" />
            <button onClick={() => setFile(null)} className="absolute right-2 top-2 rounded-full bg-background p-1 shadow" aria-label="Remove photo"><X className="h-4 w-4" /></button>
          </div>
        )}
        <input ref={pick} type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <Button variant="ghost" onClick={() => pick.current?.click()}><ImagePlus className="mr-1 h-5 w-5 text-primary" />Photo</Button>
          <Button onClick={publish} disabled={busy}>{busy && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}Post</Button>
        </div>
      </div>
    </div>
  );
}
