import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

const REQUIRED_DIVISION_LINE = "A division of Sikhwari Group (Pty) Ltd.";

const DIVISIONS: Record<
  string,
  {
    title: string;
    description: string;
    intro: string;
  }
> = {
  "telecommunications-ict-network-services": {
    title: "Telecommunications, ICT, and Network Services",
    description:
      "Telecommunications, ICT, and network services delivered under Sikhwari Group (Pty) Ltd.",
    intro:
      "Delivery and support across telecommunications, ICT, and network operations aligned to governance, reliability, and accountable execution.",
  },
  "cybersecurity-services": {
    title: "Cybersecurity Services",
    description: "Cybersecurity services delivered under Sikhwari Group (Pty) Ltd.",
    intro:
      "Authorised cybersecurity delivery focused on practical risk reduction, incident readiness, and disciplined operational controls.",
  },
  "culinary-and-hospitality-services": {
    title: "Culinary and Hospitality Services",
    description: "Culinary and hospitality services delivered under Sikhwari Group (Pty) Ltd.",
    intro:
      "Catering and hospitality delivery focused on service standards, food safety discipline, and dependable event execution.",
  },
  "software-development-and-digital-services": {
    title: "Software Development and Digital Services",
    description:
      "Software development and digital services delivered under Sikhwari Group (Pty) Ltd.",
    intro:
      "Software development and digital delivery aligned to operational needs, secure implementation, and maintainable outcomes.",
  },
};

type DivisionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: DivisionPageProps) {
  const { slug } = await params;
  const division = DIVISIONS[slug];
  if (!division) {
    return buildMetadata({
      title: "Division",
      description: "Division page for Sikhwari Group (Pty) Ltd.",
      path: `/divisions/${slug}`,
    });
  }

  return buildMetadata({
    title: division.title,
    description: division.description,
    path: `/divisions/${slug}`,
  });
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { slug } = await params;
  const division = DIVISIONS[slug];

  if (!division) {
    notFound();
  }

  return (
    <Section title={division.title} description={division.description}>
      <div className="max-w-3xl space-y-4 text-slate-700">
        <p className="text-sm font-semibold text-slate-900">{REQUIRED_DIVISION_LINE}</p>
        <p>{division.intro}</p>
      </div>
    </Section>
  );
}

