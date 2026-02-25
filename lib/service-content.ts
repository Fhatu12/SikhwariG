import { prisma } from "@/lib/prisma";

export const TRADING_COPY_GUARDRAIL =
  "Internal function only. Not offered to the public, and not a solicitation or invitation to trade.";

type ServiceSeed = {
  key: string;
  title: string;
  intro: string | null;
  body: string;
  isTradingInternal: boolean;
  displayOrder: number;
};

const DEFAULT_SERVICE_CONTENT: ServiceSeed[] = [
  {
    key: "telecommunications-ict-network",
    title: "Telecommunications, ICT, and Network Services",
    intro: null,
    body: [
      "Fibre and FTTH/FTTx delivery support, including planning, readiness, and handover coordination.",
      "Customer equipment rollout support covering configuration, testing, and field readiness.",
      "Stability and reliability checks for connectivity services.",
      "Incident support and operational troubleshooting for service continuity.",
      "Delivery governance and documentation with traceability and change control.",
    ].join("\n"),
    isTradingInternal: false,
    displayOrder: 1,
  },
  {
    key: "cybersecurity",
    title: "Cybersecurity Services",
    intro:
      "Scope note: services are advisory, assessment and support in nature, subject to applicable law and client authorisation where required.",
    body: [
      "Practical security assessments and exposure checks (authorised engagements only).",
      "Security hardening guidance and remediation coordination.",
      "Operational security support for process, access, and baseline controls.",
      "Compliance-aware advisory support, including POPIA considerations where applicable.",
    ].join("\n"),
    isTradingInternal: false,
    displayOrder: 2,
  },
  {
    key: "treasury-internal-proprietary-trading",
    title:
      "Treasury / Internal - Proprietary Trading and Market Activities (Internal Capital Allocation)",
    intro: TRADING_COPY_GUARDRAIL,
    body: [
      "Internal market research to inform treasury decisions.",
      "Proprietary capital allocation for company-owned funds only.",
      "Governance-aligned risk controls and management oversight.",
      "Performance monitoring for internal financial planning purposes.",
    ].join("\n"),
    isTradingInternal: true,
    displayOrder: 3,
  },
  {
    key: "culinary-hospitality",
    title: "Culinary and Hospitality Services",
    intro: null,
    body: [
      "Catering and kitchen operations support for preparation and service standards.",
      "Menu support and event execution assistance for corporate and private functions.",
      "Food safety and quality control practices for consistent outcomes.",
      "Stock handling and kitchen coordination to support reliable service delivery.",
    ].join("\n"),
    isTradingInternal: false,
    displayOrder: 4,
  },
  {
    key: "software-development-digital",
    title: "Software Development and Digital Services",
    intro: null,
    body: [
      "Websites and internal tools from requirements through build and handover.",
      "Process automation and lightweight systems integration.",
      "Documentation, user training, and ongoing operational support.",
    ].join("\n"),
    isTradingInternal: false,
    displayOrder: 5,
  },
];

const LEGACY_SERVICE_BODIES: Record<string, string> = {
  "telecommunications-ict-network": [
    "Connectivity planning and rollout support for business operations.",
    "Infrastructure coordination across sites, teams, and service providers.",
    "Service continuity support for communication and network environments.",
    "Supplier and contract alignment for practical delivery outcomes.",
  ].join("\n"),
  cybersecurity: [
    "Baseline risk reviews and practical control recommendations.",
    "Policy and process support for governance and accountability.",
    "Incident readiness guidance for internal teams and stakeholders.",
    "Awareness support to strengthen everyday secure work practices.",
  ].join("\n"),
  "culinary-hospitality": [
    "Catering support for corporate meetings and private functions.",
    "Event planning coordination with service and guest experience focus.",
    "Menu and service package design aligned to client requirements.",
    "Hospitality operations support for consistent service quality.",
  ].join("\n"),
  "software-development-digital": [
    "Business web and digital product development support.",
    "Application maintenance and improvement planning.",
    "Workflow and reporting digitisation for operational efficiency.",
    "Implementation support from requirements through launch readiness.",
  ].join("\n"),
};

export function splitBodyLines(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function ensureServiceContent() {
  await Promise.all(
    DEFAULT_SERVICE_CONTENT.map((service) =>
      prisma.serviceContent.upsert({
        where: { key: service.key },
        update: {},
        create: service,
      })
    )
  );

  await Promise.all(
    DEFAULT_SERVICE_CONTENT.map((service) => {
      const legacyBody = LEGACY_SERVICE_BODIES[service.key];
      if (!legacyBody) {
        return Promise.resolve();
      }

      return prisma.serviceContent.updateMany({
        where: {
          key: service.key,
          body: legacyBody,
        },
        data: {
          title: service.title,
          intro: service.intro,
          body: service.body,
          isTradingInternal: service.isTradingInternal,
          displayOrder: service.displayOrder,
        },
      });
    })
  );

  return prisma.serviceContent.findMany({
    orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
  });
}
