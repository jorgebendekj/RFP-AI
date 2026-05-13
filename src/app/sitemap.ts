import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.ribentek.site";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
