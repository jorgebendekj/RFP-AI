import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, readingMinutes } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog y guías de SICOES, RUPE y licitaciones en Bolivia",
  description:
    "Guías completas sobre SICOES, RUPE, ANPE, DBC y cómo participar y ganar licitaciones del Estado en Bolivia. Actualizado 2026.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog y guías de SICOES, RUPE y licitaciones en Bolivia",
    description: "Guías completas para participar y ganar licitaciones del Estado en Bolivia.",
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
    mainEntity: {
      "@type": "ItemList",
      itemListElement: BLOG_POSTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, letterSpacing: "0.08em" }}>SICOES MONITOR</Link>
        <Link href="/licitaciones" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>Licitaciones</Link>
      </nav>
      <main style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "12px", color: "#F2F7FB" }}>
          Guías de SICOES, RUPE y licitaciones en Bolivia
        </h1>
        <p style={{ color: "#C9D6E3", lineHeight: 1.75, marginBottom: "40px", maxWidth: "680px" }}>
          Artículos completos y actualizados para entender el Sistema de Contrataciones Estatales, registrarte como proveedor y preparar propuestas que cumplan.
        </p>

        <Link href={`/blog/${featured.slug}`} className="card" style={{ display: "block", padding: "32px 34px", textDecoration: "none", marginBottom: "20px", border: "1px solid rgba(0,229,195,0.3)" }}>
          <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>Guía principal · {featured.category}</span>
          <h2 style={{ fontSize: "clamp(1.375rem, 3vw, 1.75rem)", fontWeight: 700, margin: "10px 0", color: "#F2F7FB", lineHeight: 1.3 }}>{featured.title}</h2>
          <p style={{ color: "#C9D6E3", lineHeight: 1.75, margin: "0 0 12px" }}>{featured.tldr}</p>
          <span style={{ color: "#8AA0B5", fontSize: "0.8125rem" }}>{readingMinutes(featured)} min de lectura · Actualizado {featured.dateModified}</span>
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "16px" }}>
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ display: "flex", flexDirection: "column", padding: "24px 26px", textDecoration: "none" }}>
              <span style={{ color: "var(--accent)", fontSize: "0.6875rem", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>{p.category}</span>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, margin: "8px 0 10px", color: "#F2F7FB", lineHeight: 1.35 }}>{p.title}</h2>
              <p style={{ color: "#C9D6E3", fontSize: "0.875rem", lineHeight: 1.7, margin: "0 0 14px", flexGrow: 1 }}>{p.description}</p>
              <span style={{ color: "#8AA0B5", fontSize: "0.75rem" }}>{readingMinutes(p)} min de lectura</span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
