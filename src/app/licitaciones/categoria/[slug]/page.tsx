import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTenders, filterByCategory, sortByDate,
  DEPARTMENTS, CATEGORIES,
} from "@/lib/publicTenders";

export const revalidate = 3600;

const siteUrl = "https://www.sicoesmonitor.com";

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return {};
  return {
    title: `Licitaciones de ${cat.name} en Bolivia — SICOES 2026`,
    description: `Convocatorias y licitaciones de ${cat.name} publicadas en SICOES (sicoes.gob.bo) Bolivia. Datos oficiales actualizados diariamente. Recibí alertas personalizadas gratis.`,
    alternates: { canonical: `${siteUrl}/licitaciones/categoria/${slug}` },
    openGraph: {
      title: `Licitaciones de ${cat.name} en Bolivia — SICOES 2026`,
      description: `Convocatorias y licitaciones de ${cat.name} del portal oficial SICOES Bolivia. Actualizadas diariamente.`,
      url: `${siteUrl}/licitaciones/categoria/${slug}`,
    },
  };
}

export default async function CategoriaPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  const allTenders = await getTenders();
  const filtered = sortByDate(filterByCategory(allTenders, slug)).slice(0, 40);
  const updatedAt = filtered[0]
    ? new Date(filtered[0].scrapedAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Licitaciones", item: `${siteUrl}/licitaciones` },
      { "@type": "ListItem", position: 3, name: cat.name, item: `${siteUrl}/licitaciones/categoria/${slug}` },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Licitaciones de ${cat.name} en Bolivia — SICOES`,
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 10).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.objeto,
      description: `${t.entidad} · ${t.tipoContratacion} · Cierre: ${t.fechaPresentacion}`,
      url: t.url,
    })),
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: "1px solid var(--border)", padding: "0 24px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: "1100px", margin: "0 auto",
      }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.08em" }}>
          SICOES MONITOR
        </Link>
        <Link href="/login" style={{
          padding: "7px 16px", background: "rgba(0,229,195,0.1)", border: "1px solid var(--accent)",
          borderRadius: "6px", color: "var(--accent)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600,
        }}>
          Crear cuenta gratis →
        </Link>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ padding: "16px 0 0", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Inicio</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/licitaciones" style={{ color: "var(--muted)", textDecoration: "none" }}>Licitaciones</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "var(--accent)" }}>{cat.name}</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section style={{ padding: "40px 0 36px" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
            Licitaciones de <span style={{ color: "var(--accent)" }}>{cat.name}</span> en Bolivia<br />
            <span style={{ fontSize: "0.7em", color: "var(--muted)", fontWeight: 400 }}>SICOES — Convocatorias Vigentes 2026</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", maxWidth: "680px", lineHeight: 1.75, marginBottom: "12px" }}>
            Todas las licitaciones y convocatorias de <strong style={{ color: "var(--text)" }}>{cat.name}</strong> publicadas
            en el portal oficial <strong style={{ color: "var(--text)" }}>SICOES (sicoes.gob.bo)</strong> del Estado Plurinacional de Bolivia.
            Las entidades públicas bolivianas contratan {cat.name.toLowerCase()} a través del sistema SICOES.
            Encontrá aquí todas las convocatorias vigentes de este rubro en Bolivia.
          </p>
          {updatedAt && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              Actualizado: <strong style={{ color: "var(--accent)" }}>{updatedAt}</strong>
              {" "}· {filtered.length} licitaciones de {cat.name}
            </p>
          )}
        </section>

        {/* ── Tenders table ───────────────────────────────────────── */}
        <section aria-labelledby="table-heading" style={{ marginBottom: "56px" }}>
          <h2 id="table-heading" style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "20px" }}>
            Convocatorias vigentes de {cat.name} — SICOES Bolivia 2026
          </h2>

          {filtered.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", marginBottom: "12px" }}>
                No se encontraron licitaciones vigentes de {cat.name} en este momento.
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                El sistema actualiza los datos cada mañana desde sicoes.gob.bo.{" "}
                <Link href="/licitaciones" style={{ color: "var(--accent)" }}>Ver todas las licitaciones de Bolivia →</Link>
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", textAlign: "left" }}>
                    <th style={{ padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" }}>CUCE</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" }}>OBJETO / ENTIDAD</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" }}>TIPO</th>
                    <th style={{ padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" }}>CIERRE</th>
                    <th style={{ padding: "10px 12px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px", color: "var(--accent)", fontWeight: 600, whiteSpace: "nowrap" }}>
                        {t.cuce}
                      </td>
                      <td style={{ padding: "12px", maxWidth: "420px" }}>
                        <div style={{ color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{t.objeto}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{t.entidad}</div>
                      </td>
                      <td style={{ padding: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                        {t.tipoContratacion}
                      </td>
                      <td style={{ padding: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                        {t.fechaPresentacion}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "var(--accent)", border: "1px solid var(--accent)",
                            borderRadius: "4px", padding: "5px 10px", textDecoration: "none",
                            fontSize: "0.75rem", whiteSpace: "nowrap",
                          }}
                        >
                          Ver en SICOES →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Other categories ────────────────────────────────────── */}
        <section aria-labelledby="otros-cat" style={{ marginBottom: "48px" }}>
          <h2 id="otros-cat" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--muted)", marginBottom: "14px", letterSpacing: "0.05em" }}>
            OTROS RUBROS — LICITACIONES SICOES BOLIVIA
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.entries(CATEGORIES).map(([s, { name }]) => (
              <Link
                key={s}
                href={`/licitaciones/categoria/${s}`}
                style={{
                  padding: "6px 14px", borderRadius: "100px", textDecoration: "none", fontSize: "0.8125rem",
                  background: s === slug ? "rgba(0,119,255,0.2)" : "rgba(0,119,255,0.06)",
                  border: `1px solid ${s === slug ? "#60A5FA" : "rgba(0,119,255,0.2)"}`,
                  color: s === slug ? "#60A5FA" : "var(--muted)",
                  fontWeight: s === slug ? 600 : 400,
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Other departments ───────────────────────────────────── */}
        <section aria-labelledby="otros-dept" style={{ marginBottom: "56px" }}>
          <h2 id="otros-dept" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--muted)", marginBottom: "14px", letterSpacing: "0.05em" }}>
            LICITACIONES POR DEPARTAMENTO
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.entries(DEPARTMENTS).map(([s, { name }]) => (
              <Link
                key={s}
                href={`/licitaciones/departamento/${s}`}
                style={{
                  padding: "6px 14px", borderRadius: "100px", textDecoration: "none", fontSize: "0.8125rem",
                  background: "rgba(0,229,195,0.06)", border: "1px solid rgba(0,229,195,0.2)",
                  color: "var(--muted)",
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "80px" }}>
          <div className="card" style={{
            padding: "36px 32px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(0,229,195,0.05) 0%, transparent 60%)",
            border: "1px solid rgba(0,229,195,0.2)",
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "12px" }}>
              Recibí alertas de licitaciones de {cat.name} — gratis
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
              Configurá tu perfil con el rubro {cat.name} y recibí cada mañana a las 9am solo las
              licitaciones de SICOES relevantes para tu empresa. Sin costo.
            </p>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 26px", background: "var(--accent)", borderRadius: "8px",
              color: "var(--bg)", textDecoration: "none", fontWeight: 700, fontSize: "0.9375rem",
            }}>
              Crear cuenta gratis →
            </Link>
          </div>
        </section>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: "0.8125rem" }}>
        <p>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>SICOES Monitor</Link>
          {" "}· Datos oficiales de{" "}
          <a href="https://sicoes.gob.bo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>sicoes.gob.bo</a>
          {" "}· Bolivia
        </p>
      </footer>
    </div>
  );
}
