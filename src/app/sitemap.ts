import { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/site";

const base = SITE_URL;
const now = new Date();

const departments = [
  "la-paz", "santa-cruz", "cochabamba", "oruro",
  "potosi", "tarija", "chuquisaca", "beni", "pando",
];

const municipalities = [
  "sacaba", "el-alto", "quillacollo", "tiquipaya", "vinto", "viacha", "sucre",
];

const categories = [
  "construccion", "tecnologia", "salud", "consultoria",
  "servicios", "mantenimiento", "logistica", "educacion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base,               lastModified: now, changeFrequency: "daily",   priority: 1 },
    { url: `${base}/login`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/licitaciones`, lastModified: now, changeFrequency: "daily", priority: 0.95 },

    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    ...BLOG_POSTS.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...departments.map((slug) => ({
      url: `${base}/licitaciones/departamento/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),

    ...municipalities.map((slug) => ({
      url: `${base}/licitaciones/municipio/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),

    ...categories.map((slug) => ({
      url: `${base}/licitaciones/categoria/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];
}
