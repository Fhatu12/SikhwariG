"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-[var(--color-surface-muted)]/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-8">
        <Link href="/" className="flex items-center shrink-0 w-[140px] sm:w-[160px]">
          <img
            src="/brand/sg-parent.png"
            alt="Sikhwari Group"
            width={140}
            height={28}
            className="h-8 w-auto opacity-90 saturate-75 sm:h-9"
          />
        </Link>
        <button
          type="button"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-slate-300 text-slate-700 hover:border-slate-500 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {isOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
        <nav aria-label="Primary navigation" className="hidden md:flex items-center">
          <ul className="flex flex-nowrap items-center gap-5 whitespace-nowrap text-sm font-medium text-slate-700">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-link text-link-subtle focus-ring text-sm font-medium"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20 bg-slate-900/20 md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            id="mobile-menu"
            className="absolute left-0 right-0 top-full z-30 border-b border-slate-200 bg-white shadow-[var(--shadow-soft)] md:hidden"
          >
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <nav aria-label="Mobile navigation" className="py-2">
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        className="focus-ring rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium text-slate-800 hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]"
                        href={item.href}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      className="focus-ring rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium text-slate-800 hover:bg-[var(--color-brand-50)] hover:text-[var(--color-brand-700)]"
                      href="/contact?intent=quote"
                      onClick={closeMenu}
                    >
                      Request a quote
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
