/**
 * Inline markup supported inside every text field:
 *   **bold**   and   [label](url)   (internal links start with "/", external with "https://")
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone: "info" | "warn" | "tip"; title?: string; text: string };

export interface BlogSection {
  /** kebab-case anchor id, unique within the post */
  id: string;
  heading: string;
  blocks: Block[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** 120–160 chars, meta description */
  description: string;
  /** Direct, quotable 40–70 word answer shown first (optimized for AI answer engines) */
  tldr: string;
  category: "Fundamentos" | "Registro y trámites" | "Estrategia" | "Herramientas" | "Empleo y consultorías" | "Glosario";
  datePublished: string;
  dateModified: string;
  keywords: string[];
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  /** slugs of related posts (3 recommended) */
  related: string[];
  /** Official / primary sources actually consulted */
  sources?: { label: string; url: string }[];
  /** Optional HowTo structured data (for step-by-step guides) */
  howTo?: { name: string; description: string; steps: { name: string; text: string }[] };
}
