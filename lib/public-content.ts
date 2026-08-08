export const PUBLIC_EMAIL = "info@sikhwarigroup.co.za";

export const DIVISION_LEGAL_STATEMENT = "A division of Sikhwari Group (Pty) Ltd.";

export const CREDIBILITY_FACTS = [
  "South African private company",
  "Registration number: 2026/166219/07",
  "B-BBEE Level 1 Contributor",
  "100% black ownership",
  "50% black female ownership",
  "South Africa-based delivery",
  "Four external service areas",
  "One accountable legal entity",
] as const;

export const PORTFOLIOS = [
  {
    title: "Technology, Telecommunications and Cybersecurity",
    divisions: ["SG Telecoms", "SG Digital", "SG Cyber"],
    description:
      "Specialist internal divisions covering connectivity, ICT, cybersecurity, software delivery and digital execution.",
  },
  {
    title: "Operations and Hospitality",
    divisions: ["SG Hospitality"],
    description:
      "Operational and hospitality services for catering, chef services, functions and dependable service execution.",
  },
] as const;

export const ENGAGEMENT_PROCESS = [
  "Confirm the enquiry and service area.",
  "Agree the scope, responsibilities and practical next steps.",
  "Deliver the work with documented execution and communication.",
  "Handover, support or refine where the agreed scope requires it.",
] as const;

type PublicService = {
  key: string;
  title: string;
  division: string;
  portfolio: string;
  href: string;
  summary: string;
  clientProblem: string;
  overview: string;
  scopeNote?: string;
  capabilities: readonly string[];
  deliverables: readonly string[];
  useCases: readonly string[];
  boundaries: readonly string[];
  selectedWorkKeys?: readonly string[];
};

type SelectedWork = {
  key: string;
  name: string;
  statuses: readonly string[];
  businessNeed: string;
  scope: readonly string[];
  contribution: string;
  classification?: string;
};

