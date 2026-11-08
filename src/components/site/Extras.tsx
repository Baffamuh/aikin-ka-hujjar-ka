import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const ELECTION = new Date("2027-01-16T08:00:00+01:00").getTime();

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <Button variant="ghost" size="sm" aria-label="Switch language" className="px-2 font-semibold"
      onClick={() => setLang(lang === "en" ? "ha" : "en")}>
      {lang === "en" ? "HA" : "EN"}
    </Button>
  );
}

export function WhatsAppShare({ title, path }: { title: string; path: string }) {
  const { t } = useLang();
  const share = () => {
    const url = `${window.location.origin}${path}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, "_blank", "noopener");
  };
  return (
    <Button type="button" size="sm" variant="outline" onClick={(e) => { e.preventDefault(); e.stopPropagation(); share(); }}
      className="gap-1.5 border-primary/40 text-primary">
      <MessageCircle className="h-4 w-4" /> {t("Share on WhatsApp")}
    </Button>
  );
}

export function ElectionCountdown() {
  const { t } = useLang();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now === null ? 0 : Math.max(0, ELECTION - now);
  const parts = [
    [Math.floor(diff / 86400000), "Days"],
    [Math.floor(diff / 3600000) % 24, "Hours"],
    [Math.floor(diff / 60000) % 60, "Minutes"],
    [Math.floor(diff / 1000) % 60, "Seconds"],
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <div className="rounded-2xl bg-hero p-6 text-center text-on-deep shadow-elegant md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t("Countdown to Election Day")}</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{t("Vote APC — Vote IMBA for Senate")}</h2>
        <div className="mx-auto mt-6 grid max-w-xl grid-cols-4 gap-2 md:gap-4">
          {parts.map(([n, l]) => (
            <div key={l} className="rounded-xl bg-on-deep/10 p-3 md:p-4">
              <p className="font-display text-3xl font-bold text-gold md:text-5xl">{now === null ? "--" : String(n).padStart(2, "0")}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider opacity-80 md:text-xs">{t(l)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm opacity-75">{t("National Assembly elections · 16 January 2027")}</p>
      </div>
    </section>
  );
}
