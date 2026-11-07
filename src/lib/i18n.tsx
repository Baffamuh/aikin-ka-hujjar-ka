import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ha";

const DICT = {
  Home: "Gida",
  "About IMBA": "Game da IMBA",
  Achievements: "Nasarori",
  "Track Record": "Ayyukan da Aka Yi",
  Agenda: "Manufofi",
  News: "Labarai",
  Media: "Hotuna da Bidiyo",
  Contact: "Tuntuɓe Mu",
  "Submit Complaint": "Kai Koke",
  "Track Request": "Bibiyar Koke",
  "View Track Record": "Duba Ayyukan da Aka Yi",
  "Submit a Complaint/Request": "Kai Koke ko Buƙata",
  "Countdown to Election Day": "Saura Kwanaki Zuwa Ranar Zaɓe",
  Days: "Kwanaki",
  Hours: "Awanni",
  Minutes: "Mintuna",
  Seconds: "Daƙiƙu",
  "National Assembly elections · 20 February 2027": "Zaɓen 'Yan Majalisar Tarayya · 20 ga Fabrairu 2027",
  "Vote APC — Vote IMBA for Senate": "Zaɓi APC — Zaɓi IMBA a Majalisar Dattawa",
  "Share on WhatsApp": "Tura ta WhatsApp",
  "Latest activities & news": "Sabbin Ayyuka da Labarai",
} as const;

export type Key = keyof typeof DICT;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    if (localStorage.getItem("imba-lang") === "ha") setLangState("ha");
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("imba-lang", l);
    document.documentElement.lang = l;
  };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  const t = (k: string) => (lang === "ha" && k in DICT ? DICT[k as Key] : k);
  return { lang, setLang, t };
}
