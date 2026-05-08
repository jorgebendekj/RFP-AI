"use client";

import { useState } from "react";
import { db } from "@/lib/instant";
import { id } from "@instantdb/react";
import {
  Radar,
  Shield,
  ArrowLeft,
  Users,
  Bell,
  BellOff,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { COMPANY_TYPES, KEYWORD_PRESETS, type CompanyType } from "@/lib/companyKeywords";

export default function AdminPage() {
  const { isLoading, user } = db.useAuth();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  const { data } = db.useQuery(user ? { siceosSettings: {} } : null);
  const settings = data?.siceosSettings || [];

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Radar size={32} color="var(--accent)" style={{ animation: "spin 2s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || (ADMIN_EMAIL && user.email !== ADMIN_EMAIL)) {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Radar size={20} color="var(--accent)" />
          <span style={{ fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em" }}>SICOES MONITOR</span>
          <span style={{ color: "var(--border)" }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)" }}>
            <Shield size={14} />
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Panel de Administración</span>
          </div>
        </div>
        <a
          href="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}
        >
          <ArrowLeft size={14} />
          Volver
        </a>
      </header>

      <main style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total clientes", value: settings.length, color: "var(--accent)" },
            { label: "Acceso activo", value: settings.filter((s) => s.enabled).length, color: "var(--success)" },
            { label: "Con notificaciones", value: settings.filter((s) => s.notifyEnabled).length, color: "var(--warning)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: "2rem", fontWeight: 700, color, marginBottom: "4px" }}>{value}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Client list */}
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem", fontWeight: 600 }}>
            <Users size={16} />
            Clientes configurados ({settings.length})
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {settings.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              No hay clientes configurados aún. Los clientes aparecerán aquí al guardar su configuración.
            </div>
          ) : (
            settings.map((s) => (
              <WorkspaceRow key={s.id as string} setting={s as Record<string, unknown>} />
            ))
          )}
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function WorkspaceRow({ setting }: { setting: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(Boolean(setting.enabled));
  const [notifyEnabled, setNotifyEnabled] = useState(Boolean(setting.notifyEnabled));
  const [companyType, setCompanyType] = useState<CompanyType>((setting.companyType as CompanyType) || "otro");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await db.transact(
        db.tx.siceosSettings[setting.id as string].update({
          enabled,
          notifyEnabled,
          companyType,
          keywords: KEYWORD_PRESETS[companyType],
          updatedAt: Date.now(),
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: enabled ? "var(--success)" : "var(--border)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontWeight: 500, marginBottom: "2px", fontSize: "0.875rem" }}>
              {(setting.userEmail as string) || (setting.userId as string)}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", display: "flex", gap: "12px" }}>
              <span>{COMPANY_TYPES.find((c) => c.value === companyType)?.label || companyType}</span>
              {notifyEnabled && (
                <span style={{ color: "var(--warning)", display: "flex", alignItems: "center", gap: "3px" }}>
                  <Bell size={10} />
                  Notificaciones ON
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {saved && <span style={{ color: "var(--success)", fontSize: "0.75rem" }}>✓ Guardado</span>}
          {expanded ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Access & notification toggles */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px",
                  border: `1px solid ${enabled ? "var(--success)" : "var(--border)"}`,
                  background: enabled ? "rgba(0,214,143,0.1)" : "transparent",
                  borderRadius: "6px",
                  color: enabled ? "var(--success)" : "var(--muted)",
                  cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem",
                }}
              >
                {enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {enabled ? "Acceso activo" : "Acceso desactivado"}
              </button>

              <button
                type="button"
                onClick={() => setNotifyEnabled(!notifyEnabled)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 16px",
                  border: `1px solid ${notifyEnabled ? "var(--warning)" : "var(--border)"}`,
                  background: notifyEnabled ? "rgba(255,181,71,0.1)" : "transparent",
                  borderRadius: "6px",
                  color: notifyEnabled ? "var(--warning)" : "var(--muted)",
                  cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem",
                }}
              >
                {notifyEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                {notifyEnabled ? "Notificaciones ON" : "Notificaciones OFF"}
              </button>
            </div>

            {/* Company type */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                TIPO DE EMPRESA
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {COMPANY_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => setCompanyType(ct.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      border: `1px solid ${companyType === ct.value ? "var(--accent)" : "var(--border)"}`,
                      background: companyType === ct.value ? "rgba(0,229,195,0.1)" : "transparent",
                      color: companyType === ct.value ? "var(--accent)" : "var(--text)",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords preview */}
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>
                PALABRAS CLAVE APLICADAS (preset)
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {KEYWORD_PRESETS[companyType].map((kw) => (
                  <span key={kw} className="chip" style={{ cursor: "default" }}>{kw}</span>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={save}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "8px", alignSelf: "flex-start" }}
            >
              <Save size={14} />
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
