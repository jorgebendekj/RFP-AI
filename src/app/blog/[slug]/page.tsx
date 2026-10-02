import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { BlockView, Rich } from "@/components/Rich";
import { BLOG_POSTS, getPost, postWordCount, readingMinutes } from "@/lib/blogPosts";
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
      authors: ["Ribentek"],
      section: post.category,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

const fmtDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" });

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const minutes = readingMinutes(post);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    abstract: post.tldr,
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    wordCount: postWordCount(post),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    inLanguage: "es-BO",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE_URL}/og.png`,
    about: [{ "@type": "Country", name: "Bolivia" }, { "@type": "Thing", name: "SICOES" }],
    author: { "@type": "Organization", name: "Ribentek", url: "https://ribentek.com" },
    publisher: {
      "@type": "Organization",
      name: "SICOES Monitor",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    citation: post.sources?.map((s) => s.url),
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
  const howToLd = post.howTo && {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.howTo.name,
    description: post.howTo.description,
    inLanguage: "es-BO",
    step: post.howTo.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#paso-${i + 1}`,
    })),
  };
  const related = post.related.map((s) => getPost(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const lds = [articleLd, faqLd, crumbLd, ...(howToLd ? [howToLd] : [])];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {lds.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, letterSpacing: "0.08em" }}>SICOES MONITOR</Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/licitaciones" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>Licitaciones</Link>
          <Link href="/login" style={{ padding: "7px 16px", background: "rgba(0,229,195,0.1)", border: "1px solid var(--accent)", borderRadius: "6px", color: "var(--accent)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600 }}>
            Alertas gratis →
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "32px 24px 80px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: "0.8125rem", color: "#8AA0B5", marginBottom: "24px" }}>
          <Link href="/" style={{ color: "#8AA0B5", textDecoration: "none" }}>Inicio</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/blog" style={{ color: "#8AA0B5", textDecoration: "none" }}>Blog</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span>{post.category}</span>
        </nav>

        <article>
          <header>
            <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>{post.category}</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, margin: "10px 0 16px", color: "#F2F7FB" }}>{post.title}</h1>
            <p style={{ color: "#8AA0B5", fontSize: "0.875rem", margin: "0 0 28px" }}>
              Por <a href="https://ribentek.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C9D6E3" }}>Ribentek</a>
              {" "}· Publicado <time dateTime={post.datePublished}>{fmtDate(post.datePublished)}</time>
              {" "}· Actualizado <time dateTime={post.dateModified}>{fmtDate(post.dateModified)}</time>
              {" "}· {minutes} min de lectura
            </p>
          </header>

          <div className="callout callout-tip" style={{ marginTop: 0 }}>
            <strong>Respuesta rápida</strong>
            <Rich text={post.tldr} />
          </div>

          <nav className="toc card" aria-label="Contenido del artículo" style={{ padding: "20px 24px", margin: "28px 0 8px" }}>
            <strong style={{ color: "#F2F7FB", fontSize: "0.9375rem" }}>En este artículo</strong>
            <ol style={{ margin: "12px 0 0", paddingLeft: "20px", lineHeight: 2, fontSize: "0.9375rem" }}>
              {post.sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>
              ))}
              <li><a href="#preguntas-frecuentes">Preguntas frecuentes</a></li>
              {post.sources && post.sources.length > 0 && <li><a href="#fuentes">Fuentes</a></li>}
            </ol>
          </nav>

          <div className="prose">
            {post.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.blocks.map((b, i) => <BlockView key={i} block={b} />)}
              </section>
            ))}

            {post.howTo && (
              <section aria-labelledby="resumen-pasos">
                <h2 id="resumen-pasos">{post.howTo.name}: resumen en pasos</h2>
                <p>{post.howTo.description}</p>
                <ol>
                  {post.howTo.steps.map((st, i) => (
                    <li key={i} id={`paso-${i + 1}`}><strong>{st.name}.</strong> {st.text}</li>
                  ))}
                </ol>
              </section>
            )}

            <section aria-labelledby="preguntas-frecuentes">
              <h2 id="preguntas-frecuentes">Preguntas frecuentes</h2>
              {post.faqs.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            {post.sources && post.sources.length > 0 && (
              <section aria-labelledby="fuentes">
                <h2 id="fuentes">Fuentes y lecturas oficiales</h2>
                <ul>
                  {post.sources.map((s) => (
                    <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="card" style={{ padding: "28px 30px", margin: "40px 0", textAlign: "center", border: "1px solid rgba(0,229,195,0.25)" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "1.125rem", color: "#F2F7FB" }}>No pierdas ninguna convocatoria</p>
            <p style={{ margin: "0 0 18px", color: "#C9D6E3", lineHeight: 1.7 }}>
              Recibe cada mañana a las 9am (hora Bolivia) las licitaciones de SICOES más relevantes para tu rubro, con puntaje de IA. Gratis.
            </p>
            <Link href="/login" style={{ display: "inline-block", padding: "13px 28px", background: "var(--accent)", borderRadius: "8px", color: "var(--bg)", textDecoration: "none", fontWeight: 700 }}>
              Crear cuenta gratis
            </Link>
          </div>

          <aside className="card" style={{ padding: "22px 26px", marginBottom: "40px", color: "#C9D6E3", fontSize: "0.9375rem", lineHeight: 1.7 }}>
            <strong style={{ color: "#F2F7FB" }}>Sobre este artículo.</strong> Lo prepara el equipo de{" "}
            <a href="https://ribentek.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Ribentek</a>,
            creador de SICOES Monitor, un servicio independiente que no es el portal oficial ni está afiliado al Estado boliviano.
            La información es orientativa: confirma siempre los datos y plazos en{" "}
            <a href="https://www.sicoes.gob.bo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>sicoes.gob.bo</a>{" "}
            y en el documento base de contratación de cada proceso. ¿Encontraste un error? Escríbenos a{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--accent)" }}>{SUPPORT_EMAIL}</a>.
          </aside>
        </article>

        {related.length > 0 && (
          <aside aria-label="Artículos relacionados">
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px", color: "#F2F7FB" }}>Sigue leyendo</h2>
            <div style={{ display: "grid", gap: "14px" }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="card" style={{ padding: "18px 22px", textDecoration: "none", display: "block" }}>
                  <span style={{ color: "var(--accent)", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{r.category}</span>
                  <span style={{ display: "block", color: "#F2F7FB", fontWeight: 600, margin: "4px 0 6px" }}>{r.title}</span>
                  <span style={{ color: "#8AA0B5", fontSize: "0.875rem", lineHeight: 1.6 }}>{r.description}</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
