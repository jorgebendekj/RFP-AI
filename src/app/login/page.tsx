"use client";

import { useState } from "react";
import { db } from "@/lib/instant";
import { Radar, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const { isLoading, user, error } = db.useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2
          size={32}
          style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setErr("");
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setStep("code");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error al enviar el código");
    } finally {
      setSending(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setSending(true);
    setErr("");
    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: code.trim() });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Código incorrecto");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--bg)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "rgba(0,229,195,0.12)",
              border: "1px solid var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Radar size={22} color="var(--accent)" />
          </div>
          <div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--accent)",
                letterSpacing: "0.08em",
              }}
            >
              SICOES MONITOR
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Licitaciones · Bolivia
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "32px" }}>
          {step === "email" ? (
            <>
              <h1
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "var(--text)",
                }}
              >
                Iniciar sesión
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "28px" }}>
                Ingresa tu correo para recibir un código de acceso
              </p>

              <form onSubmit={sendCode} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginBottom: "8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CORREO ELECTRÓNICO
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={16}
                      color="var(--muted)"
                      style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
                    />
                    <input
                      className="input"
                      type="email"
                      placeholder="tu@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: "42px" }}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {err && (
                  <p style={{ color: "var(--danger)", fontSize: "0.8125rem" }}>{err}</p>
                )}

                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Enviando...
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      Enviar código
                      <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <CheckCircle size={20} color="var(--success)" />
                <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text)" }}>
                  Código enviado
                </h1>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "28px" }}>
                Revisá tu bandeja de{" "}
                <span style={{ color: "var(--accent)" }}>{email}</span> e ingresá
                el código de 6 dígitos
              </p>

              <form onSubmit={verifyCode} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginBottom: "8px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CÓDIGO DE VERIFICACIÓN
                  </label>
                  <input
                    className="input"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.3em" }}
                    autoFocus
                    required
                  />
                </div>

                {err && (
                  <p style={{ color: "var(--danger)", fontSize: "0.8125rem" }}>{err}</p>
                )}

                <button className="btn-primary" type="submit" disabled={sending}>
                  {sending ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Verificando...
                    </span>
                  ) : (
                    "Ingresar"
                  )}
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => { setStep("email"); setCode(""); setErr(""); }}
                >
                  Cambiar correo
                </button>
              </form>
            </>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          Solo cuentas autorizadas pueden acceder a este sistema.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
