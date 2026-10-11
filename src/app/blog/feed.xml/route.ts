import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [...BLOG_POSTS]
    .sort((a, b) => b.dateModified.localeCompare(a.dateModified))
    .map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.datePublished + "T12:00:00Z").toUTCString()}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(p.description)}</description>
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SICOES Monitor — Guías de licitaciones en Bolivia</title>
    <link>${SITE_URL}/blog</link>
    <description>Guías sobre SICOES, RUPE, ANPE y cómo participar en licitaciones del Estado en Bolivia.</description>
    <language>es-bo</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
