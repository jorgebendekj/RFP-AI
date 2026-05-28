import Link from "next/link";
import {
  Radar,
  Bell,
  Brain,
  Search,
  ArrowRight,
  CheckCircle,
  Mail,
  Zap,
  Shield,
  Globe,
  Layers,
  Award,
} from "lucide-react";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué es SICOES Monitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SICOES Monitor es una plataforma que monitorea automáticamente el portal SICOES (sicoes.gob.bo) del Estado Plurinacional de Bolivia. Cada mañana escanea todas las licitaciones vigentes y utiliza Inteligencia Artificial para enviar por email solo las oportunidades relevantes para tu empresa según tu rubro y palabras clave.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo funciona el monitoreo de licitaciones en SICOES?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SICOES Monitor escanea el portal sicoes.gob.bo cada día a las 6am hora Bolivia. Luego Claude IA analiza cada licitación y le asigna un score de relevancia para tu perfil de empresa. A las 9am recibís un email personalizado con las mejores oportunidades del día, ordenadas por relevancia, con link directo a cada licitación.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué empresas bolivianas pueden usar SICOES Monitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cualquier empresa que participe o quiera participar en contrataciones con el Estado boliviano. La plataforma tiene perfiles predefinidos para construcción, tecnología, salud, educación, energía, logística, consultoría, servicios generales y mantenimiento.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es gratuito SICOES Monitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, SICOES Monitor es completamente gratuito. Solo necesitás un email para registrarte, configurar tu perfil y empezar a recibir alertas diarias de licitaciones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Quién desarrolló SICOES Monitor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SICOES Monitor fue desarrollado por Ribentek, empresa tecnológica con más de 25 proyectos implementados en 5 países y 6 industrias. Ribentek se especializa en automatización e inteligencia artificial aplicada a procesos de negocio.",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,10,14,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: "60px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: "1100px", margin: "0 auto", width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(0,229,195,0.12)", border: "1px solid var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Radar size={16} color="var(--accent)" />
          </div>
          <span style={{ fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", fontSize: "0.9375rem" }}>
            SICOES MONITOR
          </span>
        </div>
        <Link href="/login" style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "8px 18px", background: "rgba(0,229,195,0.1)",
          border: "1px solid var(--accent)", borderRadius: "6px",
          color: "var(--accent)", textDecoration: "none",
          fontSize: "0.875rem", fontWeight: 600,
        }}>
          Iniciar sesión <ArrowRight size={14} />
        </Link>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section style={{ textAlign: "center", padding: "96px 0 80px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "100px",
            background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.25)",
            marginBottom: "32px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
            <span style={{ color: "var(--accent)", fontSize: "0.8125rem", letterSpacing: "0.05em" }}>
              Sistema activo · Bolivia
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700,
            lineHeight: "1.15", marginBottom: "24px", letterSpacing: "-0.02em",
          }}>
            Licitaciones de{" "}
            <span style={{ color: "var(--accent)" }}>SICOES</span>
            {" "}analizadas<br />con Inteligencia Artificial
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2vw, 1.175rem)", color: "var(--muted)",
            maxWidth: "620px", margin: "0 auto 40px", lineHeight: "1.7",
          }}>
            Monitoreá automáticamente el portal sicoes.gob.bo y recibí cada mañana
            a las 9am las licitaciones más relevantes para tu empresa, ya analizadas y
            puntuadas por IA según tu rubro.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "var(--accent)", borderRadius: "8px",
              color: "var(--bg)", textDecoration: "none", fontWeight: 700,
              fontSize: "0.9375rem", letterSpacing: "0.02em",
            }}>
              Empezar gratis <ArrowRight size={16} />
            </Link>
            <a href="#como-funciona" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", background: "transparent",
              border: "1px solid var(--border)", borderRadius: "8px",
              color: "var(--text)", textDecoration: "none", fontSize: "0.9375rem",
            }}>
              Cómo funciona
            </a>
          </div>
        </section>

        {/* ── Terminal preview ─────────────────────────────────────────── */}
        <section aria-label="Ejemplo de escaneo SICOES" style={{ marginBottom: "96px" }}>
          <div style={{
            background: "#030810", border: "1px solid var(--border)",
            borderRadius: "12px", overflow: "hidden",
            boxShadow: "0 0 60px rgba(0,229,195,0.06)",
          }}>
            <div style={{
              padding: "12px 16px", background: "var(--card)",
              borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28C840" }} />
              <span style={{ marginLeft: "8px", color: "var(--muted)", fontSize: "0.75rem" }}>sicoes-monitor · escaneo diario</span>
            </div>
            <div style={{ padding: "20px 24px", fontSize: "0.8125rem", lineHeight: "1.8" }}>
              {[
                { t: "accent",  txt: "$ sicoes-monitor --scan --profile=construccion" },
                { t: "muted",   txt: "[09:00:01] Iniciando escaneo de SICOES (sicoes.gob.bo)..." },
                { t: "muted",   txt: "[09:00:02] Leyendo caché de licitaciones vigentes..." },
                { t: "success", txt: "[09:00:03] ✓ 144 licitaciones encontradas en SICOES" },
                { t: "muted",   txt: "[09:00:04] Analizando relevancia con Claude IA..." },
                { t: "success", txt: "[09:00:09] ✓ 15 licitaciones relevantes para tu perfil" },
                { t: "success", txt: "[09:00:10] ✓ Email enviado → empresa@bolivia.com" },
                { t: "accent",  txt: "▋" },
              ].map((l, i) => (
                <div key={i} style={{ color: l.t === "accent" ? "var(--accent)" : l.t === "success" ? "var(--success)" : "var(--muted)" }}>
                  {l.txt}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section aria-labelledby="features-heading" style={{ marginBottom: "96px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 id="features-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "12px" }}>
              Todo lo que necesitás para ganar licitaciones en Bolivia
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
              Diseñado para empresas bolivianas que participan en contrataciones con el Estado
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {[
              {
                icon: <Search size={22} color="var(--accent)" />,
                title: "Escaneo diario de SICOES",
                desc: "Monitoreamos el portal sicoes.gob.bo automáticamente cada mañana y procesamos todas las licitaciones vigentes en Bolivia.",
              },
              {
                icon: <Brain size={22} color="var(--accent)" />,
                title: "Análisis con IA",
                desc: "Claude IA analiza cada licitación y le asigna un score de relevancia del 0 al 100 para tu empresa y rubro específico.",
              },
              {
                icon: <Bell size={22} color="var(--accent)" />,
                title: "Alertas por email a las 9am",
                desc: "Recibís un resumen personalizado cada mañana con las mejores oportunidades del día, sin tener que entrar al portal SICOES.",
              },
              {
                icon: <Zap size={22} color="var(--accent)" />,
                title: "Configuración en minutos",
                desc: "Elegís tu rubro y palabras clave. El sistema filtra y prioriza automáticamente las licitaciones que te interesan.",
              },
            ].map((f) => (
              <article key={f.title} className="card" style={{ padding: "28px 24px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.65" }}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section id="como-funciona" aria-labelledby="how-heading" style={{ marginBottom: "96px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 id="how-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "12px" }}>
              ¿Cómo funciona SICOES Monitor?
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1rem" }}>Tres pasos, completamente automático</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {[
              {
                step: "01",
                title: "Creá tu cuenta",
                desc: "Ingresá tu email, elegís tu rubro (construcción, tecnología, servicios, etc.) y configurás tus palabras clave en menos de 2 minutos.",
                icon: <Mail size={20} color="var(--accent)" />,
              },
              {
                step: "02",
                title: "Activá las notificaciones",
                desc: "Con un clic activás el resumen diario. Inmediatamente te enviamos un email de prueba con las licitaciones vigentes de hoy en SICOES.",
                icon: <Bell size={20} color="var(--accent)" />,
              },
              {
                step: "03",
                title: "Recibí oportunidades cada mañana",
                desc: "A las 9am hora Bolivia recibís tu resumen diario con análisis de IA, score de relevancia y link directo a cada licitación en sicoes.gob.bo.",
                icon: <CheckCircle size={20} color="var(--success)" />,
              },
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", top: "20px", right: "24px",
                  fontSize: "3rem", fontWeight: 700, color: "rgba(0,229,195,0.06)",
                  lineHeight: 1, userSelect: "none",
                }}>
                  {s.step}
                </div>
                <div style={{ marginBottom: "16px" }}>{s.icon}</div>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.65" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social proof ─────────────────────────────────────────────── */}
        <section aria-label="Estadísticas" style={{ marginBottom: "96px" }}>
          <div className="card" style={{
            padding: "40px 32px", textAlign: "center",
            background: "linear-gradient(135deg, rgba(0,229,195,0.05) 0%, rgba(0,119,255,0.05) 100%)",
            border: "1px solid rgba(0,229,195,0.2)",
          }}>
            <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 700, marginBottom: "12px" }}>
              Diseñado para el mercado boliviano
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem", maxWidth: "580px", margin: "0 auto 32px", lineHeight: "1.7" }}>
              SICOES Monitor fue creado específicamente para empresas que participan en el
              Sistema de Contrataciones del Estado Plurinacional de Bolivia (sicoes.gob.bo).
              Todos los datos provienen en tiempo real del portal oficial.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
              {[
                { value: "144+", label: "Licitaciones monitoreadas diariamente" },
                { value: "9am",  label: "Resumen diario, hora Bolivia" },
                { value: "100%", label: "Datos reales de SICOES" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>{s.value}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8125rem", maxWidth: "140px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Types of companies ───────────────────────────────────────── */}
        <section aria-labelledby="rubros-heading" style={{ marginBottom: "96px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 id="rubros-heading" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)", fontWeight: 700, marginBottom: "10px" }}>
              Para todo tipo de empresa boliviana
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Configurá tu perfil según tu rubro y solo recibís licitaciones relevantes para vos
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {[
              "Construcción", "Tecnología e IT", "Salud y Farmacia", "Consultoría",
              "Servicios Generales", "Mantenimiento", "Transporte y Logística", "Educación",
            ].map((cat) => (
              <span key={cat} className="chip" style={{ fontSize: "0.875rem", padding: "8px 18px", cursor: "default" }}>
                {cat}
              </span>
            ))}
          </div>
        </section>

        {/* ── Ribentek credibility ─────────────────────────────────────── */}
        <section aria-labelledby="ribentek-heading" style={{ marginBottom: "96px" }}>
          <div className="card" style={{
            padding: "48px 40px",
            background: "linear-gradient(135deg, rgba(0,229,195,0.04) 0%, rgba(0,119,255,0.04) 100%)",
            border: "1px solid rgba(0,229,195,0.15)",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "4px 14px", borderRadius: "100px",
                  background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.2)",
                  marginBottom: "20px",
                }}>
                  <Award size={13} color="var(--accent)" />
                  <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.06em", fontWeight: 600 }}>
                    DESARROLLADO POR RIBENTEK
                  </span>
                </div>
                <h2 id="ribentek-heading" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 700, marginBottom: "14px" }}>
                  Tecnología con experiencia real en Latinoamérica
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "0.9375rem", lineHeight: "1.75", maxWidth: "560px", marginBottom: "28px" }}>
                  SICOES Monitor es un producto de{" "}
                  <a href="https://ribentek.com" target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                    Ribentek
                  </a>
                  , empresa especializada en automatización e Inteligencia Artificial para procesos de negocio.
                  Con proyectos en producción en Bolivia, Argentina, Chile, Perú y México, Ribentek aplica
                  tecnología de vanguardia a problemas reales del mercado latinoamericano.
                </p>
                <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                  {[
                    { icon: <Layers size={16} color="var(--accent)" />, value: "25+", label: "proyectos implementados" },
                    { icon: <Globe size={16} color="var(--accent)" />,  value: "5",   label: "países" },
                    { icon: <Zap size={16} color="var(--accent)" />,    value: "6",   label: "industrias" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "8px",
                        background: "rgba(0,229,195,0.08)", border: "1px solid rgba(0,229,195,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "1.375rem", fontWeight: 700, color: "var(--accent)", lineHeight: 1.1 }}>{s.value}</div>
                        <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "2px" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                padding: "24px 28px",
                background: "rgba(0,229,195,0.06)", border: "1px solid rgba(0,229,195,0.2)",
                borderRadius: "12px", textAlign: "center", minWidth: "160px",
              }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "12px",
                  background: "rgba(0,229,195,0.1)", border: "1.5px solid var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", fontWeight: 700, color: "var(--accent)",
                  marginBottom: "8px",
                }}>
                  R
                </div>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em" }}>RIBENTEK</span>
                <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>ribentek.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" style={{ marginBottom: "96px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 id="faq-heading" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)", fontWeight: 700, marginBottom: "10px" }}>
              Preguntas frecuentes
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9375rem" }}>
              Todo lo que necesitás saber sobre SICOES Monitor
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "760px", margin: "0 auto" }}>
            {[
              {
                q: "¿Qué es SICOES Monitor?",
                a: "SICOES Monitor es una plataforma que monitorea automáticamente el portal SICOES (sicoes.gob.bo) del Estado Plurinacional de Bolivia. Cada mañana escanea todas las licitaciones vigentes y usa IA para enviarte solo las oportunidades relevantes para tu empresa según tu rubro y palabras clave.",
              },
              {
                q: "¿Cómo funciona el monitoreo de licitaciones?",
                a: "El sistema escanea sicoes.gob.bo cada día a las 6am hora Bolivia. Claude IA analiza cada licitación y le asigna un score de relevancia para tu perfil. A las 9am recibís un email con las mejores oportunidades del día, ordenadas por relevancia, con link directo a cada licitación.",
              },
              {
                q: "¿Qué empresas pueden usar SICOES Monitor?",
                a: "Cualquier empresa que participe o quiera participar en contrataciones con el Estado boliviano: construcción, tecnología, salud, educación, energía, logística, consultoría, servicios generales y mantenimiento.",
              },
              {
                q: "¿Es gratuito?",
                a: "Sí, SICOES Monitor es completamente gratuito. Solo necesitás un email para registrarte, configurar tu perfil y empezar a recibir alertas diarias de licitaciones desde SICOES.",
              },
              {
                q: "¿Los datos son oficiales del portal SICOES?",
                a: "Sí. Los datos provienen directamente del portal oficial sicoes.gob.bo del Estado Plurinacional de Bolivia. SICOES Monitor nunca inventa ni modifica la información de las licitaciones.",
              },
            ].map((item) => (
              <div key={item.q} className="card" style={{ padding: "24px 28px" }}>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "10px", color: "var(--text)" }}>
                  {item.q}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.7", margin: 0 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA final ────────────────────────────────────────────────── */}
        <section style={{ textAlign: "center", marginBottom: "80px" }}>
          <div className="card" style={{
            padding: "56px 32px",
            background: "linear-gradient(135deg, rgba(0,229,195,0.06) 0%, transparent 60%)",
            border: "1px solid rgba(0,229,195,0.2)",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "14px",
              background: "rgba(0,229,195,0.1)", border: "1px solid var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Radar size={26} color="var(--accent)" />
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "16px" }}>
              Empezá a monitorear SICOES hoy
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto 32px", lineHeight: "1.7" }}>
              Ingresá con tu email y configurá tu perfil en menos de 2 minutos.
              El primer email con licitaciones de SICOES llega hoy mismo.
            </p>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "16px 32px", background: "var(--accent)", borderRadius: "8px",
              color: "var(--bg)", textDecoration: "none", fontWeight: 700,
              fontSize: "1rem",
            }}>
              Crear cuenta gratis <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radar size={16} color="var(--accent)" />
            <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              SICOES Monitor · licitaciones Bolivia · sicoesmonitor.com
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Shield size={13} color="var(--muted)" />
            <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              Powered by{" "}
              <a
                href="https://ribentek.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}
              >
                Ribentek
              </a>
              {" "}· 25+ proyectos · 5 países · 6 industrias
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
