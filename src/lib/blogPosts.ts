import type { Block, BlogPost } from "./blogTypes";

import queEsSicoes from "@/content/blog/que-es-sicoes-bolivia";
import rupe from "@/content/blog/como-registrarse-en-el-rupe-bolivia";
import modalidades from "@/content/blog/modalidades-de-contratacion-estatal-bolivia";
import encontrar from "@/content/blog/como-encontrar-licitaciones-en-bolivia";
import herramientas from "@/content/blog/herramientas-de-alertas-de-licitaciones-bolivia";
import ganar from "@/content/blog/como-ganar-licitaciones-en-bolivia";
import personal from "@/content/blog/sicoes-requerimiento-de-personal-2026";
import ingresar from "@/content/blog/sicoes-gob-bo-como-ingresar-y-buscar-convocatorias";
import dbc from "@/content/blog/documento-base-de-contratacion-dbc-bolivia";
import errores from "@/content/blog/errores-que-descalifican-propuestas-licitaciones-bolivia";
import glosario from "@/content/blog/glosario-contrataciones-estatales-bolivia";

export type { BlogPost, BlogSection, Block } from "./blogTypes";

export const BLOG_POSTS: BlogPost[] = [
  queEsSicoes, rupe, modalidades, encontrar, ingresar, personal,
  ganar, dbc, errores, herramientas, glosario,
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

function stripMarkup(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");
}

function blockText(b: Block): string {
  switch (b.type) {
    case "p": case "h3": return stripMarkup(b.text);
    case "ul": case "ol": return b.items.map(stripMarkup).join(" ");
    case "table": return [...b.head, ...b.rows.flat()].map(stripMarkup).join(" ");
    case "callout": return stripMarkup(`${b.title ?? ""} ${b.text}`);
  }
}

export function postWordCount(p: BlogPost): number {
  const text = [
    p.tldr,
    ...p.sections.flatMap((s) => [s.heading, ...s.blocks.map(blockText)]),
    ...p.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(p: BlogPost): number {
  return Math.max(1, Math.round(postWordCount(p) / 200));
}