export const PUBLIC_SERVICES: readonly PublicService[] = [
  {
    key: "telecommunications-ict-network",
    title: "Telecommunications, ICT, and Network Services",
    division: "SG Telecoms",
    portfolio: "Technology, Telecommunications and Cybersecurity",
    href: "/divisions/telecommunications-ict-network-services",
    summary:
      "Practical support for connectivity, ICT coordination, network readiness and operational continuity.",
    clientProblem:
      "Organisations need communications environments that are stable, documented and coordinated across sites, teams and providers.",
    overview:
      "SG Telecoms supports telecommunications, ICT and network delivery under agreed scope, with clear handover, service continuity and change-control discipline.",
    capabilities: [
      "Fibre and FTTH/FTTx delivery support",
      "Customer equipment rollout coordination",
      "Connectivity stability and reliability checks",
      "Incident support and operational troubleshooting",
      "Delivery governance and documentation",
    ],
    deliverables: [
      "Readiness and handover coordination",
      "Configuration and testing support",
      "Service continuity notes",
      "Delivery documentation",
    ],
    useCases: [
      "Businesses coordinating connectivity rollouts",
      "Teams needing network readiness support",
      "Operations that depend on stable communications",
    ],
    boundaries: [
      "Sikhwari Group is not presented as holding regulated telecoms-provider status, radio-frequency rights, manufacturing status or reseller authorisation.",
      "Delivery is scoped as practical support and coordination.",
    ],
  },
  {
    key: "cybersecurity",
    title: "Cybersecurity Services",
    division: "SG Cyber",
    portfolio: "Technology, Telecommunications and Cybersecurity",
    href: "/divisions/cybersecurity-services",
    summary:
      "Authorised cybersecurity assessment, hardening guidance and operational security support.",
    clientProblem:
      "Organisations need practical ways to understand exposure, strengthen controls and improve resilience without unsupported guarantees.",
    overview:
      "SG Cyber provides advisory, assessment and support services for authorised environments and agreed scopes.",
    scopeNote:
      "Cybersecurity services are subject to applicable law, written client authorisation and agreed scope. Work is advisory, assessment and support in nature and does not guarantee incident prevention.",
    capabilities: [
      "Practical security assessments and exposure checks",
      "Security hardening guidance",
      "Remediation coordination",
      "Operational security support for access, process and baseline controls",
      "Compliance-aware advisory support, including POPIA considerations where applicable",
    ],
    deliverables: [
      "Authorised assessment findings",
      "Prioritised remediation guidance",
      "Control improvement notes",
      "Operational security recommendations",
    ],
    useCases: [
      "Businesses improving website and system trust signals",
      "Teams preparing remediation plans",
      "Operations needing authorised security review support",
    ],
    boundaries: [
      "No unauthorised testing is offered or implied.",
      "No guaranteed security outcomes, law-enforcement authority or regulatory certification is claimed.",
    ],
  },
  {
    key: "software-development-digital",
    title: "Software Development and Digital Services",
    division: "SG Digital",
    portfolio: "Technology, Telecommunications and Cybersecurity",
    href: "/divisions/software-development-and-digital-services",
    summary:
      "Websites, internal tools, digital products and process support from requirements through handover.",
    clientProblem:
      "Teams often need business systems and digital services that are practical, maintainable and aligned to real workflows.",
    overview:
      "SG Digital builds and supports digital solutions under documented scope, with attention to implementation, handover and operational use.",
    capabilities: [
      "Website and internal tool delivery",
      "Custom business-system development",
      "Process automation and lightweight integrations",
      "Documentation and user handover",
      "Ongoing digital support where agreed",
    ],
    deliverables: [
      "Requirements and delivery scope",
      "Working digital product or improvement",
      "Documentation and handover notes",
      "Launch-readiness support",
    ],
    useCases: [
      "Businesses needing a website or storefront",
      "Teams needing custom workflows",
      "Operations moving manual processes into digital systems",
    ],
    boundaries: [
      "No certified software-development company claim is made.",
      "Outcomes depend on agreed scope, inputs and operating context.",
    ],
    selectedWorkKeys: ["mzansi-select", "v-property", "sg-digital-trust-check"],
  },
  {
    key: "culinary-hospitality",
    title: "Culinary and Hospitality Services",
    division: "SG Hospitality",
    portfolio: "Operations and Hospitality",
    href: "/divisions/culinary-and-hospitality-services",
    summary:
      "Catering, chef services and function support with practical planning and service discipline.",
    clientProblem:
      "Events and hospitality work need reliable preparation, clear requirements and coordinated delivery.",
    overview:
      "SG Hospitality supports culinary and hospitality operations for corporate and private functions under agreed requirements.",
    capabilities: [
      "Catering and kitchen operations support",
      "Chef services and event execution assistance",
      "Menu support aligned to requirements",
      "Food safety and quality-control practices",
      "Stock handling and kitchen coordination",
    ],
    deliverables: [
      "Confirmed service type and requirements",
      "Event preparation and service plan",
      "Menu or catering support where agreed",
      "Operational coordination for the function",
    ],
    useCases: ["Corporate functions", "Private functions", "Catering and chef-service enquiries"],
    boundaries: [
      "No unverified licensing, premises approval or permit claims are made.",
      "Hospitality work is confirmed against event requirements and agreed scope.",
    ],
  },
] as const satisfies readonly PublicService[];

export const SELECTED_WORK: readonly SelectedWork[] = [
  {
    key: "mzansi-select",
    name: "Mzansi Select",
    statuses: ["Live"],
    businessNeed: "Shopify commerce delivery and operational storefront improvement.",
    scope: [
      "Shopify e-commerce implementation",
      "Storefront and theme refinement",
      "Product and collection structure",
      "Payment and launch-readiness support",
      "Live operational improvement",
    ],
    contribution: "Software Development and Digital Services",
  },
  {
    key: "v-property",
    name: "V-Property",
    statuses: ["MVP", "Demonstrator"],
    businessNeed: "Database-backed property workflows and operational controls.",
    scope: [
      "Database-backed property platform",
      "Property and ownership workflows",
      "Operational controls",
      "Custom business-system development",
    ],
    contribution: "Software Development and Digital Services",
  },
  {
    key: "sg-digital-trust-check",
    name: "SG Digital Trust Check",
    statuses: ["Live", "Internal Product"],
    businessNeed: "Website trust and security assessment support.",
    scope: [
      "HTTPS checks",
      "Metadata checks",
      "Robots and sitemap checks",
      "Security-header checks",
      "Software and cybersecurity capability",
    ],
    contribution: "Software Development and Digital Services; Cybersecurity Services",
    classification: "Internal product",
  },
] as const satisfies readonly SelectedWork[];

export function getPublicServiceByKey(key: string) {
  return PUBLIC_SERVICES.find((service) => service.key === key);
}

export function getPublicServiceByHref(href: string) {
  return PUBLIC_SERVICES.find((service) => service.href === href);
}

export function getSelectedWorkByKeys(keys: readonly string[] | undefined) {
  if (!keys?.length) {
    return [];
  }

  return SELECTED_WORK.filter((item) => keys.includes(item.key));
}
