import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import TendersTable from "@/components/TendersTable";
import LocationExtras from "@/components/LocationExtras";
import { DEPARTMENT_INFO } from "@/lib/locationInfo";
import { notFound } from "next/navigation";
import {
  getTenders, filterByDepartment, sortByDate,
  DEPARTMENTS, CATEGORIES,
} from "@/lib/publicTenders";

export const revalidate = 3600;

const siteUrl = "https://www.sicoesmonitor.com";

export function generateStaticParams() {
  return Object.keys(DEPARTMENTS).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const dept = DEPARTMENTS[slug];
  if (!dept) return {};
  const count = filterByDepartment(await getTenders(), slug).length;
  const title = `SICOES ${dept.name}: convocatorias vigentes hoy (2026)`;
  const description = count > 0
    ? `${count} convocatorias SICOES vigentes en ${dept.name}, Bolivia, actualizadas a diario. Entidad, objeto y cierre de cada proceso. Alertas gratis.`
    : `Convocatorias y licitaciones SICOES en ${dept.name}, Bolivia. Datos de sicoes.gob.bo cada día. Alertas gratis por email.`;
  const url = `${siteUrl}/licitaciones/departamento/${slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function DepartamentoPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const dept = DEPARTMENTS[slug];
  if (!dept) notFound();

  const allTenders = await getTenders();
  const filtered = sortByDate(filterByDepartment(allTenders, slug)).slice(0, 40);
  const updatedAt = filtered[0]
    ? new Date(filtered[0].scrapedAt).toLocaleDateString("es-BO", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Licitaciones", item: `${siteUrl}/licitaciones` },
      { "@type": "ListItem", position: 3, name: dept.name, item: `${siteUrl}/licitaciones/departamento/${slug}` },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Licitaciones SICOES en ${dept.name}`,
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
    <div className="public-site" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
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
          <span style={{ color: "var(--accent)" }}>{dept.name}</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section style={{ padding: "40px 0 36px" }}>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
            Licitaciones <span style={{ color: "var(--accent)" }}>SICOES</span> en {dept.name}<br />
            <span style={{ fontSize: "0.7em", color: "var(--muted)", fontWeight: 400 }}>Convocatorias Vigentes 2026</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9375rem", maxWidth: "680px", lineHeight: 1.75, marginBottom: "12px" }}>
            Listado actualizado de licitaciones y convocatorias vigentes publicadas en el portal{" "}
            <strong style={{ color: "var(--text)" }}>SICOES (sicoes.gob.bo)</strong> correspondientes al
            departamento de <strong style={{ color: "var(--text)" }}>{dept.name}</strong>, Bolivia.
            Las entidades del Estado en {dept.name} publican sus convocatorias de obras, bienes y servicios
            en el portal oficial SICOES. Encontrá aquí todas las oportunidades vigentes.
          </p>
          {updatedAt && (
            <p style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              Actualizado: <strong style={{ color: "var(--accent)" }}>{updatedAt}</strong>
              {" "}· {filtered.length} licitaciones en {dept.name}
            </p>
          )}
        </section>

        {/* ── Tenders table ───────────────────────────────────────── */}
        <section aria-labelledby="table-heading" style={{ marginBottom: "56px" }}>
          <h2 id="table-heading" style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "20px" }}>
            Convocatorias vigentes en {dept.name} — SICOES 2026
          </h2>

          <TendersTable rows={filtered} fallback={sortByDate(allTenders).slice(0, 8)} placeName={dept.name} />
        </section>

        {/* ── Other departments ───────────────────────────────────── */}
        <section aria-labelledby="otros-dept" style={{ marginBottom: "48px" }}>
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
                  background: s === slug ? "rgba(0,229,195,0.15)" : "rgba(0,229,195,0.06)",
                  border: `1px solid ${s === slug ? "var(--accent)" : "rgba(0,229,195,0.2)"}`,
                  color: s === slug ? "var(--accent)" : "var(--muted)",
                  fontWeight: s === slug ? 600 : 400,
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Other categories ────────────────────────────────────── */}
        <section aria-labelledby="otros-cat" style={{ marginBottom: "56px" }}>
          <h2 id="otros-cat" style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--muted)", marginBottom: "14px", letterSpacing: "0.05em" }}>
            LICITACIONES POR RUBRO
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.entries(CATEGORIES).map(([s, { name }]) => (
              <Link
                key={s}
                href={`/licitaciones/categoria/${s}`}
                style={{
                  padding: "6px 14px", borderRadius: "100px", textDecoration: "none", fontSize: "0.8125rem",
                  background: "rgba(0,119,255,0.06)", border: "1px solid rgba(0,119,255,0.2)",
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
              Recibí las licitaciones de {dept.name} filtradas para tu rubro
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
              SICOES Monitor analiza todas las convocatorias con IA y te envía cada mañana a las 9am
              solo las que son relevantes para tu empresa. Gratis.
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
      <LocationExtras name={dept.name} info={DEPARTMENT_INFO[slug]} url={`${siteUrl}/licitaciones/departamento/${slug}`} />

      <SiteFooter />
    </div>
  );
}
