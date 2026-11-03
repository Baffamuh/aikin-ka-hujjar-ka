import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { slugify } from "@/lib/site";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "checkbox" | "image" | "datetime";
  options?: string[] | { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
};

type Table = "projects" | "news_articles" | "media_items";

export async function uploadImage(file: File): Promise<string> {
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("site-media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("No URL");
  return data.signedUrl;
}

export function CrudManager({
  table, title, fields, columns, order, defaults, queryKeys,
}: {
  table: Table;
  title: string;
  fields: Field[];
  columns: { key: string; label: string }[];
  order: { col: string; asc: boolean };
  defaults: Record<string, unknown>;
  queryKeys: string[];
}) {
  const qc = useQueryClient();
  const key = ["admin", table];
  const { data = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(order.col, { ascending: order.asc });
      if (error) throw error;
      return data as Record<string, unknown>[];
    },
  });
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    queryKeys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
  };

  async function save() {
    if (!edit) return;
    for (const f of fields) if (f.required && !String(edit[f.key] ?? "").trim()) { toast.error(`${f.label} is required`); return; }
    setBusy(true);
    const row: Record<string, unknown> = { ...edit };
    if ("slug" in defaults && !row['slug']) row['slug'] = slugify(String(row['title'] ?? "")) + "-" + Date.now().toString(36);
    for (const f of fields) {
      if (f.type === "number") row[f.key] = row[f.key] === "" || row[f.key] == null ? null : Number(row[f.key]);
      if (f.type !== "checkbox" && f.type !== "number" && row[f.key] === "") row[f.key] = null;
    }
    const id = row['id'] as string | undefined;
    delete row['id']; delete row['created_at']; delete row['updated_at'];
    const res = id
      ? await supabase.from(table).update(row as never).eq("id", id)
      : await supabase.from(table).insert(row as never);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setEdit(null);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    refresh();
  }

  const list = data.filter((r) => !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="flex gap-2">
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="w-48" />
          <Button onClick={() => setEdit({ ...defaults })}><Plus className="mr-1 h-4 w-4" />New</Button>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>{columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="px-4 py-6 text-muted-foreground" colSpan={columns.length + 1}>Loading…</td></tr>}
            {list.map((r) => (
              <tr key={r['id'] as string} className="border-t">
                {columns.map((c) => <td key={c.key} className="max-w-xs truncate px-4 py-3">{typeof r[c.key] === "boolean" ? (r[c.key] ? "Yes" : "No") : String(r[c.key] ?? "—")}</td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEdit({ ...r })}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(r['id'] as string)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit" : "New"} item</DialogTitle></DialogHeader>
          {edit && (
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => <FieldInput key={f.key} f={f} value={edit[f.key]} onChange={(v) => setEdit({ ...edit, [f.key]: v })} />)}
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
                <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const [up, setUp] = useState(false);
  const full = f.full || f.type === "textarea" || f.type === "image";
  const v = value == null ? "" : String(value);
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label>{f.label}{f.required && " *"}</Label>
      {f.type === "textarea" ? (
        <Textarea rows={5} value={v} onChange={(e) => onChange(e.target.value)} />
      ) : f.type === "select" ? (
        <select className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={v} onChange={(e) => onChange(e.target.value)}>
          {f.options!.map((o) => typeof o === "string" ? <option key={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : f.type === "checkbox" ? (
        <div className="mt-2"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" /></div>
      ) : f.type === "image" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={v} onChange={(e) => onChange(e.target.value)} placeholder="Image or video URL" />
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-3 text-sm hover:bg-muted">
              <Upload className="h-4 w-4" />{up ? "…" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setUp(true);
                try { onChange(await uploadImage(file)); toast.success("Uploaded"); } catch (err) { toast.error((err as Error).message); }
                setUp(false);
              }} />
            </label>
          </div>
          {v && /\.(jpe?g|png|webp|gif)|token=|assets-v1/i.test(v) && <img src={v} alt="" className="h-28 rounded-md object-cover" />}
        </div>
      ) : f.type === "datetime" ? (
        <Input type="datetime-local" value={v ? new Date(v).toISOString().slice(0, 16) : ""} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)} />
      ) : (
        <Input type={f.type === "number" ? "number" : "text"} value={v} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
