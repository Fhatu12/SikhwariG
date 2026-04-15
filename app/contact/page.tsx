import { ContactForm } from "@/components/forms/contact-form";
import { Section } from "@/components/layout/section";
import {
  contactEmails,
  contactPhones,
  contactRegisteredAddress,
  contactWebsite,
} from "@/lib/contact-details";
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
          <div className="space-y-6">
            <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <h3 className="text-base font-semibold text-slate-900">Contact details</h3>
              <dl className="mt-3 space-y-3 text-sm text-slate-700">
                <div>
                  <dt className="font-medium text-slate-900">Registered address</dt>
                  <dd className="whitespace-pre-line">{contactRegisteredAddress}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Phone</dt>
                  <dd className="space-y-1">
                    {contactPhones.map((phone) => (
                      <div key={phone.tel}>
                        {phone.label}:{" "}
                        <a
                          className="text-link text-link-subtle focus-ring font-medium"
                          href={`tel:${phone.tel}`}
                        >
                          {phone.number}
                        </a>
                      </div>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Email</dt>
                  <dd className="space-y-1">
                    {contactEmails.map((email) => (
                      <div key={email}>
                        <a
                          className="text-link text-link-subtle focus-ring font-medium"
                          href={`mailto:${email}`}
                        >
                          {email}
                        </a>
                      </div>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Website</dt>
                  <dd>
                    <a
                      className="text-link text-link-subtle focus-ring font-medium"
                      href={`https://${contactWebsite}`}
                    >
                      {contactWebsite}
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
            <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)]">
              <h3 className="text-base font-semibold text-slate-900">What happens next</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>We review your enquiry and route it to the right service area.</li>
                <li>We may ask 1-2 clarifying questions to confirm scope.</li>
                <li>We respond with next steps and, where relevant, an estimate.</li>
                <li>Your information is handled with appropriate safeguards and POPIA awareness.</li>
              </ul>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
