import { ContactForm } from "@/components/forms/contact-form";
import { LegalIdentityBlock } from "@/components/legal/legal-identity-block";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact Sikhwari Group (Pty) Ltd for business and consultation enquiries.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{
    intent?: string;
  }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const initialIntent = params.intent === "quote" ? "Request a quote" : "General enquiry";

  return (
    <>
      <Section
        title="Contact"
        description="Use this page for business enquiries and consultation requests. Trading solicitations are not accepted."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <ContactForm initialIntent={initialIntent} />
          <LegalIdentityBlock />
        </div>
      </Section>
    </>
  );
}
