import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LangProvider } from "@/lib/i18n";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

export const Route = createFileRoute("/_site")({
  component: () => (
    <LangProvider><div className="min-h-screen">
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div></LangProvider>
  ),
});
