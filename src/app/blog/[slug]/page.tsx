import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { BLOG_POSTS, getPost } from "@/lib/blogPosts";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      locale: "es_BO",
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    inLanguage: "es-BO",
    mainEntityOfPage: url,
    about: { "@type": "Country", name: "Bolivia" },
    author: { "@type": "Organization", name: "Ribentek", url: "https://ribentek.com" },
    publisher: { "@type": "Organization", name: "SICOES Monitor", url: SITE_URL },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  const related = post.related.map((s) => getPost(s)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {[articleLd, faqLd, crumbLd].map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, letterSpacing: "0.08em" }}>SICOES MONITOR</Link>
        <Link href="/login" style={{ padding: "7px 16px", background: "rgba(0,229,195,0.1)", border: "1px solid var(--accent)", borderRadius: "6px", color: "var(--accent)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600 }}>
          Alertas gratis →
        </Link>
      </nav>
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Inicio</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>Blog</Link>
        </nav>
        <article>
          <h1 style={{ fontSize: "clamp(1.625rem, 4vw, 2.25rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "12px" }}>{post.title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginBottom: "28px" }}>
            Por Ribentek · Actualizado <time dateTime={post.dateModified}>{post.dateModified}</time> · {post.readingMinutes} min
          </p>
          <div className="card" style={{ padding: "20px 24px", borderLeft: "3px solid var(--accent)", marginBottom: "36px" }}>
            <strong style={{ color: "var(--accent)", fontSize: "0.8125rem", letterSpacing: "0.06em" }}>RESPUESTA RÁPIDA</strong>
            <p style={{ margin: "8px 0 0", lineHeight: 1.75 }}>{post.tldr}</p>
          </div>
          {post.sections.map((s) => (
            <section key={s.heading} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>{s.heading}</h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: "12px" }}>{p}</p>
              ))}
              {s.list && (
                s.ordered ? (
                  <ol style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "22px" }}>
                    {s.list.map((li) => <li key={li}>{li}</li>)}
                  </ol>
                ) : (
                  <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "22px" }}>
                    {s.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )
              )}
            </section>
          ))}
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "16px" }}>Preguntas frecuentes</h2>
            {post.faqs.map((f) => (
              <div key={f.q} style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "6px" }}>{f.q}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </section>
          <div className="card" style={{ padding: "24px 28px", marginBottom: "40px", textAlign: "center" }}>
            <p style={{ margin: "0 0 14px", lineHeight: 1.7 }}>
              Recibe cada mañana las licitaciones de SICOES relevantes para tu empresa, con análisis de IA. Gratis.
            </p>
            <Link href="/login" style={{ display: "inline-block", padding: "12px 24px", background: "var(--accent)", borderRadius: "8px", color: "var(--bg)", textDecoration: "none", fontWeight: 700 }}>
              Crear cuenta gratis
            </Link>
          </div>
        </article>
        {related.length > 0 && (
          <aside aria-label="Artículos relacionados">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "12px" }}>Sigue leyendo</h2>
            <ul style={{ paddingLeft: "20px", lineHeight: 2 }}>
              {related.map((r) => (
                <li key={r.slug}><Link href={`/blog/${r.slug}`} style={{ color: "var(--accent)", textDecoration: "none" }}>{r.title}</Link></li>
              ))}
            </ul>
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginTop: "24px" }}>
              ¿Dudas o correcciones? Escríbenos a <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent)" }}>{SUPPORT_EMAIL}</a>.
            </p>
          </aside>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
