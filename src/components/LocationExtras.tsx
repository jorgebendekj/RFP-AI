import Link from "next/link";
import type { LocationInfo } from "@/lib/locationInfo";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

const body = { color: "var(--muted)", fontSize: "0.9375rem", lineHeight: 1.8 } as const;
const link = { color: "var(--accent)" } as const;

export default function LocationExtras({
  name, info, url,
}: { name: string; info: LocationInfo; url: string }) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: info.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section aria-labelledby="como-participar" style={{ maxWidth: "1100px", margin: "0 auto 40px", padding: "0 24px" }}>
        <div className="card" style={{ padding: "28px 32px" }}>
          <h2 id="como-participar" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "12px" }}>
            Contrataciones públicas en {name}: cómo participar
          </h2>
          <p style={{ ...body, marginBottom: "12px" }}>{info.intro}</p>
          <p style={{ ...body, marginBottom: "6px" }}><strong style={{ color: "var(--text)" }}>Capital / ciudad principal:</strong> {info.capital}.</p>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: "18px 0 8px" }}>Entidades que suelen contratar</h3>
          <ul style={{ ...body, paddingLeft: "20px", margin: 0 }}>
            {info.entities.map((e) => <li key={e}>{e}</li>)}
          </ul>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: "18px 0 8px" }}>Consejos para ofertar en {name}</h3>
          <ul style={{ ...body, paddingLeft: "20px", margin: 0 }}>
            {info.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p style={{ ...body, marginTop: "18px" }}>
            Para presentar propuestas debes estar inscrito en el RUPE y leer el documento base de contratación de cada proceso.
            Guías: <Link href="/blog/que-es-sicoes-bolivia" style={link}>qué es SICOES</Link>,{" "}
            <Link href="/blog/como-registrarse-en-el-rupe-bolivia" style={link}>cómo registrarse en el RUPE</Link>,{" "}
            <Link href="/blog/como-postular-en-sicoes-paso-a-paso" style={link}>cómo postular</Link>,{" "}
            <Link href="/blog/que-es-anpe-bolivia" style={link}>qué es el ANPE</Link>,{" "}
            <Link href="/blog/convocatorias-de-personal-sicoes-por-ciudad" style={link}>convocatorias de personal por ciudad</Link> y{" "}
            <Link href="/blog/licitaciones-bolivia-por-departamento" style={link}>licitaciones por departamento</Link>.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-ubicacion" style={{ maxWidth: "1100px", margin: "0 auto 56px", padding: "0 24px" }}>
        <h2 id="faq-ubicacion" style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "14px" }}>Preguntas frecuentes sobre {name}</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {info.faqs.map((f) => (
            <div key={f.q} className="card" style={{ padding: "20px 24px" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "8px" }}>{f.q}</h3>
              <p style={{ ...body, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.8125rem", marginTop: "16px" }}>
          SICOES Monitor es un servicio independiente; los datos provienen de{" "}
          <a href="https://www.sicoes.gob.bo" target="_blank" rel="noopener noreferrer" style={link}>sicoes.gob.bo</a>. ¿Dudas?{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={link}>{SUPPORT_EMAIL}</a>. Página: {url.replace(SITE_URL, "")}
        </p>
      </section>
    </>
  );
}
