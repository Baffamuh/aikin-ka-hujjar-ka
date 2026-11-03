import { describe, expect, it } from "vitest";
import { LGAS, STATUSES } from "@/lib/site";

describe("Bauchi North rules", () => {
  it("covers exactly the 7 Bauchi North LGAs", () => {
    expect([...LGAS]).toEqual(["Katagum", "Jama'are", "Itas/Gadau", "Zaki", "Gamawa", "Shira", "Giade"]);
  });
  it("uses the six complaint statuses in order", () => {
    expect([...STATUSES]).toEqual(["Submitted", "Under Review", "Assigned to Constituency Office", "In Progress", "Resolved", "Closed"]);
  });
});
