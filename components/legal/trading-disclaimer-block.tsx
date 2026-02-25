type TradingDisclaimerBlockProps = {
  className?: string;
};

export function TradingDisclaimerBlock({ className = "" }: TradingDisclaimerBlockProps) {
  return (
    <section
      className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 ${className}`}
      aria-label="Trading disclaimer"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide">
        Proprietary Trading Disclaimer
      </h3>
      <ul className="mt-3 space-y-2">
        <li>Proprietary trading is internal capital allocation only.</li>
        <li>Any trading activity is limited to company-owned funds.</li>
        <li>No financial advice is provided.</li>
        <li>No public solicitation takes place.</li>
        <li>No third-party or client funds are managed.</li>
      </ul>
    </section>
  );
}
