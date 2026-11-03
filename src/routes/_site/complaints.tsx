import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPLAINT_CATEGORIES, LGAS } from "@/lib/site";

export const Route = createFileRoute("/_site/complaints")({
  head: () => ({
    meta: [
      { title: "Submit a Complaint or Request — IMBA" },
      { name: "description", content: "Submit a complaint, petition or community request to the IMBA office. No account needed — get a tracking code." },
      { property: "og:title", content: "Submit a Complaint — IMBA Citizen Portal" },
      { property: "og:description", content: "Raise community issues and track them with a unique code." },
    ],
  }),
  component: ComplaintForm,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,19}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  lga: z.enum(LGAS, { errorMap: () => ({ message: "Select your LGA" }) }),
  ward: z.string().trim().min(2, "Enter your ward").max(100),
  category: z.string().min(2, "Select a category"),
  subject: z.string().trim().min(3, "Subject is too short").max(200),
  message: z.string().trim().min(10, "Please describe the issue (at least 10 characters)").max(4000),
});

const sel = "h-10 w-full rounded-md border bg-card px-3 text-sm";

function ComplaintForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const r = schema.safeParse(raw);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    const d = r.data;
    const { data, error } = await supabase.rpc("submit_complaint", {
      _full_name: d.full_name, _phone: d.phone, _email: d.email || null, _lga: d.lga, _ward: d.ward,
      _category: d.category, _subject: d.subject, _message: d.message,
    } as never);
    setBusy(false);
    if (error) { toast.error("Could not submit. Please check your details and try again."); return; }
    setCode(data as unknown as string);
    form.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;

  return (
    <>
      <PageHeader eyebrow="Citizen Portal" title="Submit a complaint, petition or request" intro="No sign-up needed. Your personal details stay private and are only seen by the constituency office." />
      <section className="mx-auto max-w-3xl px-4 py-10">
        {code && (
          <div className="mb-8 rounded-2xl border-2 border-primary bg-secondary p-6">
            <p className="flex items-center gap-2 font-semibold text-primary"><CheckCircle2 className="h-5 w-5" />Your request has been received</p>
            <p className="mt-3 text-sm text-muted-foreground">Your tracking code:</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-bold tracking-wider md:text-3xl">{code}</span>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(code); toast.success("Code copied"); }}><Copy className="mr-1 h-4 w-4" />Copy Code</Button>
            </div>
            <p className="mt-4 text-sm">Write this code down or take a screenshot. Visit the <Link to="/track" search={{ code }} className="font-medium text-primary underline">Track page</Link> anytime and enter the code to see the status and official responses.</p>
          </div>
        )}
        <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl border bg-card p-6 md:grid-cols-2 md:p-8">
          <div><Label htmlFor="full_name">Full name *</Label><Input id="full_name" name="full_name" maxLength={120} />{err("full_name")}</div>
          <div><Label htmlFor="phone">Phone number *</Label><Input id="phone" name="phone" type="tel" maxLength={20} placeholder="080…" />{err("phone")}</div>
          <div className="md:col-span-2"><Label htmlFor="email">Email (optional)</Label><Input id="email" name="email" type="email" maxLength={255} />{err("email")}</div>
          <div><Label htmlFor="lga">LGA *</Label>
            <select id="lga" name="lga" className={sel} defaultValue=""><option value="" disabled>Select LGA</option>{LGAS.map((l) => <option key={l}>{l}</option>)}</select>{err("lga")}</div>
          <div><Label htmlFor="ward">Ward *</Label><Input id="ward" name="ward" maxLength={100} />{err("ward")}</div>
          <div className="md:col-span-2"><Label htmlFor="category">Category *</Label>
            <select id="category" name="category" className={sel} defaultValue=""><option value="" disabled>Select category</option>{COMPLAINT_CATEGORIES.map((l) => <option key={l}>{l}</option>)}</select>{err("category")}</div>
          <div className="md:col-span-2"><Label htmlFor="subject">Subject *</Label><Input id="subject" name="subject" maxLength={200} />{err("subject")}</div>
          <div className="md:col-span-2"><Label htmlFor="message">Detailed message *</Label><Textarea id="message" name="message" rows={6} maxLength={4000} />{err("message")}</div>
          <div className="md:col-span-2"><Button type="submit" size="lg" disabled={busy} className="w-full md:w-auto">{busy ? "Submitting…" : "Submit request"}</Button></div>
        </form>
      </section>
    </>
  );
}
