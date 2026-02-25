import {
  divisionStatement,
  legalName,
  registeredAddress,
  registrationNumber,
} from "@/lib/legal-identity";

type LegalIdentityBlockProps = {
  className?: string;
};

export function LegalIdentityBlock({ className = "" }: LegalIdentityBlockProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-[var(--color-surface-muted)] p-4 text-sm text-slate-700 ${className}`}
      aria-label="Legal company identity"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
        Legal identity
      </h3>
      <ul className="mt-3 space-y-2">
        <li>Full legal name: {legalName}</li>
        <li>Registration No: {registrationNumber}</li>
        <li>Registered address: {registeredAddress}</li>
      </ul>
      <p className="mt-3">{divisionStatement}</p>
    </section>
  );
}
