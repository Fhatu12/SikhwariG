import { describe, expect, it } from "vitest";
import { CREDIBILITY_FACTS, PUBLIC_SERVICES, SELECTED_WORK } from "@/lib/public-content";

describe("public repositioning content", () => {
  it("contains the four approved public service areas including hospitality", () => {
    expect(PUBLIC_SERVICES.map((service) => service.title)).toEqual([
      "Telecommunications, ICT, and Network Services",
      "Cybersecurity Services",
      "Software Development and Digital Services",
      "Culinary and Hospitality Services",
    ]);
  });

  it("keeps Proprietary Trading out of public services", () => {
    const publicCopy = JSON.stringify(PUBLIC_SERVICES);
    expect(publicCopy).not.toMatch(/Proprietary Trading|Treasury/);
  });

  it("keeps approved credibility facts without public ownership claims", () => {
    const publicFacts = CREDIBILITY_FACTS.join(" ");

    expect(CREDIBILITY_FACTS).toContain("B-BBEE Level 1 Contributor");
    expect(publicFacts).not.toMatch(/100% black\s+ownership/i);
    expect(publicFacts).not.toMatch(/50% black female\s+ownership/i);
  });

  it("defines approved selected work status labels", () => {
    expect(SELECTED_WORK.map((item) => [item.name, item.statuses])).toEqual([
      ["Mzansi Select", ["Live"]],
      ["V-Property", ["MVP", "Demonstrator"]],
      ["SG Digital Trust Check", ["Live", "Internal Product"]],
    ]);
  });
});
