import Link from "next/link";
import type { CachedTender } from "@/lib/publicTenders";

const th = { padding: "10px 12px", fontWeight: 600, letterSpacing: "0.05em", fontSize: "0.75rem" } as const;

function Rows({ rows }: { rows: CachedTender[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)", textAlign: "left" }}>
            <th style={th}>CUCE</th>
            <th style={th}>OBJETO / ENTIDAD</th>
            <th style={th}>TIPO</th>
            <th style={th}>CIERRE</th>
            <th style={{ padding: "10px 12px" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "12px", color: "var(--accent)", fontWeight: 600, whiteSpace: "nowrap" }}>{t.cuce}</td>
              <td style={{ padding: "12px", maxWidth: "420px" }}>
                <div style={{ color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{t.objeto}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{t.entidad}</div>
              </td>
              <td style={{ padding: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>{t.tipoContratacion}</td>
              <td style={{ padding: "12px", color: "var(--muted)", whiteSpace: "nowrap" }}>{t.fechaPresentacion}</td>
              <td style={{ padding: "12px" }}>
                <a href={t.url} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: "4px", padding: "5px 10px", textDecoration: "none", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  Ver en SICOES →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Tenders for a place. When the daily cache has none for that place, show the latest
 * national tenders instead of an empty box so visitors still find something useful.
 */
export default function TendersTable({
  rows, fallback, placeName,
}: { rows: CachedTender[]; fallback: CachedTender[]; placeName: string }) {
  if (rows.length > 0) return <Rows rows={rows} />;
  return (
    <div>
      <div className="card" style={{ padding: "24px 28px", marginBottom: "24px" }}>
        <p style={{ color: "var(--text)", margin: "0 0 8px", lineHeight: 1.7 }}>
          Hoy no detectamos convocatorias vigentes de entidades de <strong>{placeName}</strong> en nuestra lectura diaria de SICOES.
          Esto no significa que no existan: el listado oficial y completo está en{" "}
          <a href="https://www.sicoes.gob.bo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>sicoes.gob.bo</a>.
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0, lineHeight: 1.7 }}>
          Crea una cuenta gratis y recibe cada mañana lo nuevo de tu rubro.{" "}
          <Link href="/login" style={{ color: "var(--accent)" }}>Activar alertas →</Link>
        </p>
      </div>
      {fallback.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "12px" }}>Últimas convocatorias nacionales detectadas</h3>
          <Rows rows={fallback} />
        </>
      )}
    </div>
  );
}
