import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";
import { NEWS_CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/admin/news")({
  component: () => (
    <CrudManager
      table="news_articles"
      title="News Manager"
      order={{ col: "published_at", asc: false }}
      queryKeys={["news"]}
      defaults={{ title: "", slug: "", category: "Community Engagement", published: true, published_at: new Date().toISOString() }}
      columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }, { key: "published", label: "Published" }, { key: "published_at", label: "Date" }]}
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "category", label: "Category", type: "select", options: NEWS_CATEGORIES },
        { key: "published_at", label: "Publish date", type: "datetime" },
        { key: "excerpt", label: "Excerpt", full: true },
        { key: "body", label: "Body", type: "textarea" },
        { key: "image_url", label: "Cover image", type: "image" },
        { key: "published", label: "Published (visible on site)", type: "checkbox" },
      ]}
    />
  ),
});
