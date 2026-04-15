import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/industries",
    "/services",
    "/contact",
    "/divisions/telecommunications-ict-network-services",
    "/divisions/cybersecurity-services",
    "/divisions/culinary-and-hospitality-services",
    "/divisions/software-development-and-digital-services",
    "/legal/privacy",
    "/legal/terms",
    "/legal/disclaimer",
  ];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
  }));
}
