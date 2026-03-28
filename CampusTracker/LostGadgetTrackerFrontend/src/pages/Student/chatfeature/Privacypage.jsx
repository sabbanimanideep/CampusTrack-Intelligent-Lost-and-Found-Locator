// ─────────────────────────────────────────────────────────────────────────────
// PrivacyPage.jsx  —  Privacy & Controls settings
// Route: /chat/privacy
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Btn, C, GLOBAL_STYLES, SEED_BLOCKED, Toggle } from "./Chatshared";

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background: C.surface2,
      border: `1px solid ${C.border2}`,
      borderRadius: 16,
      padding: "22px 24px",
      marginBottom: 20,
    }}>
      <h3 style={{
        color: C.text, fontWeight: 800, fontSize: 15,
        marginBottom: 18, display: "flex", alignItems: "center", gap: 8,
        margin: "0 0 18px",
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  const [prefs, setPrefs] = useState({
    showEmail:       false,
    showPhone:       false,
    allowStrangers:  true,
    autoAccept:      false,
    notifications:   true,
  });
  const [blocked,      setBlocked]      = useState(SEED_BLOCKED);
  const [reportType,   setReportType]   = useState("user");
  const [reportReason, setReportReason] = useState("");
  const [submitted,    setSubmitted]    = useState(false);

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  function submitReport() {
    if (!reportReason) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setReportReason("");
  }

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        color: C.text,
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      {/* ── Page header ── */}
      <div style={{
        padding: "18px 32px 14px",
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <span style={{ color: C.text, fontWeight: 900, fontSize: 18 }}>Privacy & Controls</span>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: 680, margin: "0 auto", animation: "fadeIn 0.2s ease" }}>

        {/* A – Personal Information */}
        <SectionCard title="Personal Information Control" icon="👤">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Toggle on={prefs.showEmail} onChange={() => toggle("showEmail")} label="Show Email Address" />
            <Toggle on={prefs.showPhone} onChange={() => toggle("showPhone")} label="Show Phone Number" />
          </div>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 14, lineHeight: 1.6, margin: "14px 0 0" }}>
            ℹ️ Your personal details remain hidden unless you explicitly share them.
          </p>
        </SectionCard>

        {/* B – Blocked Users */}
        <SectionCard title="Blocked Users" icon="🚫">
          {blocked.length === 0 ? (
            <div style={{
              color: C.muted, fontSize: 13, padding: "16px 0",
              textAlign: "center",
            }}>
              No blocked users. You're all clear! 🎉
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {blocked.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.18)",
                    borderRadius: 10, padding: "10px 14px",
                  }}
                >
                  <div>
                    <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Blocked on {u.blockedDate}</div>
                  </div>
                  <Btn
                    onClick={() => setBlocked((b) => b.filter((x) => x.id !== u.id))}
                    variant="ghost" size="sm"
                  >
                    Unblock
                  </Btn>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* C – Report & Safety */}
        <SectionCard title="Report & Safety" icon="⚠️">
          {/* Report type toggle */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["user", "message"].map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                style={{
                  padding: "7px 16px", borderRadius: 8,
                  border: `1px solid ${reportType === t ? C.accent : C.border2}`,
                  background: reportType === t ? C.accentDim : "transparent",
                  color: reportType === t ? C.accent : C.subtle,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t === "user" ? "🙍 Report User" : "💬 Report Message"}
              </button>
            ))}
          </div>

          {/* Reason dropdown */}
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px",
              background: C.surface,
              border: `1px solid ${C.border2}`,
              borderRadius: 8,
              color: reportReason ? C.text : C.muted,
              fontSize: 13, marginBottom: 14, outline: "none",
            }}
          >
            <option value="">Select a reason…</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
            <option value="fake">Fake Listing</option>
          </select>

          {submitted ? (
            <div style={{
              color: C.green, fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              ✅ Report submitted. We'll review it shortly.
            </div>
          ) : (
            <Btn onClick={submitReport} variant="danger">Submit Report</Btn>
          )}
        </SectionCard>

        {/* D – Messaging Preferences */}
        <SectionCard title="Messaging Preferences" icon="⚙️">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Toggle on={prefs.allowStrangers} onChange={() => toggle("allowStrangers")} label="Allow messages from strangers" />
            <Toggle on={prefs.autoAccept}     onChange={() => toggle("autoAccept")}     label="Auto-accept contact requests" />
            <Toggle on={prefs.notifications}  onChange={() => toggle("notifications")}  label="Enable notifications" />
          </div>
        </SectionCard>

      </div>
    </div>
  );
}