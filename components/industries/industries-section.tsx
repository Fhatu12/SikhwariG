import { Section } from "@/components/layout/section";
import type { IndustryItem } from "@/lib/industries-content";

type IndustriesSectionProps = {
  title: string;
  intro: string;
  items: IndustryItem[];
};

export function IndustriesSection({ title, intro, items }: IndustriesSectionProps) {
  return (
    <Section title={title} description={intro}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
