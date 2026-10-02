import Link from "next/link";
import { Radar, Mail } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/site";

const linkStyle = { color: "var(--muted)", textDecoration: "none", fontSize: "0.8125rem" } as const;

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radar size={16} color="var(--accent)" />
            <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              SICOES Monitor · licitaciones Bolivia · sicoesmonitor.com
            </span>
          </div>
          <nav aria-label="Pie de página" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/licitaciones" style={linkStyle}>Licitaciones</Link>
            <Link href="/blog" style={linkStyle}>Blog y guías</Link>
            <Link href="/blog/que-es-sicoes-bolivia" style={linkStyle}>¿Qué es SICOES?</Link>
            <Link href="/blog/sicoes-requerimiento-de-personal-2026" style={linkStyle}>Requerimiento de personal</Link>
            <Link href="/blog/como-registrarse-en-el-rupe-bolivia" style={linkStyle}>RUPE</Link>
            <Link href="/login" style={linkStyle}>Crear cuenta</Link>
          </nav>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
            Producto de{" "}
            <a href="https://ribentek.com" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Ribentek</a>
            . Datos de{" "}
            <a href="https://sicoes.gob.bo" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)" }}>sicoes.gob.bo</a>
            . Sitio independiente, no afiliado al Estado.
          </span>
          <a href={`mailto:${SUPPORT_EMAIL}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent)", textDecoration: "none", fontSize: "0.8125rem", fontWeight: 600 }}>
            <Mail size={14} /> Soporte: {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
