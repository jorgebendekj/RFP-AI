import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050A0E",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Courier New', monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,195,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,195,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Glow top-center */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(0,229,195,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            position: "relative",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "100px",
              background: "rgba(0,229,195,0.08)",
              border: "1px solid rgba(0,229,195,0.3)",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00D68F",
                display: "flex",
              }}
            />
            <span
              style={{
                color: "#00E5C3",
                fontSize: "18px",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              Sistema activo · Bolivia
            </span>
          </div>

          {/* Logo row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "rgba(0,229,195,0.1)",
                border: "1.5px solid #00E5C3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#00E5C3",
              }}
            >
              R
            </div>
            <span
              style={{
                color: "#00E5C3",
                fontSize: "32px",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              SICOES MONITOR
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#E0EAF4",
              fontSize: "58px",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            Licitaciones de{" "}
            <span style={{ color: "#00E5C3" }}>SICOES</span>
            {" "}con<br />Inteligencia Artificial
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: "#4A6075",
              fontSize: "24px",
              lineHeight: 1.5,
              maxWidth: "700px",
              marginBottom: "48px",
            }}
          >
            Alertas diarias personalizadas para empresas bolivianas
          </div>

          {/* Feature chips */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              "📡  Escaneo diario SICOES",
              "🤖  Análisis con IA",
              "📧  Email 9am Bolivia",
            ].map((label) => (
              <div
                key={label}
                style={{
                  padding: "10px 20px",
                  borderRadius: "100px",
                  background: "rgba(0,229,195,0.08)",
                  border: "1px solid rgba(0,229,195,0.2)",
                  color: "#00E5C3",
                  fontSize: "18px",
                  display: "flex",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            borderTop: "1px solid #1A2E45",
            background: "rgba(13,27,42,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 60px",
          }}
        >
          <span style={{ color: "#4A6075", fontSize: "16px" }}>
            www.sicoesmonitor.com
          </span>
          <span style={{ color: "#4A6075", fontSize: "16px" }}>
            Powered by{" "}
            <span style={{ color: "#00E5C3", fontWeight: 600 }}>Ribentek</span>
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
