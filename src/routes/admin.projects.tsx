import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";
import { LGAS, PROJECT_CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/admin/projects")({
  component: () => (
    <CrudManager
      table="projects"
      title="Projects Manager"
      order={{ col: "sort_order", asc: true }}
      queryKeys={["projects"]}
      defaults={{ title: "", slug: "", category: "Education", tenure: "completed", lga: "Katagum", status: "Completed", featured: false, sort_order: 100 }}
      columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }, { key: "lga", label: "LGA" }, { key: "tenure", label: "Tenure" }, { key: "year", label: "Year" }]}
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES },
        { key: "tenure", label: "Tenure", type: "select", options: [{ value: "completed", label: "2015–2019 Completed" }, { value: "commitment", label: "Senatorial Commitment" }] },
        { key: "lga", label: "LGA", type: "select", options: [...LGAS, "All 7 LGAs"] },
        { key: "location", label: "Location / School" },
        { key: "year", label: "Year completed", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Completed", "Ongoing", "Planned"] },
        { key: "summary", label: "Short summary", full: true },
        { key: "scope", label: "Detailed scope of work", type: "textarea" },
        { key: "image_url", label: "Photo", type: "image" },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "featured", label: "Featured", type: "checkbox" },
      ]}
    />
  ),
});
