import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";
import { EVENT_TYPES, LGAS } from "@/lib/site";

export const Route = createFileRoute("/admin/events")({
  component: () => (
    <CrudManager
      table="events"
      title="Events & Rallies"
      order={{ col: "starts_at", asc: false }}
      queryKeys={["events"]}
      defaults={{ title: "", event_type: "Campaign Rally", lga: "Katagum", published: true, starts_at: new Date().toISOString() }}
      columns={[{ key: "title", label: "Title" }, { key: "event_type", label: "Type" }, { key: "lga", label: "LGA" }, { key: "starts_at", label: "Date" }]}
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "event_type", label: "Type", type: "select", options: EVENT_TYPES },
        { key: "starts_at", label: "Date & time", type: "datetime" },
        { key: "venue", label: "Venue" },
        { key: "lga", label: "LGA", type: "select", options: [...LGAS] },
        { key: "description", label: "Details", type: "textarea" },
        { key: "image_url", label: "Photo", type: "image" },
        { key: "published", label: "Published (visible on site)", type: "checkbox" },
      ]}
    />
  ),
});
