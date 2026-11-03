import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";
import { MEDIA_CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/admin/media")({
  component: () => (
    <CrudManager
      table="media_items"
      title="Media Manager"
      order={{ col: "sort_order", asc: true }}
      queryKeys={["media"]}
      defaults={{ title: "", category: "Community Engagements", media_type: "photo", url: "", sort_order: 100 }}
      columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }, { key: "media_type", label: "Type" }]}
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "category", label: "Category", type: "select", options: MEDIA_CATEGORIES },
        { key: "media_type", label: "Type", type: "select", options: [{ value: "photo", label: "Photo" }, { value: "video", label: "Video (YouTube link)" }] },
        { key: "url", label: "Photo upload or video link", type: "image", required: true },
        { key: "caption", label: "Caption", full: true },
        { key: "sort_order", label: "Sort order", type: "number" },
      ]}
    />
  ),
});
