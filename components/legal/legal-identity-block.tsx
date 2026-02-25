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
        <li>Full legal name: SIKHWARI GROUP (Pty) Ltd</li>
        <li>Registration No: [to be issued]</li>
        <li>Registered address: [to be confirmed]</li>
      </ul>
      <p className="mt-3">
        All service lines are divisions of a single legal entity (not separate companies).
      </p>
    </section>
  );
}
