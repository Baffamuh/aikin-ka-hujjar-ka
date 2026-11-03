import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type News = Database["public"]["Tables"]["news_articles"]["Row"];
export type MediaItem = Database["public"]["Tables"]["media_items"]["Row"];
export type Complaint = Database["public"]["Tables"]["complaints"]["Row"];
export type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const LGAS = ["Katagum", "Jama'are", "Itas/Gadau", "Zaki", "Gamawa", "Shira", "Giade"] as const;
export const COMPLAINT_CATEGORIES = [
  "Education", "Healthcare", "Water Supply", "Roads & Infrastructure", "Electricity",
  "Security", "Youth & Employment", "Agriculture", "Women Empowerment", "Petition", "Other",
];
export const STATUSES = ["Submitted", "Under Review", "Assigned to Constituency Office", "In Progress", "Resolved", "Closed"] as const;
export const PROJECT_CATEGORIES = [
  "Education", "ICT & Technology", "Student Welfare", "Community Empowerment", "Healthcare",
  "Clean Water", "Jobs & Youth", "Infrastructure", "Agriculture", "Women Empowerment", "Legislation",
];
export const NEWS_CATEGORIES = ["Community Engagement", "Political Meetings", "Rallies", "Project Inspections", "Press Statements"];
export const MEDIA_CATEGORIES = ["Official Portraits", "Community Engagements", "Rallies", "Project Verification Evidence"];

export const PORTRAIT = "/__l5e/assets-v1/ad4934d7-a136-497f-b412-8c591124853e/imba_seated_portrait.jpg";
export const RALLY = "/__l5e/assets-v1/72843012-2dd4-4f8f-b4ff-6348f056d97c/imba_rally_procession.jpg";
export const SPEAKING = "/__l5e/assets-v1/ca3f6aa0-0fce-4227-92cf-8a066a64b56b/imba_speaking_rally.jpg";
export const POSTER = "/__l5e/assets-v1/9592dee4-f970-4ee1-9c57-a6dcd390bbbb/imba_achievements_poster.jpg";
export const NOTES = "/__l5e/assets-v1/5ec2cea5-a94d-4abf-be4f-1268e823edc8/imba_seated_notes.jpg";

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

async function unwrap<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data as T;
}

export const projectsQuery = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: () => unwrap<Project[]>(supabase.from("projects").select("*").order("sort_order")),
  });
export const newsQuery = () =>
  queryOptions({
    queryKey: ["news"],
    queryFn: () => unwrap<News[]>(supabase.from("news_articles").select("*").order("published_at", { ascending: false })),
  });
export const newsBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["news", slug],
    queryFn: () => unwrap<News | null>(supabase.from("news_articles").select("*").eq("slug", slug).maybeSingle()),
  });
export const mediaQuery = () =>
  queryOptions({
    queryKey: ["media"],
    queryFn: () => unwrap<MediaItem[]>(supabase.from("media_items").select("*").order("sort_order")),
  });
export const settingsQuery = () =>
  queryOptions({
    queryKey: ["settings"],
    queryFn: () => unwrap<Settings>(supabase.from("site_settings").select("*").eq("id", 1).single()),
  });

export function statusTone(status: string) {
  switch (status) {
    case "Resolved": return "bg-primary text-primary-foreground";
    case "Closed": return "bg-muted text-muted-foreground";
    case "In Progress": return "bg-gold text-gold-foreground";
    case "Assigned to Constituency Office": return "bg-secondary text-secondary-foreground";
    case "Under Review": return "bg-accent text-accent-foreground";
    default: return "bg-card text-foreground border";
  }
}
