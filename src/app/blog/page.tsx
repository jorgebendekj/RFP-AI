import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog y guías de licitaciones en Bolivia — SICOES, RUPE, ANPE",
  description:
    "Guías prácticas sobre SICOES, RUPE, modalidades de contratación (ANPE, Licitación Pública) y cómo ganar licitaciones del Estado en Bolivia.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog y guías de licitaciones en Bolivia",
    description: "SICOES, RUPE, ANPE y cómo ganar licitaciones del Estado en Bolivia.",
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog de SICOES Monitor",
    url: `${SITE_URL}/blog`,
    inLanguage: "es-BO",
    hasPart: BLOG_POSTS.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.datePublished,
    })),
  };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, letterSpacing: "0.08em" }}>SICOES MONITOR</Link>
        <Link href="/licitaciones" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>Licitaciones</Link>
      </nav>
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "12px" }}>
          Guías de licitaciones y contrataciones del Estado en Bolivia
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "40px" }}>
          Todo sobre SICOES, el RUPE, las modalidades de contratación y cómo preparar propuestas ganadoras.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {BLOG_POSTS.map((p) => (
            <article key={p.slug} className="card" style={{ padding: "24px 28px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "8px" }}>
                <Link href={`/blog/${p.slug}`} style={{ color: "var(--text)", textDecoration: "none" }}>{p.title}</Link>
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 10px" }}>{p.description}</p>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                <time dateTime={p.datePublished}>{p.datePublished}</time> · {p.readingMinutes} min de lectura
              </span>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
