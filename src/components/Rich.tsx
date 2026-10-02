import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "@/lib/blogTypes";

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Renders **bold** and [label](url) inline markup. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const [, label, href] = m;
          return href.startsWith("/") ? (
            <Link key={i} href={href}>{label}</Link>
          ) : (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const CALLOUT_LABEL = { info: "Dato clave", tip: "Consejo", warn: "Importante" } as const;

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p><Rich text={block.text} /></p>;
    case "h3":
      return <h3><Rich text={block.text} /></h3>;
    case "ul":
      return <ul>{block.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ul>;
    case "ol":
      return <ol>{block.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ol>;
    case "table":
      return (
        <div className="table-wrap" role="region" tabIndex={0} aria-label={block.caption ?? "Tabla"}>
          <table>
            {block.caption && <caption>{block.caption}</caption>}
            <thead><tr>{block.head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}><Rich text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`callout callout-${block.tone}`}>
          <strong>{block.title ?? CALLOUT_LABEL[block.tone]}</strong>
          <Rich text={block.text} />
        </aside>
      );
  }
}
