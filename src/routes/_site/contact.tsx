import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/SiteChrome";
import { Button } from "@/components/ui/button";
import { LGAS, settingsQuery } from "@/lib/site";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Constituency Offices — IMBA" },
      { name: "description", content: "Reach the IMBA central constituency office in Azare and liaison contacts across Bauchi North LGAs." },
      { property: "og:title", content: "Contact IMBA" },
      { property: "og:description", content: "Constituency office in Azare and LGA liaison contacts." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: s } = useQuery(settingsQuery());
  return (
    <>
      <PageHeader eyebrow="Contact" title="Constituency offices" intro="Our doors are open. Visit, call, or send a request through the citizen portal." />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-hero p-8 text-on-deep">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Central Office</p>
          <h2 className="mt-2 text-3xl font-semibold">Azare, Katagum LGA</h2>
          <ul className="mt-6 space-y-4">
            <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-gold" />{s?.office_address}</li>
            <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><a href={`tel:${s?.phone}`}>{s?.phone}</a></li>
            <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-gold" /><a href={`mailto:${s?.email}`}>{s?.email}</a></li>
            <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold" />{s?.office_hours}</li>
          </ul>
          <Button asChild className="mt-8 bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/complaints">Send a request online</Link></Button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">LGA liaison desks</h2>
          <p className="mt-1 text-sm text-muted-foreground">Liaison officers in each LGA receive requests and route them to the central office.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {LGAS.map((l) => (
              <div key={l} className="rounded-xl border bg-card p-4">
                <p className="font-semibold">{l}</p>
                <p className="text-xs text-muted-foreground">Liaison desk · via central office</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
