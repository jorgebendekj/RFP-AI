import type { Metadata } from "next";
import Link from "next/link";
import { getTenders, sortByDate, DEPARTMENTS, CATEGORIES } from "@/lib/publicTenders";

export const revalidate = 3600;

const siteUrl = "https://www.sicoesmonitor.com";

export const metadata: Metadata = {
  title: "Licitaciones SICOES Bolivia — Convocatorias Vigentes 2026",
  description:
    "Listado completo de licitaciones y convocatorias vigentes del portal SICOES (sicoes.gob.bo) en Bolivia. Datos oficiales actualizados diariamente. Filtrá por departamento y rubro.",
  alternates: { canonical: `${siteUrl}/licitaciones` },
  openGraph: {
    title: "Licitaciones SICOES Bolivia — Convocatorias Vigentes 2026",
    description:
      "Listado completo de licitaciones y convocatorias vigentes del portal SICOES (sicoes.gob.bo) en Bolivia. Datos oficiales actualizados diariamente.",
    url: `${siteUrl}/licitaciones`,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Licitaciones", item: `${siteUrl}/licitaciones` },
  ],
};

export default async function LicitacionesPage() {
  const allTenders = await getTenders();
  const recent = sortByDate(allTenders).slice(0, 30);
  const updatedAt = recent[0]
    ? new Date(recent[0].scrapedAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Licitaciones SICOES Bolivia vigentes",
    numberOfItems: allTenders.length,
    itemListElement: recent.slice(0, 10).map((t, i) => ({
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

      {/* ── Nav ─────────────────────────────────────────────────────── */}
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

        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ padding: "16px 0 0", fontSize: "0.8125rem", color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Inicio</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "var(--accent)" }}>Licitaciones</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section style={{ padding: "40px 0 36px" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
            Licitaciones <span style={{ color: "var(--accent)" }}>SICOES</span> Bolivia<br />
            Convocatorias Vigentes 2026
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "680px", lineHeight: 1.75, marginBottom: "12px" }}>
            Listado actualizado de todas las licitaciones y convocatorias vigentes publicadas en el portal oficial{" "}
            <strong style={{ color: "var(--text)" }}>SICOES (sicoes.gob.bo)</strong> del Estado Plurinacional de Bolivia.
            Los datos son extraídos directamente del portal oficial y actualizados diariamente.
          </p>
          {updatedAt && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              Última actualización: <strong style={{ color: "var(--accent)" }}>{updatedAt}</strong>
              {" "}· {allTenders.length} licitaciones vigentes en total
            </p>
          )}
        </section>

        {/* ── Filter by department ────────────────────────────────── */}
        <section aria-labelledby="dept-heading" style={{ marginBottom: "48px" }}>
          <h2 id="dept-heading" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "16px" }}>
            Licitaciones SICOES por departamento de Bolivia
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.entries(DEPARTMENTS).map(([slug, { name }]) => (
              <Link
                key={slug}
                href={`/licitaciones/departamento/${slug}`}
                style={{
                  padding: "8px 18px", borderRadius: "100px",
                  background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.25)",
                  color: "var(--accent)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500,
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Filter by category ──────────────────────────────────── */}
        <section aria-labelledby="cat-heading" style={{ marginBottom: "56px" }}>
          <h2 id="cat-heading" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "16px" }}>
            Licitaciones SICOES por rubro
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.entries(CATEGORIES).map(([slug, { name }]) => (
              <Link
                key={slug}
                href={`/licitaciones/categoria/${slug}`}
                style={{
                  padding: "8px 18px", borderRadius: "100px",
                  background: "rgba(0,119,255,0.08)", border: "1px solid rgba(0,119,255,0.25)",
                  color: "#60A5FA", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500,
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Tenders table ───────────────────────────────────────── */}
        <section aria-labelledby="table-heading" style={{ marginBottom: "80px" }}>
          <h2 id="table-heading" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "20px" }}>
            Últimas licitaciones vigentes en SICOES Bolivia
          </h2>

          {recent.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              No hay licitaciones cargadas aún. El sistema actualiza cada mañana a las 6am hora Bolivia.
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
                    <th style={{ padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
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

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section style={{ marginBottom: "80px" }}>
          <div className="card" style={{
            padding: "40px 32px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(0,229,195,0.05) 0%, transparent 60%)",
            border: "1px solid rgba(0,229,195,0.2)",
          }}>
            <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "12px" }}>
              Recibí estas licitaciones filtradas para tu empresa — gratis
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "28px", maxWidth: "520px", margin: "0 auto 28px", lineHeight: 1.7 }}>
              SICOES Monitor analiza todas estas licitaciones con IA y te envía cada mañana a las 9am
              solo las que son relevantes para tu rubro y palabras clave. Sin costo.
            </p>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "var(--accent)", borderRadius: "8px",
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
