import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

function unitIds(count: number) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

function levelPages(level: string, unitCount: number, priority: number) {
  return [
    { url: `${BASE}/${level}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority },
    ...unitIds(unitCount).map(id => ({
      url: `${BASE}/${level}/unit/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: priority - 0.1,
    })),
    { url: `${BASE}/${level}/game`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/speaking`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/mock-test`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/writing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Platform pages
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/how-to-use`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },

    // GEPT levels
    ...levelPages("elementary", 20, 0.9),
    ...levelPages("intermediate", 34, 0.8),
    ...levelPages("upper-intermediate", 40, 0.8),
  ];
}
