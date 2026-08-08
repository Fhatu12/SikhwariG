import { describe, expect, it } from "vitest";
import {
  HOSPITALITY_SERVICE_AREA,
  HOSPITALITY_SERVICE_TYPE_OPTIONS,
  SERVICE_AREA_OPTIONS,
} from "@/lib/lead-options";

describe("lead options", () => {
  it("contains the approved base service choices", () => {
    expect(SERVICE_AREA_OPTIONS).toEqual([
      "Telecommunications, ICT, and Network Services",
      "Cybersecurity Services",
      "Software Development and Digital Services",
      "Culinary and Hospitality Services",
      "General business enquiry",
      "Not sure",
    ]);
  });

  it("contains approved hospitality service types", () => {
    expect(HOSPITALITY_SERVICE_AREA).toBe("Culinary and Hospitality Services");
    expect(HOSPITALITY_SERVICE_TYPE_OPTIONS).toEqual([
      "Catering",
      "Chef Services",
      "Corporate Function",
      "Private Function",
      "Other",
    ]);
  });

  it("keeps Proprietary Trading out of enquiry choices", () => {
    expect(JSON.stringify(SERVICE_AREA_OPTIONS)).not.toMatch(/Proprietary Trading|Treasury/);
  });
});
