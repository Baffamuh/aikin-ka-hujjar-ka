import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login — IMBA Platform" },
      { name: "description", content: "Secure staff sign-in for the IMBA platform." },
      { property: "og:title", content: "Admin Login — IMBA" },
      { property: "og:description", content: "Staff sign-in." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

const creds = z.object({ email: z.string().trim().email().max(255), password: z.string().min(8, "Password must be at least 8 characters").max(72) });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [noAdmin, setNoAdmin] = useState(false);

  useEffect(() => {
    supabase.rpc("admin_exists").then(({ data }) => setNoAdmin(data === false));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = creds.safeParse({ email, password });
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Invalid input"); return; }
    setBusy(true);
    if (noAdmin) {
      const { error } = await supabase.auth.signUp({ ...r.data, options: { emailRedirectTo: window.location.origin + "/admin" } });
      if (error) { setBusy(false); { toast.error(error.message); return; } }
    }
    const { error } = await supabase.auth.signInWithPassword(r.data);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    nav({ to: "/admin" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-card p-8 shadow-2xl">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-sm font-bold text-gold">IMBA</span>
          <h1 className="mt-3 text-2xl font-semibold">{noAdmin ? "Create admin account" : "Admin sign in"}</h1>
          {noAdmin && <p className="mt-1 text-xs text-muted-foreground">No administrator exists yet. The first account created becomes the administrator.</p>}
        </div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete={noAdmin ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : noAdmin ? "Create & sign in" : "Sign in"}</Button>
        <Link to="/" className="block text-center text-xs text-muted-foreground">← Back to website</Link>
      </form>
    </div>
  );
}
