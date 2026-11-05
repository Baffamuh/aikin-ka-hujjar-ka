import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, PenSquare, FolderKanban, Image, LayoutDashboard, LogOut, Menu, MessageSquareWarning, Newspaper, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login" });
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      throw redirect({ to: "/admin/login" });
    }
    return { user: data.user };
  },
  head: () => ({ meta: [{ title: "Admin Dashboard — IMBA" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/post", label: "Create Post", icon: PenSquare },
  { to: "/admin/events", label: "Events & Rallies", icon: CalendarDays },
  { to: "/admin/complaints", label: "Complaints Desk", icon: MessageSquareWarning },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/admin/login", replace: true });
  }
  return (
    <div className="min-h-screen md:flex">
      <aside className={`${open ? "block" : "hidden"} bg-sidebar text-sidebar-foreground md:block md:w-64 md:shrink-0`}>
        <div className="p-5">
          <p className="font-display text-lg font-semibold">IMBA Admin</p>
          <p className="truncate text-xs opacity-70">{user.email}</p>
        </div>
        <nav className="space-y-1 px-3 pb-5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/admin" }} onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm opacity-80 hover:bg-sidebar-accent">↗ View website</Link>
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent"><LogOut className="h-4 w-4" />Sign out</button>
        </nav>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b p-3 md:hidden">
          <span className="font-semibold">IMBA Admin</span>
          <Button size="icon" variant="ghost" onClick={() => setOpen(!open)} aria-label="Menu"><Menu className="h-5 w-5" /></Button>
        </div>
        <div className="mx-auto max-w-6xl p-4 md:p-8"><Outlet /></div>
      </div>
    </div>
  );
}
