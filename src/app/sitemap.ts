import { MetadataRoute } from "next";

const base = "https://www.sicoesmonitor.com";
const now = new Date();

const departments = [
  "la-paz", "santa-cruz", "cochabamba", "oruro",
  "potosi", "tarija", "chuquisaca", "beni", "pando",
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

    ...departments.map((slug) => ({
      url: `${base}/licitaciones/departamento/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),

    ...categories.map((slug) => ({
      url: `${base}/licitaciones/categoria/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];
}
