"use client";

import { useState } from "react";
import { db } from "@/lib/instant";
import {
  Radar,
  Shield,
  ArrowLeft,
  Users,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  UserCheck,
  UserX,
  Settings,
} from "lucide-react";
import { COMPANY_TYPES, KEYWORD_PRESETS, type CompanyType } from "@/lib/companyKeywords";

export default function AdminPage() {
  const { isLoading, user } = db.useAuth();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  // Load all profiles and settings
  const { data } = db.useQuery(
    user ? { profiles: {}, siceosSettings: {} } : null
  );

  const allProfiles = (data?.profiles || []) as Record<string, unknown>[];
  const allSettings = (data?.siceosSettings || []) as Record<string, unknown>[];

  const pending = allProfiles.filter((p) => !p.enabled && p.role !== "admin");
  const approved = allProfiles.filter((p) => p.enabled && p.role !== "admin");

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

  async function approveUser(profileId: string) {
    await db.transact(db.tx.profiles[profileId].update({ enabled: true }));
  }

  async function revokeUser(profileId: string) {
    await db.transact(db.tx.profiles[profileId].update({ enabled: false }));
  }

  function getSettingsForUser(userId: unknown) {
    return allSettings.find((s) => s.userId === userId);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "var(--card)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Radar size={20} color="var(--accent)" />
          <span style={{ fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em" }}>SICOES MONITOR</span>
          <span style={{ color: "var(--border)" }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)" }}>
            <Shield size={14} />
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Panel de Administración</span>
          </div>
        </div>
        <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", textDecoration: "none", fontSize: "0.875rem" }}>
          <ArrowLeft size={14} /> Volver al dashboard
        </a>
      </header>

      <main style={{ padding: "32px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Pendientes", value: pending.length, color: "var(--warning)", icon: <Clock size={18} /> },
            { label: "Aprobados", value: approved.length, color: "var(--success)", icon: <UserCheck size={18} /> },
            { label: "Total usuarios", value: allProfiles.filter(p => p.role !== "admin").length, color: "var(--accent)", icon: <Users size={18} /> },
            { label: "Con notifs", value: allSettings.filter((s) => s.notifyEnabled).length, color: "var(--accent2)", icon: <Bell size={18} /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color, marginBottom: "8px" }}>
                {icon}
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>{label.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* PENDING APPROVALS */}
        {pending.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--warning)", animation: "pulse 2s infinite" }} />
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--warning)" }}>
                Pendientes de aprobación ({pending.length})
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {pending.map((p) => (
                <div key={p.id as string} className="card" style={{ padding: "16px 20px", border: "1px solid rgba(255,181,71,0.3)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,181,71,0.1)", border: "1px solid rgba(255,181,71,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "var(--warning)", fontSize: "0.875rem", fontWeight: 700 }}>
                        {(p.email as string)?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: "2px" }}>{p.email as string}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                        Se registró {new Date(p.createdAt as number).toLocaleString("es-BO")}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => approveUser(p.id as string)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "rgba(0,214,143,0.1)", border: "1px solid var(--success)", borderRadius: "6px", color: "var(--success)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 600 }}
                    >
                      <CheckCircle size={14} /> Aprobar acceso
                    </button>
                    <button
                      onClick={() => revokeUser(p.id as string)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--muted)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem" }}
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div className="card" style={{ padding: "20px 24px", marginBottom: "32px", border: "1px solid rgba(0,214,143,0.2)", display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircle size={18} color="var(--success)" />
            <span style={{ color: "var(--success)", fontSize: "0.875rem" }}>No hay solicitudes de acceso pendientes</span>
          </div>
        )}

        {/* APPROVED CLIENTS */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <UserCheck size={16} color="var(--success)" />
              Clientes aprobados ({approved.length})
            </h2>
          </div>

          {approved.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              Aún no hay clientes aprobados. Aprobá las solicitudes de arriba.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {approved.map((p) => {
                const userSettings = getSettingsForUser(p.email) || getSettingsForUser(p.id);
                return (
                  <ClientRow
                    key={p.id as string}
                    profile={p}
                    settings={userSettings}
                    onRevoke={() => revokeUser(p.id as string)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}

function ClientRow({
  profile,
  settings,
  onRevoke,
}: {
  profile: Record<string, unknown>;
  settings?: Record<string, unknown>;
  onRevoke: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [companyType, setCompanyType] = useState<CompanyType>((settings?.companyType as CompanyType) || "otro");
  const [notifyEnabled, setNotifyEnabled] = useState(Boolean(settings?.notifyEnabled));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveConfig() {
    if (!settings?.id) return;
    setSaving(true);
    try {
      await db.transact(
        db.tx.siceosSettings[settings.id as string].update({
          companyType,
          keywords: KEYWORD_PRESETS[companyType],
          notifyEnabled,
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
        style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Avatar */}
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(0,229,195,0.1)", border: "1px solid rgba(0,229,195,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "var(--accent)", fontSize: "0.8125rem", fontWeight: 700 }}>
              {(profile.email as string)?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "0.875rem", marginBottom: "2px" }}>{profile.email as string}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", display: "flex", gap: "10px", alignItems: "center" }}>
              {settings ? (
                <>
                  <span style={{ color: "var(--accent)" }}>
                    {COMPANY_TYPES.find((c) => c.value === companyType)?.label || companyType}
                  </span>
                  {notifyEnabled && (
                    <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "var(--warning)" }}>
                      <Bell size={10} /> Notificaciones ON
                    </span>
                  )}
                  <span>· {((settings.keywords as string[]) || []).length} palabras clave</span>
                </>
              ) : (
                <span style={{ color: "var(--muted)" }}>Sin configurar aún</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {saved && <span style={{ color: "var(--success)", fontSize: "0.75rem" }}>✓ Guardado</span>}
          {expanded ? <ChevronUp size={16} color="var(--muted)" /> : <ChevronDown size={16} color="var(--muted)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {settings ? (
              <>
                {/* Company type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "10px", letterSpacing: "0.05em" }}>
                    <Settings size={11} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    TIPO DE EMPRESA
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {COMPANY_TYPES.map((ct) => (
                      <button key={ct.value} type="button" onClick={() => setCompanyType(ct.value)}
                        style={{ padding: "6px 14px", borderRadius: "6px", border: `1px solid ${companyType === ct.value ? "var(--accent)" : "var(--border)"}`, background: companyType === ct.value ? "rgba(0,229,195,0.1)" : "transparent", color: companyType === ct.value ? "var(--accent)" : "var(--text)", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "inherit" }}>
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Keywords preview */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>PALABRAS CLAVE QUE SE APLICARÁN</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {KEYWORD_PRESETS[companyType].map((kw) => (
                      <span key={kw} className="chip" style={{ cursor: "default" }}>{kw}</span>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--bg2)", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "0.875rem", marginBottom: "2px" }}>Notificaciones diarias (8am Bolivia)</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Email con resumen de licitaciones del día</div>
                  </div>
                  <button type="button" onClick={() => setNotifyEnabled(!notifyEnabled)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", border: `1px solid ${notifyEnabled ? "var(--warning)" : "var(--border)"}`, background: notifyEnabled ? "rgba(255,181,71,0.1)" : "transparent", borderRadius: "6px", color: notifyEnabled ? "var(--warning)" : "var(--muted)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.8125rem" }}>
                    {notifyEnabled ? <Bell size={13} /> : <BellOff size={13} />}
                    {notifyEnabled ? "Activadas" : "Desactivadas"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="btn-primary" onClick={saveConfig} disabled={saving} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button onClick={onRevoke}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: "6px", color: "var(--danger)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem" }}>
                    <UserX size={14} /> Revocar acceso
                  </button>
                </div>
              </>
            ) : (
              <div style={{ color: "var(--muted)", fontSize: "0.875rem", padding: "8px 0" }}>
                Este cliente aún no ha configurado su perfil. Podrás editar su configuración una vez que lo haga.
                <div style={{ marginTop: "16px" }}>
                  <button onClick={onRevoke}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: "6px", color: "var(--danger)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem" }}>
                    <UserX size={14} /> Revocar acceso
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
