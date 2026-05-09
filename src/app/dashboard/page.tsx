"use client";

import { useState, useCallback, useEffect } from "react";
import { db } from "@/lib/instant";
import { id } from "@instantdb/react";
import {
  Radar,
  Settings,
  LogOut,
  Play,
  Clock,
  ChevronRight,
  ExternalLink,
  Bell,
  BellOff,
  Shield,
  X,
  Plus,
  Hourglass,
} from "lucide-react";
import {
  COMPANY_TYPES,
  KEYWORD_PRESETS,
  type CompanyType,
} from "@/lib/companyKeywords";

interface Tender {
  id: string;
  codigo: string;
  descripcion: string;
  entidad: string;
  monto?: string;
  fecha?: string;
  departamento?: string;
  tipo?: string;
  relevancia: number;
  justificacion: string;
  url?: string;
}

interface ScanResult {
  tenders: Tender[];
  summary: string;
  scannedAt: string;
}

export default function DashboardPage() {
  const { isLoading, user } = db.useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

  // Load profile (access approval)
  const { data: profileData } = db.useQuery(
    user ? { profiles: { $: { where: { email: user.email! } } } } : null
  );

  const profile = profileData?.profiles?.[0];

  // Load SICOES settings
  const { data: settingsData } = db.useQuery(
    user ? { siceosSettings: { $: { where: { userId: user.id } } } } : null
  );
  const settings = settingsData?.siceosSettings?.[0];

  // Auto-create profile on first login (enabled: false = pending approval)
  useEffect(() => {
    if (user && profileData !== undefined && !profile) {
      const isAdmin = user.email === ADMIN_EMAIL;
      db.transact(
        db.tx.profiles[id()].update({
          email: user.email!,
          name: user.email!.split("@")[0],
          role: isAdmin ? "admin" : "client",
          enabled: isAdmin, // admin auto-approved
          createdAt: Date.now(),
        })
      );
    }
  }, [user, profile, profileData, ADMIN_EMAIL]);

  const [formCompanyType, setFormCompanyType] = useState<CompanyType>("tecnologia");
  const [formKeywords, setFormKeywords] = useState<string[]>([]);
  const [formDept, setFormDept] = useState("");
  const [formNotify, setFormNotify] = useState(true);
  const [newKeyword, setNewKeyword] = useState("");

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString("es-BO", { hour12: false });
    setLogs((prev) => [...prev, `[${time}] ${msg}`]);
  }, []);

  async function saveSettings() {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        userId: user.id,
        userEmail: user.email!,
        enabled: true,
        notifyEnabled: formNotify,
        companyType: formCompanyType,
        keywords: formKeywords,
        department: formDept,
        updatedAt: Date.now(),
      };
      if (settings?.id) {
        await db.transact(db.tx.siceosSettings[settings.id as string].update(payload));
      } else {
        await db.transact(db.tx.siceosSettings[id()].update(payload));
      }
      setShowSettings(false);
    } finally {
      setIsSaving(false);
    }
  }

  function openSettings() {
    if (settings) {
      setFormCompanyType((settings.companyType as CompanyType) || "tecnologia");
      setFormKeywords((settings.keywords as string[]) || []);
      setFormDept((settings.department as string) || "");
      setFormNotify((settings.notifyEnabled as boolean) ?? true);
    }
    setShowSettings(true);
  }

  function applyPreset(type: CompanyType) {
    setFormCompanyType(type);
    setFormKeywords(KEYWORD_PRESETS[type]);
  }

  function toggleKeyword(kw: string) {
    setFormKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    );
  }

  function addCustomKeyword() {
    const kw = newKeyword.trim();
    if (kw && !formKeywords.includes(kw)) setFormKeywords((prev) => [...prev, kw]);
    setNewKeyword("");
  }

  async function runScan() {
    if (!user || !settings) { openSettings(); return; }
    setScanning(true);
    setLogs([]);
    setResult(null);
    addLog("Iniciando escaneo de SICOES...");
    addLog(`Perfil: ${settings.companyType} · ${(settings.keywords as string[])?.length || 0} palabras clave`);
    try {
      addLog("Conectando con motor de IA (Claude)...");
      const resp = await fetch("/api/sicoes/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          companyType: settings.companyType,
          keywords: settings.keywords,
          department: settings.department,
        }),
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({})) as {
          error?: string;
          debug?: {
            scrapingbeeKeyDetected?: boolean;
            scrapingbeeKeyPrefix?: string | null;
            elapsedMs?: number;
            keywordsTried?: string[];
            hint?: string;
          };
        };
        if (errData.debug) {
          addLog(`◆ Diagnóstico:`);
          addLog(`  · ScrapingBee key detectada: ${errData.debug.scrapingbeeKeyDetected ? "SÍ" : "NO"}${errData.debug.scrapingbeeKeyPrefix ? ` (empieza con "${errData.debug.scrapingbeeKeyPrefix}")` : ""}`);
          addLog(`  · Tiempo total: ${errData.debug.elapsedMs}ms`);
          addLog(`  · Palabras probadas: ${errData.debug.keywordsTried?.join(", ")}`);
          if (errData.debug.hint) addLog(`  · ${errData.debug.hint}`);
        }
        throw new Error(errData.error || `Error ${resp.status}`);
      }
      const data = await resp.json() as ScanResult;
      addLog(`✓ Escaneo completado · ${data.tenders?.length || 0} licitaciones encontradas`);
      setResult(data);
    } catch (e: unknown) {
      addLog(`✗ Error: ${e instanceof Error ? e.message : "Error desconocido"}`);
    } finally {
      setScanning(false);
    }
  }

  function signOut() { db.auth.signOut(); window.location.href = "/login"; }

  // Loading state
  if (isLoading || (user && profileData === undefined)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <Radar size={32} color="var(--accent)" style={{ animation: "spin 2s linear infinite" }} />
        <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Verificando acceso...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }

  const isAdmin = ADMIN_EMAIL && user.email === ADMIN_EMAIL;

  // PENDING APPROVAL SCREEN
  if (!isAdmin && profile && !profile.enabled) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "420px", width: "100%", textAlign: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(255,181,71,0.1)", border: "1px solid var(--warning)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
          }}>
            <Hourglass size={28} color="var(--warning)" />
          </div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "12px" }}>
            Acceso pendiente de aprobación
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "32px" }}>
            Tu cuenta <span style={{ color: "var(--accent)" }}>{user.email}</span> fue registrada
            correctamente. El administrador recibirá una notificación y habilitará tu acceso pronto.
          </p>
          <div className="card" style={{ padding: "16px 20px", marginBottom: "24px", textAlign: "left" }}>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.05em", marginBottom: "8px" }}>
              QUÉ PASA AHORA
            </div>
            {[
              "✓ Tu cuenta fue creada en el sistema",
              "⏳ El administrador aprobará tu acceso",
              "📧 Recibirás un correo cuando esté listo",
            ].map((s) => (
              <div key={s} style={{ fontSize: "0.8125rem", color: "var(--text)", padding: "4px 0" }}>{s}</div>
            ))}
          </div>
          <button className="btn-ghost" onClick={signOut} style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 auto" }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "var(--card)", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: "60px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Radar size={20} color="var(--accent)" />
          <span style={{ fontWeight: 600, color: "var(--accent)", letterSpacing: "0.08em", fontSize: "0.9375rem" }}>
            SICOES MONITOR
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isAdmin && (
            <a href="/admin" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--warning)", fontSize: "0.8125rem", textDecoration: "none" }}>
              <Shield size={14} /> Admin
            </a>
          )}
          <span style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>{user.email}</span>
          <button className="btn-ghost" onClick={openSettings} style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Settings size={14} /> Configurar
          </button>
          <button className="btn-ghost" onClick={signOut} style={{ padding: "6px 12px" }}>
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Profile bar */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.08em", marginBottom: "6px" }}>PERFIL ACTIVO</div>
            {settings ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ padding: "4px 12px", borderRadius: "4px", background: "rgba(0,229,195,0.1)", border: "1px solid rgba(0,229,195,0.3)", color: "var(--accent)", fontSize: "0.8125rem", fontWeight: 600 }}>
                  {COMPANY_TYPES.find((c) => c.value === settings.companyType)?.label}
                </span>
                {settings.department && <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>· {settings.department as string}</span>}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {((settings.keywords as string[]) || []).slice(0, 5).map((kw) => (
                    <span key={kw} className="chip" style={{ cursor: "default" }}>{kw}</span>
                  ))}
                  {((settings.keywords as string[]) || []).length > 5 && (
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem", alignSelf: "center" }}>
                      +{((settings.keywords as string[]) || []).length - 5} más
                    </span>
                  )}
                </div>
                {settings.notifyEnabled && (
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--success)", fontSize: "0.75rem" }}>
                    <Bell size={12} /> Notificaciones 8am
                  </span>
                )}
              </div>
            ) : (
              <span style={{ color: "var(--warning)", fontSize: "0.875rem" }}>
                Sin configurar · Click en &quot;Configurar&quot; para empezar
              </span>
            )}
          </div>
          <button className="btn-primary" onClick={runScan} disabled={scanning} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}>
            {scanning ? <><Radar size={16} style={{ animation: "spin 1s linear infinite" }} /> Escaneando...</> : <><Play size={16} /> Escanear SICOES</>}
          </button>
        </div>

        {/* Terminal */}
        {logs.length > 0 && (
          <div className="terminal" style={{ marginBottom: "24px" }}>
            {logs.map((log, i) => (
              <div key={i} className="log-line">
                <span className={log.includes("✓") ? "log-ok" : log.includes("✗") ? "log-err" : ""}>{log}</span>
              </div>
            ))}
            {scanning && <div className="log-line"><span style={{ color: "var(--accent)" }}>▋<span className="cursor-blink">█</span></span></div>}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {result.summary && (
              <div className="card" style={{ padding: "16px 20px", marginBottom: "20px", borderLeft: "3px solid var(--accent)", fontSize: "0.875rem", lineHeight: "1.6" }}>
                <div style={{ color: "var(--accent)", fontSize: "0.75rem", marginBottom: "8px", letterSpacing: "0.05em" }}>RESUMEN DE IA</div>
                {result.summary}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1rem" }}>{result.tenders.length} licitaciones encontradas</h2>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={12} /> {new Date(result.scannedAt).toLocaleString("es-BO")}
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr><th>Código</th><th>Descripción</th><th>Entidad</th><th>Monto</th><th>Relevancia</th><th></th></tr>
                </thead>
                <tbody>
                  {result.tenders.map((t) => (
                    <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => setSelectedTender(t)}>
                      <td style={{ color: "var(--accent)", fontWeight: 500, whiteSpace: "nowrap" }}>{t.codigo}</td>
                      <td style={{ maxWidth: "300px" }}>
                        <div style={{ fontWeight: 500 }}>{t.descripcion.length > 80 ? t.descripcion.slice(0, 80) + "…" : t.descripcion}</div>
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>{t.entidad}</td>
                      <td style={{ color: "var(--success)", fontWeight: 600, whiteSpace: "nowrap" }}>{t.monto || "—"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "60px", height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{ width: `${t.relevancia}%`, height: "100%", background: t.relevancia >= 70 ? "var(--success)" : t.relevancia >= 40 ? "var(--warning)" : "var(--muted)" }} />
                          </div>
                          <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{t.relevancia}%</span>
                        </div>
                      </td>
                      <td><ChevronRight size={14} color="var(--muted)" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!scanning && !result && logs.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted)" }}>
            <Radar size={48} color="var(--border)" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "1rem", marginBottom: "8px" }}>Listo para escanear licitaciones</p>
            <p style={{ fontSize: "0.875rem" }}>{settings ? 'Presioná "Escanear SICOES" para iniciar' : "Configurá tu perfil primero"}</p>
          </div>
        )}
      </main>

      {/* Settings modal */}
      {showSettings && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Configuración de perfil</h2>
              <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "12px", letterSpacing: "0.05em" }}>TIPO DE EMPRESA</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {COMPANY_TYPES.map((ct) => (
                  <button key={ct.value} type="button" onClick={() => applyPreset(ct.value)}
                    style={{ padding: "8px 16px", borderRadius: "6px", border: `1px solid ${formCompanyType === ct.value ? "var(--accent)" : "var(--border)"}`, background: formCompanyType === ct.value ? "rgba(0,229,195,0.1)" : "transparent", color: formCompanyType === ct.value ? "var(--accent)" : "var(--text)", fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>PALABRAS CLAVE ({formKeywords.length})</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                {KEYWORD_PRESETS[formCompanyType].map((kw) => (
                  <button key={kw} type="button" className={`chip ${formKeywords.includes(kw) ? "active" : ""}`} onClick={() => toggleKeyword(kw)}>
                    {formKeywords.includes(kw) ? "✓" : "+"} {kw}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input className="input" placeholder="Agregar palabra clave personalizada..." value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomKeyword())} />
                <button className="btn-ghost" onClick={addCustomKeyword} style={{ padding: "10px 14px", flexShrink: 0 }}><Plus size={16} /></button>
              </div>
              {formKeywords.filter((kw) => !KEYWORD_PRESETS[formCompanyType].includes(kw)).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                  {formKeywords.filter((kw) => !KEYWORD_PRESETS[formCompanyType].includes(kw)).map((kw) => (
                    <button key={kw} type="button" className="chip active" onClick={() => toggleKeyword(kw)}>✕ {kw}</button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "8px", letterSpacing: "0.05em" }}>DEPARTAMENTO (opcional)</label>
              <select className="input" value={formDept} onChange={(e) => setFormDept(e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">Todos los departamentos</option>
                {["La Paz","Santa Cruz","Cochabamba","Oruro","Potosí","Tarija","Beni","Pando","Chuquisaca"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: "var(--bg2)", borderRadius: "8px", marginBottom: "24px" }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: "4px" }}>Notificaciones diarias</div>
                <div style={{ color: "var(--muted)", fontSize: "0.8125rem" }}>Recibir resumen a las 8:00 AM (Bolivia)</div>
              </div>
              <button type="button" onClick={() => setFormNotify(!formNotify)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: `1px solid ${formNotify ? "var(--success)" : "var(--border)"}`, background: formNotify ? "rgba(0,214,143,0.1)" : "transparent", borderRadius: "6px", color: formNotify ? "var(--success)" : "var(--muted)", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem" }}>
                {formNotify ? <Bell size={14} /> : <BellOff size={14} />}
                {formNotify ? "Activadas" : "Desactivadas"}
              </button>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" onClick={saveSettings} disabled={isSaving} style={{ flex: 1 }}>{isSaving ? "Guardando..." : "Guardar configuración"}</button>
              <button className="btn-ghost" onClick={() => setShowSettings(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Tender detail modal */}
      {selectedTender && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={(e) => e.target === e.currentTarget && setSelectedTender(null)}>
          <div className="card" style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto", padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div style={{ color: "var(--accent)", fontWeight: 600, marginBottom: "4px" }}>{selectedTender.codigo}</div>
                <h2 style={{ fontSize: "1rem", fontWeight: 600, lineHeight: "1.4" }}>{selectedTender.descripcion}</h2>
              </div>
              <button onClick={() => setSelectedTender(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", flexShrink: 0, marginLeft: "16px" }}><X size={20} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              {[{ label: "ENTIDAD", value: selectedTender.entidad }, { label: "MONTO", value: selectedTender.monto || "No especificado" }, { label: "FECHA", value: selectedTender.fecha || "—" }, { label: "DEPARTAMENTO", value: selectedTender.departamento || "—" }].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--bg2)", padding: "12px 14px", borderRadius: "6px" }}>
                  <div style={{ color: "var(--muted)", fontSize: "0.7rem", letterSpacing: "0.08em", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.08em", marginBottom: "8px" }}>ANÁLISIS DE RELEVANCIA · {selectedTender.relevancia}%</div>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{ width: `${selectedTender.relevancia}%`, height: "100%", background: selectedTender.relevancia >= 70 ? "var(--success)" : selectedTender.relevancia >= 40 ? "var(--warning)" : "var(--muted)" }} />
              </div>
              <p style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>{selectedTender.justificacion}</p>
            </div>
            {selectedTender.url && (
              <a href={selectedTender.url} target="_blank" rel="noopener noreferrer" className="btn-primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}>
                <ExternalLink size={14} /> Ver en SICOES
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
