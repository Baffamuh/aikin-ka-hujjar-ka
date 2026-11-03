import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/_site")({
  component: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  ),
});
