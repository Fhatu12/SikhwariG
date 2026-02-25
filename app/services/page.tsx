import { Section } from "@/components/layout/section";
import { TradingDisclaimerBlock } from "@/components/legal/trading-disclaimer-block";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Service overview for advisory, cybersecurity, and internal operations under Sikhwari Group (Pty) Ltd.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Section
      title="Services"
      description="Service lines are grouped under Sikhwari Group (Pty) Ltd using clear, accountable categories."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Telecommunications, ICT, and Network Services
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Connectivity planning and rollout support for business operations.</li>
            <li>Infrastructure coordination across sites, teams, and service providers.</li>
            <li>Service continuity support for communication and network environments.</li>
            <li>Vendor and contract alignment for practical delivery outcomes.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Cybersecurity Services</h3>
          <p className="mt-2 text-sm text-slate-600">
            Scope disclaimer: services are advisory, assessment, and support in nature, subject to
            applicable law and client authorization where required.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Baseline risk reviews and practical control recommendations.</li>
            <li>Policy and process support for governance and accountability.</li>
            <li>Incident readiness guidance for internal teams and stakeholders.</li>
            <li>Awareness support to strengthen everyday secure work practices.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900">
            Treasury / Internal - Proprietary Trading and Market Activities (Internal Capital
            Allocation)
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-700">
            Not offered as a public service.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Internal market research to inform treasury decisions.</li>
            <li>Proprietary capital allocation for company-owned funds only.</li>
            <li>Governance-aligned risk controls and management oversight.</li>
            <li>Performance monitoring for internal financial planning purposes.</li>
          </ul>
          <TradingDisclaimerBlock className="mt-4" />
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Culinary and Hospitality Services
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Catering support for corporate meetings and private functions.</li>
            <li>Event planning coordination with service and guest experience focus.</li>
            <li>Menu and service package design aligned to client requirements.</li>
            <li>Hospitality operations support for consistent service quality.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Software Development and Digital Services
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Business web and digital product development support.</li>
            <li>Application maintenance and improvement planning.</li>
            <li>Workflow and reporting digitization for operational efficiency.</li>
            <li>Implementation support from requirements through launch readiness.</li>
          </ul>
        </article>
      </div>
    </Section>
  );
}
