import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const size = { width: 1200, height: 630 };

export async function GET(_req: NextRequest) {
  const img = new ImageResponse(
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
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,195,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,195,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "450px",
            background: "radial-gradient(ellipse, rgba(0,229,195,0.15) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              padding: "8px 22px",
              borderRadius: "100px",
              background: "rgba(0,229,195,0.08)",
              border: "1px solid rgba(0,229,195,0.35)",
              marginBottom: "36px",
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
            <span style={{ color: "#00E5C3", fontSize: "18px", letterSpacing: "0.08em", fontWeight: 600 }}>
              Sistema activo · Bolivia
            </span>
          </div>

          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "32px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "14px",
                background: "rgba(0,229,195,0.1)",
                border: "2px solid #00E5C3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                fontWeight: 700,
                color: "#00E5C3",
              }}
            >
              R
            </div>
            <span style={{ color: "#00E5C3", fontSize: "34px", fontWeight: 700, letterSpacing: "0.12em" }}>
              SICOES MONITOR
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#E0EAF4",
              fontSize: "60px",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "24px",
              maxWidth: "920px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>
              Licitaciones de{" "}
              <span style={{ color: "#00E5C3" }}>SICOES</span>
            </span>
            <span>con Inteligencia Artificial</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: "#4A6075",
              fontSize: "24px",
              lineHeight: 1.5,
              maxWidth: "700px",
              marginBottom: "44px",
            }}
          >
            Alertas diarias personalizadas para empresas bolivianas
          </div>

          {/* Feature chips */}
          <div style={{ display: "flex", gap: "14px" }}>
            {["Escaneo diario SICOES", "Analisis con IA", "Email 9am Bolivia"].map((label) => (
              <div
                key={label}
                style={{
                  padding: "10px 22px",
                  borderRadius: "100px",
                  background: "rgba(0,229,195,0.08)",
                  border: "1px solid rgba(0,229,195,0.25)",
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

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "62px",
            borderTop: "1px solid #1A2E45",
            background: "rgba(13,27,42,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 64px",
          }}
        >
          <span style={{ color: "#4A6075", fontSize: "16px" }}>www.ribentek.site</span>
          <span style={{ color: "#4A6075", fontSize: "16px" }}>
            Powered by{" "}
            <span style={{ color: "#00E5C3", fontWeight: 600 }}>Ribentek</span>
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );

  return img;
}
