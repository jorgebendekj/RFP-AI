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
  ChevronDown,
  ChevronUp,
  UserX,
  Settings,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { COMPANY_TYPES, KEYWORD_PRESETS, type CompanyType } from "@/lib/companyKeywords";

interface NotifyResult {
  ok: boolean;
  fromAddress?: string;
  usingDefaultSender?: boolean;
  senderWarning?: string;
  total?: number;
  notified?: number;
  cacheSize?: number;
  message?: string;
  error?: string;
  results?: Array<{ email: string; status: "sent" | "error"; tenders?: number; error?: string }>;
}

export default function AdminPage() {
  const { isLoading, user } = db.useAuth();
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  const [sending, setSending] = useState(false);
  const [notifyResult, setNotifyResult] = useState<NotifyResult | null>(null);

  // Load all profiles and settings
  const { data } = db.useQuery(
    user ? { profiles: {}, siceosSettings: {} } : null
  );

  const allProfiles = (data?.profiles || []) as Record<string, unknown>[];
  const allSettings = (data?.siceosSettings || []) as Record<string, unknown>[];

  const clients = allProfiles.filter((p) => p.role !== "admin");

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

  async function sendNotifications() {
    setSending(true);
    setNotifyResult(null);
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail: user!.email }),
      });
      const data = await res.json() as NotifyResult;
      setNotifyResult(data);
    } catch (e) {
      setNotifyResult({ ok: false, error: e instanceof Error ? e.message : "Error de red" });
    } finally {
      setSending(false);
    }
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

        {/* Notification trigger */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>Notificaciones por email</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>
              Enviá ahora el resumen diario de SICOES a todos los usuarios con notificaciones activas
            </div>
          </div>
          <button
            onClick={sendNotifications}
            disabled={sending}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: sending ? "transparent" : "rgba(0,229,195,0.1)", border: "1px solid var(--accent)", borderRadius: "6px", color: "var(--accent)", cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "0.875rem", fontWeight: 600, opacity: sending ? 0.6 : 1 }}
          >
            {sending ? <><Radar size={14} style={{ animation: "spin 1s linear infinite" }} /> Enviando...</> : <><Send size={14} /> Enviar notificaciones ahora</>}
          </button>
        </div>

        {/* Notify result */}
        {notifyResult && (
          <div className="card" style={{ padding: "20px 24px", marginBottom: "24px", border: `1px solid ${notifyResult.ok ? "rgba(0,214,143,0.3)" : "rgba(255,77,109,0.3)"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              {notifyResult.ok ? <CheckCircle size={16} color="var(--success)" /> : <XCircle size={16} color="var(--danger)" />}
              <span style={{ fontWeight: 600, color: notifyResult.ok ? "var(--success)" : "var(--danger)", fontSize: "0.875rem" }}>
                {notifyResult.ok ? `${notifyResult.notified} de ${notifyResult.total} emails enviados · ${notifyResult.cacheSize} licitaciones en caché` : (notifyResult.message || notifyResult.error || "Error al enviar")}
              </span>
            </div>

            {notifyResult.fromAddress && (
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: notifyResult.senderWarning ? "8px" : "0" }}>
                Enviado desde: <span style={{ color: "var(--text)", fontFamily: "monospace" }}>{notifyResult.fromAddress}</span>
              </div>
            )}

            {notifyResult.senderWarning && (
              <div style={{ display: "flex", gap: "8px", padding: "10px 14px", background: "rgba(255,181,71,0.08)", border: "1px solid rgba(255,181,71,0.3)", borderRadius: "6px", marginBottom: "12px" }}>
                <AlertTriangle size={14} color="var(--warning)" style={{ flexShrink: 0, marginTop: "1px" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--warning)", lineHeight: "1.5" }}>{notifyResult.senderWarning}</span>
              </div>
            )}

            {notifyResult.results && notifyResult.results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {notifyResult.results.map((r) => (
                  <div key={r.email} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8125rem" }}>
                    {r.status === "sent"
                      ? <CheckCircle size={12} color="var(--success)" />
                      : <XCircle size={12} color="var(--danger)" />}
                    <span style={{ color: "var(--text)" }}>{r.email}</span>
                    {r.status === "sent"
                      ? <span style={{ color: "var(--muted)" }}>{r.tenders} licitaciones</span>
                      : <span style={{ color: "var(--danger)" }}>{r.error}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total usuarios", value: clients.length, color: "var(--accent)", icon: <Users size={18} /> },
            { label: "Con notifs", value: allSettings.filter((s) => s.notifyEnabled).length, color: "var(--warning)", icon: <Bell size={18} /> },
            { label: "Configurados", value: allSettings.length, color: "var(--success)", icon: <Settings size={18} /> },
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

        {/* CLIENTS */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={16} color="var(--accent)" />
              Usuarios registrados ({clients.length})
            </h2>
          </div>

          {clients.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              Aún no hay usuarios registrados.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {clients.map((p) => {
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
