import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { COMPLAINT_CATEGORIES, LGAS, STATUSES, statusTone, type Complaint } from "@/lib/site";

export const Route = createFileRoute("/admin/complaints")({ component: Desk });

const sel = "h-10 rounded-md border bg-card px-3 text-sm";

function csvCell(v: unknown) {
  const s = String(v ?? "").replace(/"/g, '""');
  return /^[=+\-@]/.test(s) ? `"'${s}"` : `"${s}"`;
}

function Desk() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "complaints"],
    queryFn: async () => {
      const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Complaint[];
    },
  });
  const [f, setF] = useState({ lga: "", category: "", status: "", q: "" });
  const [sel1, setSel1] = useState<Complaint | null>(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);

  const list = data.filter((c) =>
    (!f.lga || c.lga === f.lga) && (!f.category || c.category === f.category) && (!f.status || c.status === f.status) &&
    (!f.q || `${c.tracking_code} ${c.full_name} ${c.subject} ${c.ward}`.toLowerCase().includes(f.q.toLowerCase())));

  function open(c: Complaint) { setSel1(c); setStatus(c.status); setRemarks(c.public_remarks ?? ""); }

  async function save() {
    if (!sel1) return;
    setBusy(true);
    const { error } = await supabase.from("complaints").update({ status, public_remarks: remarks.trim().slice(0, 4000) || null }).eq("id", sel1.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Complaint updated");
    setSel1(null);
    qc.invalidateQueries({ queryKey: ["admin"] });
  }

  function exportCsv() {
    const cols = ["tracking_code", "created_at", "status", "lga", "ward", "category", "subject", "full_name", "phone", "email", "message", "public_remarks"] as const;
    const rows = [cols.join(","), ...list.map((c) => cols.map((k) => csvCell(c[k])).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `imba-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">Complaints Desk</h1>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" />Export CSV ({list.length})</Button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Input placeholder="Search code, name, subject…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        <select className={sel} value={f.lga} onChange={(e) => setF({ ...f, lga: e.target.value })}><option value="">All LGAs</option>{LGAS.map((l) => <option key={l}>{l}</option>)}</select>
        <select className={sel} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}><option value="">All categories</option>{COMPLAINT_CATEGORIES.map((l) => <option key={l}>{l}</option>)}</select>
        <select className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">All statuses</option>{STATUSES.map((l) => <option key={l}>{l}</option>)}</select>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Citizen</th><th className="px-4 py-3">LGA / Ward</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading…</td></tr>}
            {!isLoading && !list.length && <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No complaints match.</td></tr>}
            {list.map((c) => (
              <tr key={c.id} className="cursor-pointer border-t hover:bg-muted/50" onClick={() => open(c)}>
                <td className="px-4 py-3 font-mono text-xs">{c.tracking_code}</td>
                <td className="whitespace-nowrap px-4 py-3">{new Date(c.created_at).toLocaleDateString("en-NG")}</td>
                <td className="px-4 py-3">{c.full_name}</td>
                <td className="px-4 py-3">{c.lga} / {c.ward}</td>
                <td className="max-w-xs truncate px-4 py-3">{c.subject}</td>
                <td className="px-4 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone(c.status)}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!sel1} onOpenChange={(o) => !o && setSel1(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {sel1 && (
            <>
              <DialogHeader><DialogTitle className="font-mono">{sel1.tracking_code}</DialogTitle></DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-muted-foreground">Name</dt><dd>{sel1.full_name}</dd></div>
                <div><dt className="text-muted-foreground">Phone</dt><dd><a className="text-primary" href={`tel:${sel1.phone}`}>{sel1.phone}</a></dd></div>
                <div><dt className="text-muted-foreground">Email</dt><dd>{sel1.email ?? "—"}</dd></div>
                <div><dt className="text-muted-foreground">LGA / Ward</dt><dd>{sel1.lga} / {sel1.ward}</dd></div>
                <div><dt className="text-muted-foreground">Category</dt><dd>{sel1.category}</dd></div>
                <div><dt className="text-muted-foreground">Submitted</dt><dd>{new Date(sel1.created_at).toLocaleString("en-NG")}</dd></div>
              </dl>
              <div className="rounded-lg bg-muted p-3 text-sm"><p className="font-semibold">{sel1.subject}</p><p className="mt-1 whitespace-pre-line">{sel1.message}</p></div>
              <div><Label>Status</Label><select className={`${sel} w-full`} value={status} onChange={(e) => setStatus(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><Label>Official remarks (visible on public tracking page)</Label><Textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={4000} /></div>
              <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setSel1(null)}>Cancel</Button><Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save update"}</Button></div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
