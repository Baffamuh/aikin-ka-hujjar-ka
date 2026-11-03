import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { STATUSES, statusTone } from "@/lib/site";

export const Route = createFileRoute("/admin/")({ component: Overview });

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [p, n, c] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("news_articles").select("id", { count: "exact", head: true }),
        supabase.from("complaints").select("status, lga, created_at, tracking_code, subject").order("created_at", { ascending: false }),
      ]);
      return { projects: p.count ?? 0, news: n.count ?? 0, complaints: c.data ?? [] };
    },
  });
  const cs = data?.complaints ?? [];
  const cards = [
    { l: "Projects", v: data?.projects ?? "—" },
    { l: "News articles", v: data?.news ?? "—" },
    { l: "Complaints received", v: cs.length },
    { l: "Open complaints", v: cs.filter((c) => c.status !== "Resolved" && c.status !== "Closed").length },
  ];
  return (
    <div>
      <h1 className="text-3xl font-semibold">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.l} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{c.l}</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{c.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold">Complaints by status</h2>
          <ul className="mt-4 space-y-2">
            {STATUSES.map((s) => {
              const n = cs.filter((c) => c.status === s).length;
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={`w-48 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone(s)}`}>{s}</span>
                  <div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${cs.length ? (n / cs.length) * 100 : 0}%` }} /></div>
                  <span className="w-8 text-right font-medium">{n}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex justify-between"><h2 className="text-lg font-semibold">Latest complaints</h2><Link to="/admin/complaints" className="text-sm text-primary">Open desk →</Link></div>
          <ul className="mt-4 divide-y text-sm">
            {cs.slice(0, 6).map((c) => (
              <li key={c.tracking_code} className="flex justify-between gap-2 py-2">
                <span className="truncate"><span className="font-mono text-xs">{c.tracking_code}</span> · {c.subject}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{c.lga}</span>
              </li>
            ))}
            {!cs.length && <li className="py-2 text-muted-foreground">No complaints yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
