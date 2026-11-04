import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Eye, Users } from "lucide-react";
import { PageHeader, ApcBadge } from "@/components/site/SiteChrome";
import { NOTES, PORTRAIT } from "@/lib/site";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About IMBA — Biography & Legislative Record" },
      { name: "description", content: "Biography of Hon. Ibrahim Mohammed Baba: public service, 8th National Assembly record (2015–2019) and philosophy." },
      { property: "og:title", content: "About Hon. Ibrahim Mohammed Baba (IMBA)" },
      { property: "og:description", content: "Background, public service and legislative record of IMBA." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader eyebrow="Biography" title="Hon. Ibrahim Mohammed Baba (IMBA)" intro="A legislator measured by what he delivered." />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <img src={PORTRAIT} alt="Hon. Ibrahim Mohammed Baba" className="w-full rounded-2xl object-cover shadow-elegant" />
          <div className="rounded-2xl border bg-card p-5 text-sm">
            <div className="mb-3"><ApcBadge /></div>
            <dl className="space-y-2">
              <div><dt className="text-muted-foreground">Party</dt><dd className="font-medium">All Progressives Congress (APC)</dd></div>
              <div><dt className="text-muted-foreground">Seeking</dt><dd className="font-medium">Senator, Bauchi North Senatorial District</dd></div>
              <div><dt className="text-muted-foreground">Previous office</dt><dd className="font-medium">Member, House of Representatives, Katagum Federal Constituency (2015–2019)</dd></div>
            </dl>
          </div>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-foreground/90">
          <h2 className="text-3xl font-semibold">Background & public service</h2>
          <p>Hon. Ibrahim Mohammed Baba, popularly known as IMBA — fondly called <strong>Jikan Nanna</strong> and titled <strong>Barden Gabas</strong> — is a son of Katagum in Bauchi State and a committed public servant whose politics is built on one idea: representation must be visible on the ground.</p>
          <p>Beyond education, his tenure brought hospital equipment and patient support, boreholes, transformers and solar streetlights, culverts and road repairs, the Civil Defence Training College in Azare, skills training and jobs for youths, and tools, grants and livestock for farmers, traders and women.</p>
          <p>Elected to the House of Representatives in 2015 to represent Katagum Federal Constituency in the 8th National Assembly, he made education the centrepiece of his mandate. Between 2015 and 2019 his constituency interventions delivered more than 50 classrooms across primary schools, junior secondary schools and modern Islamiyya schools, three ICT centres, three free student transit buses and over 10,000 primary school textbooks.</p>
          <h3 className="pt-2 text-2xl font-semibold">Stewardship in the 8th National Assembly</h3>
          <p>In the House, he used constituency project allocations, motions and oversight to bring federal resources home — prioritising projects that communities could see, use and verify. His record became the campaign theme he carries today: <em className="font-display text-primary">“Aikin Ka Hujjar Ka”</em> — your work is your proof.</p>
          <p>Now contesting for the Senate on the platform of the APC, he seeks to extend this standard of delivery to all seven LGAs of Bauchi North: Katagum, Jama'are, Itas/Gadau, Zaki, Gamawa, Shira and Giade.</p>
          <img src={NOTES} alt="IMBA listening to constituents" className="w-full rounded-2xl object-cover md:max-h-96" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-semibold">Core philosophy</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { i: Eye, t: "Transparent representation", d: "Every project published, every location named, every claim open to verification by the people." },
            { i: BookOpen, t: "Educational empowerment", d: "Classrooms, computers, books and buses — because education is the surest path out of poverty." },
            { i: Users, t: "Constituency accessibility", d: "An open office, an open portal, and a tracking code for every citizen request." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border bg-card p-6">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="mt-3 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
