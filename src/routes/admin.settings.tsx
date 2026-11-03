import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsQuery, type Settings } from "@/lib/site";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const FIELDS: { k: keyof Settings; l: string; area?: boolean }[] = [
  { k: "hero_title", l: "Hero title" },
  { k: "hero_subtitle", l: "Hero subtitle", area: true },
  { k: "slogan", l: "Campaign slogan" },
  { k: "office_address", l: "Office address" },
  { k: "phone", l: "Phone" },
  { k: "email", l: "Email" },
  { k: "office_hours", l: "Office hours" },
];

function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery());
  const [form, setForm] = useState<Partial<Settings>>({});
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save() {
    setBusy(true);
    const patch = Object.fromEntries(FIELDS.map(({ k }) => [k, String(form[k] ?? "").trim().slice(0, 500)]));
    const { error } = await supabase.from("site_settings").update(patch as Partial<Settings>).eq("id", 1);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold">Site Settings</h1>
      <div className="mt-6 space-y-4 rounded-xl border bg-card p-6">
        {FIELDS.map(({ k, l, area }) => (
          <div key={k}>
            <Label>{l}</Label>
            {area ? <Textarea value={String(form[k] ?? "")} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              : <Input value={String(form[k] ?? "")} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
          </div>
        ))}
        <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save settings"}</Button>
      </div>
    </div>
  );
}
