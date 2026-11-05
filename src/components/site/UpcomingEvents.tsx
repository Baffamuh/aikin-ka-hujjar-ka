import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { eventsQuery } from "@/lib/site";

export function UpcomingEvents() {
  const { data: events = [] } = useQuery(eventsQuery());
  if (!events.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Join us</p>
      <h2 className="mt-1 text-3xl font-semibold">Upcoming rallies & events</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          const d = new Date(e.starts_at);
          return (
            <article key={e.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              {e.image_url && <img src={e.image_url} alt={e.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />}
              <div className="flex gap-4 p-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary text-center text-primary-foreground">
                  <div>
                    <p className="text-xs uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</p>
                    <p className="text-2xl font-bold leading-none">{d.getDate()}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold">{e.event_type}</p>
                  <h3 className="text-lg font-semibold leading-snug">{e.title}</h3>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{d.toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.venue ? `${e.venue}, ` : ""}{e.lga}</p>
                  </div>
                  {e.description && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{e.description}</p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="sr-only"><CalendarDays /></p>
    </section>
  );
}
