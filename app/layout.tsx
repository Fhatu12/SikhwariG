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
    "Sikhwari Group (Pty) Ltd provides professional services across advisory, cybersecurity, and internal operations support.",
  openGraph: {
    title: "Sikhwari Group (Pty) Ltd",
    description:
      "A professional services group focused on practical delivery, governance, and disciplined operations.",
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
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
