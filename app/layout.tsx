import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sikhwari Group (Pty) Ltd",
    template: "%s | Sikhwari Group (Pty) Ltd",
  },
  description:
    "Sikhwari Group (Pty) Ltd provides telecommunications, cybersecurity, software, digital and hospitality services under one accountable South African company.",
  openGraph: {
    title: "Sikhwari Group (Pty) Ltd",
    description:
      "A South African services company focused on practical delivery across technology, telecommunications, cybersecurity, digital services and hospitality.",
    type: "website",
    locale: "en_ZA",
    siteName: "Sikhwari Group (Pty) Ltd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${lora.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
          <a
            className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-brand-700)] focus:shadow-[var(--shadow-soft)]"
            href="#main-content"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
