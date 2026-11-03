import apcLogo from "@/assets/apc_logo.png.asset.json";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X, MapPin, Phone, Mail } from "lucide-react";
import { settingsQuery } from "@/lib/site";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About IMBA" },
  { to: "/projects", label: "Track Record" },
  { to: "/senatorial-agenda", label: "Agenda" },
  { to: "/news", label: "News" },
  { to: "/media", label: "Media" },
  { to: "/contact", label: "Contact" },
] as const;

export function ApcBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-foreground ${className}`}>
      <span className="h-2 w-2 rounded-full bg-primary" /> APC
    </span>
  );
}

export function ContestBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-gold/60 px-3 py-1 text-xs font-medium ${className}`}>
      Contestant for Senator · Bauchi North Senatorial District
    </span>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const d = localStorage.getItem("imba-theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle dark mode"
      onClick={() => {
        const n = !dark;
        setDark(n);
        document.documentElement.classList.toggle("dark", n);
        localStorage.setItem("imba-theme", n ? "dark" : "light");
      }}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-[11px] font-bold text-gold">IMBA</span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-base font-semibold">Hon. Ibrahim M. Baba</span>
            <span className="block text-xs text-muted-foreground">APC · Bauchi North</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex"><Link to="/complaints">Submit Complaint</Link></Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background px-4 py-3 lg:hidden">
          {[...NAV, { to: "/complaints", label: "Submit Complaint" }, { to: "/track", label: "Track Request" }].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { data: s } = useQuery(settingsQuery());
  return (
    <footer className="mt-24 bg-emerald-deep text-on-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-semibold">Hon. Ibrahim Mohammed Baba (IMBA)</p>
          <p className="mt-2 font-display text-lg italic text-gold">“{s?.slogan ?? "Aikin Ka Hujjar Ka"}”</p>
          <p className="mt-4 max-w-md text-sm opacity-80">
            Former Member, House of Representatives (Katagum Federal Constituency, 2015–2019). APC contestant for Senator, Bauchi North Senatorial District.
          </p>
          <div className="mt-4 flex gap-2"><ApcBadge /></div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Citizens</p>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li><Link to="/complaints">Submit a complaint</Link></li>
            <li><Link to="/track">Track your request</Link></li>
            <li><Link to="/projects">Verify projects</Link></li>
            <li><Link to="/senatorial-agenda">Senatorial agenda</Link></li>
          </ul>
        </div>
        <div className="space-y-2 text-sm opacity-90">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">Constituency Office</p>
          <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{s?.office_address}</p>
          <p className="flex gap-2"><Phone className="h-4 w-4 shrink-0" />{s?.phone}</p>
          <p className="flex gap-2"><Mail className="h-4 w-4 shrink-0" />{s?.email}</p>
        </div>
      </div>
      <div className="border-t border-on-deep/15 py-5 text-center text-xs opacity-70">
        © {new Date().getFullYear()} IMBA Campaign Organisation · <Link to="/admin/login" className="underline">Staff</Link>
      </div>
    </footer>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="bg-hero text-on-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-base opacity-85 md:text-lg">{intro}</p>}
      </div>
    </section>
  );
}
