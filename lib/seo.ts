import type { Metadata } from "next";

const SITE_NAME = "Sikhwari Group (Pty) Ltd";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.sikhwarigroup.co.za";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: MetadataInput): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "en_ZA",
    },
  };
}
