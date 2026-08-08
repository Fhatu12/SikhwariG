import { prisma } from "@/lib/prisma";
import { PUBLIC_SERVICES } from "@/lib/public-content";

export const TRADING_COPY_GUARDRAIL =
  "Internal function only. Not offered to the public, and not a solicitation or invitation to trade.";

type ServiceSeed = {
  key: string;
  title: string;
  intro: string | null;
  body: string;
  isTradingInternal: boolean;
  displayOrder: number;
  watermarkSrc?: string | null;
};

const DEFAULT_SERVICE_CONTENT: ServiceSeed[] = PUBLIC_SERVICES.map((service, index) => ({
  key: service.key,
  title: service.title,
  intro: service.scopeNote ?? null,
  body: service.capabilities.join("\n"),
  isTradingInternal: false,
  displayOrder: index + 1,
  watermarkSrc: `/brand/watermarks/${
    service.key === "telecommunications-ict-network"
      ? "sg-telecom"
      : service.key === "cybersecurity"
        ? "sg-cyber"
        : service.key === "culinary-hospitality"
          ? "sg-hospitality"
          : "sg-digital"
  }-watermark.png`,
}));

const LEGACY_SERVICE_BODIES: Record<string, string[]> = {
  "telecommunications-ict-network": [
    [
      "Fibre and FTTH/FTTx delivery support, including planning, readiness, and handover coordination.",
      "Customer equipment rollout support covering configuration, testing, and field readiness.",
      "Stability and reliability checks for connectivity services.",
      "Incident support and operational troubleshooting for service continuity.",
      "Delivery governance and documentation with traceability and change control.",
    ].join("\n"),
    [
      "Connectivity planning and rollout support for business operations.",
      "Infrastructure coordination across sites, teams, and service providers.",
      "Service continuity support for communication and network environments.",
      "Supplier and contract alignment for practical delivery outcomes.",
    ].join("\n"),
  ],
  cybersecurity: [
    [
      "Practical security assessments and exposure checks (authorised engagements only).",
      "Security hardening guidance and remediation coordination.",
      "Operational security support for process, access, and baseline controls.",
      "Compliance-aware advisory support, including POPIA considerations where applicable.",
    ].join("\n"),
    [
      "Baseline risk reviews and practical control recommendations.",
      "Policy and process support for governance and accountability.",
      "Incident readiness guidance for internal teams and stakeholders.",
      "Awareness support to strengthen everyday secure work practices.",
    ].join("\n"),
  ],
  "culinary-hospitality": [
    [
      "Catering and kitchen operations support for preparation and service standards.",
      "Menu support and event execution assistance for corporate and private functions.",
      "Food safety and quality control practices for consistent outcomes.",
      "Stock handling and kitchen coordination to support reliable service delivery.",
    ].join("\n"),
    [
      "Catering support for corporate meetings and private functions.",
      "Event planning coordination with service and guest experience focus.",
      "Menu and service package design aligned to client requirements.",
      "Hospitality operations support for consistent service quality.",
    ].join("\n"),
  ],
  "software-development-digital": [
    [
      "Websites and internal tools from requirements through build and handover.",
      "Process automation and lightweight systems integration.",
      "Documentation, user training, and ongoing operational support.",
    ].join("\n"),
    [
      "Business web and digital product development support.",
      "Application maintenance and improvement planning.",
      "Workflow and reporting digitisation for operational efficiency.",
      "Implementation support from requirements through launch readiness.",
    ].join("\n"),
  ],
};

const SERVICE_WATERMARK_BY_KEY: Record<string, string> = Object.fromEntries(
  DEFAULT_SERVICE_CONTENT.flatMap((service) =>
    service.watermarkSrc ? [[service.key, service.watermarkSrc]] : []
  )
);

export function splitBodyLines(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function ensureServiceContent() {
  try {
    await Promise.all(
      DEFAULT_SERVICE_CONTENT.map((service) =>
        prisma.serviceContent.upsert({
          where: { key: service.key },
          update: {},
          create: {
            key: service.key,
            title: service.title,
            intro: service.intro,
            body: service.body,
            isTradingInternal: service.isTradingInternal,
            displayOrder: service.displayOrder,
          },
        })
      )
    );

    await Promise.all(
      DEFAULT_SERVICE_CONTENT.map((service) => {
        const legacyBodies = LEGACY_SERVICE_BODIES[service.key];
        if (!legacyBodies?.length) {
          return Promise.resolve();
        }

        return prisma.serviceContent.updateMany({
          where: {
            key: service.key,
            body: { in: legacyBodies },
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

    const services = await prisma.serviceContent.findMany({
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    return services.map((service) => ({
      ...service,
      watermarkSrc: SERVICE_WATERMARK_BY_KEY[service.key] ?? null,
    }));
  } catch {
    return DEFAULT_SERVICE_CONTENT.map((service) => ({
      id: `seed-${service.key}`,
      key: service.key,
      title: service.title,
      intro: service.intro,
      body: service.body,
      isTradingInternal: service.isTradingInternal,
      displayOrder: service.displayOrder,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      watermarkSrc: service.watermarkSrc ?? null,
    }));
  }
}
