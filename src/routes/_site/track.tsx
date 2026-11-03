import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATUSES, statusTone } from "@/lib/site";

export const Route = createFileRoute("/_site/track")({
  validateSearch: z.object({ code: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Track Your Request — IMBA Citizen Portal" },
      { name: "description", content: "Enter your IMBA tracking code to see the status and official updates on your complaint or request." },
      { property: "og:title", content: "Track Your Request — IMBA" },
      { property: "og:description", content: "Follow the status of your complaint with your tracking code." },
    ],
  }),
  component: Track,
});

type Result = { tracking_code: string; lga: string; category: string; subject: string; status: string; public_remarks: string | null; created_at: string; updated_at: string };

function Track() {
  const search = Route.useSearch();
  const [code, setCode] = useState(search.code ?? "");
  const [res, setRes] = useState<Result | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  async function lookup(c: string) {
    if (!c.trim()) return;
    setBusy(true);
    const { data } = await supabase.rpc("track_complaint", { _code: c.trim().slice(0, 30) } as never);
    setBusy(false);
    const rows = (data ?? []) as unknown as Result[];
    setRes(rows[0] ?? null);
  }
  useEffect(() => { if (search.code) lookup(search.code); }, [search.code]);

  const step = res ? STATUSES.indexOf(res.status as (typeof STATUSES)[number]) : -1;

  return (
    <>
      <PageHeader eyebrow="Citizen Portal" title="Track your request" intro="Enter the code you received (e.g. IMBA-2026-ABCDE)." />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <form onSubmit={(e) => { e.preventDefault(); lookup(code); }} className="flex gap-2">
          <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="IMBA-2026-XXXXX" className="h-12 font-mono text-lg" maxLength={30} />
          <Button type="submit" size="lg" className="h-12" disabled={busy}><Search className="mr-1 h-4 w-4" />Track</Button>
        </form>
        {res === null && <p className="mt-6 rounded-xl border bg-card p-5 text-sm">No request found with that code. Please check and try again.</p>}
        {res && (
          <div className="mt-8 rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-lg font-bold">{res.tracking_code}</span>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusTone(res.status)}`}>{res.status}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">{res.subject}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{res.category} · {res.lga} LGA · Submitted {new Date(res.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</p>
            <ol className="mt-6 grid gap-2 sm:grid-cols-6">
              {STATUSES.map((s, i) => (
                <li key={s} className={`rounded-lg px-2 py-2 text-center text-xs font-medium ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Official update</p>
              <p className="mt-1 whitespace-pre-line text-sm">{res.public_remarks || "Your request has been logged. An official update will appear here."}</p>
              <p className="mt-2 text-xs text-muted-foreground">Last updated {new Date(res.updated_at).toLocaleString("en-NG")}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
