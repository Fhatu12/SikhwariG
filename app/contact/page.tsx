import { ContactForm } from "@/components/forms/contact-form";
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
        description="Use this page for business enquiries and consultation requests."
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <ContactForm initialIntent={initialIntent} />
          <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-slate-900">What happens next</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>We review your enquiry and route it to the right service area.</li>
              <li>We may ask 1-2 clarifying questions to confirm scope.</li>
              <li>We respond with next steps and, where relevant, an estimate.</li>
              <li>Your information is handled with appropriate safeguards and POPIA awareness.</li>
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
