import { adminDb } from "@/lib/instantAdmin";
import { KEYWORD_PRESETS, COMPANY_TYPES } from "@/lib/companyKeywords";

export interface CachedTender {
  id: string;
  cuce: string;
  entidad: string;
  tipoContratacion: string;
  modalidad: string;
  objeto: string;
  fechaPublicacion: string;
  fechaPresentacion: string;
  estado: string;
  url: string;
  form100Url?: string;
  scrapedAt: number;
}

// ─── Department config ────────────────────────────────────────────────────────

export const DEPARTMENTS: Record<string, { name: string; keywords: string[] }> = {
  "la-paz":      { name: "La Paz",      keywords: ["la paz", "lapaz", "murillo", "la-paz"] },
  "santa-cruz":  { name: "Santa Cruz",  keywords: ["santa cruz", "santacruz", "santa-cruz"] },
  "cochabamba":  { name: "Cochabamba",  keywords: ["cochabamba"] },
  "oruro":       { name: "Oruro",       keywords: ["oruro"] },
  "potosi":      { name: "Potosí",      keywords: ["potosi", "potosí"] },
  "tarija":      { name: "Tarija",      keywords: ["tarija"] },
  "chuquisaca":  { name: "Chuquisaca",  keywords: ["chuquisaca", "sucre"] },
  "beni":        { name: "Beni",        keywords: ["beni", "trinidad"] },
  "pando":       { name: "Pando",       keywords: ["pando", "cobija"] },
};

// ─── Category config ─────────────────────────────────────────────────────────

export const CATEGORIES: Record<string, { name: string; slug: string }> = {
  construccion:   { name: "Construcción",         slug: "construccion" },
  tecnologia:     { name: "Tecnología e IT",      slug: "tecnologia" },
  salud:          { name: "Salud y Farmacia",     slug: "salud" },
  consultoria:    { name: "Consultoría",          slug: "consultoria" },
  servicios:      { name: "Servicios Generales",  slug: "servicios" },
  mantenimiento:  { name: "Mantenimiento",        slug: "mantenimiento" },
  logistica:      { name: "Transporte y Logística", slug: "logistica" },
  educacion:      { name: "Educación",            slug: "educacion" },
};

// ─── Data fetching ────────────────────────────────────────────────────────────

export async function getTenders(): Promise<CachedTender[]> {
  try {
    const res = await adminDb.query({ siceosTenders: {} });
    return (res.siceosTenders as unknown as CachedTender[]) || [];
  } catch {
    return [];
  }
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function filterByDepartment(tenders: CachedTender[], slug: string): CachedTender[] {
  const dept = DEPARTMENTS[slug];
  if (!dept) return [];
  return tenders.filter((t) => {
    const haystack = normalize(t.entidad);
    return dept.keywords.some((kw) => haystack.includes(normalize(kw)));
  });
}

export function filterByCategory(tenders: CachedTender[], slug: string): CachedTender[] {
  const keywords = KEYWORD_PRESETS[slug as keyof typeof KEYWORD_PRESETS];
  if (!keywords) return [];
  return tenders.filter((t) => {
    const haystack = normalize(`${t.objeto} ${t.tipoContratacion} ${t.modalidad}`);
    return keywords.some((kw) => haystack.includes(normalize(kw)));
  });
}

export function sortByDate(tenders: CachedTender[]): CachedTender[] {
  return [...tenders].sort((a, b) => b.scrapedAt - a.scrapedAt);
}
