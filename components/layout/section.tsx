import { ReactNode } from "react";
import { Container } from "@/components/layout/container";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, description, children, className = "" }: SectionProps) {
  return (
    <section className={`py-10 sm:py-14 ${className}`}>
      <Container>
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
          ) : null}
        </div>
        <div className="mt-6">{children}</div>
      </Container>
    </section>
  );
}
