import type { Block, BlogPost } from "./blogTypes";
import { SITE_URL } from "./site";

const abs = (md: string) => md.replace(/\]\((\/[^)]*)\)/g, (_, p) => `](${SITE_URL}${p})`);

function blockToMd(b: Block): string {
  switch (b.type) {
    case "p": return abs(b.text);
    case "h3": return `### ${b.text}`;
    case "ul": return b.items.map((i) => `- ${abs(i)}`).join("\n");
    case "ol": return b.items.map((i, n) => `${n + 1}. ${abs(i)}`).join("\n");
    case "table": {
      const head = `| ${b.head.join(" | ")} |`;
      const sep = `| ${b.head.map(() => "---").join(" | ")} |`;
      const rows = b.rows.map((r) => `| ${r.map(abs).join(" | ")} |`).join("\n");
      return `${b.caption ? `*${b.caption}*\n\n` : ""}${head}\n${sep}\n${rows}`;
    }
    case "callout": return `> **${b.title ?? "Nota"}:** ${abs(b.text)}`;
  }
}

export function postToMarkdown(p: BlogPost): string {
  const out: string[] = [
    `# ${p.title}`,
    `URL: ${SITE_URL}/blog/${p.slug}`,
    `Categoría: ${p.category} · Publicado: ${p.datePublished} · Actualizado: ${p.dateModified}`,
    `> ${abs(p.tldr)}`,
  ];
  for (const s of p.sections) {
    out.push(`## ${s.heading}`, ...s.blocks.map(blockToMd));
  }
  if (p.howTo) {
    out.push(`## ${p.howTo.name}`, p.howTo.description, p.howTo.steps.map((s, i) => `${i + 1}. **${s.name}.** ${s.text}`).join("\n"));
  }
  out.push("## Preguntas frecuentes", ...p.faqs.map((f) => `**${f.q}**\n\n${f.a}`));
  if (p.sources?.length) out.push("## Fuentes", p.sources.map((s) => `- [${s.label}](${s.url})`).join("\n"));
  return out.join("\n\n");
}
