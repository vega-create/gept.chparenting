import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://gept.chparenting.com";
const ids20 = Array.from({ length: 20 }, (_, i) => i + 1);

function levelPages(level: string, priority: number) {
  return [
    { url: `${BASE}/${level}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority },
    ...ids20.map(id => ({
      url: `${BASE}/${level}/unit/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: priority - 0.1,
    })),
    { url: `${BASE}/${level}/game`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/speaking`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
    { url: `${BASE}/${level}/mock-test`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: priority - 0.1 },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...levelPages("elementary", 0.9),
    ...levelPages("intermediate", 0.8),
    ...levelPages("upper-intermediate", 0.8),
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
}
