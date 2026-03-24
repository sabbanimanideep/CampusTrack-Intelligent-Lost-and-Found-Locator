// src/pages/Student/profile-pages/NotificationsPage.jsx
import { useEffect, useState } from "react";
import { getNotifications } from "../../Services/Notificationsapi";
import { C, SectionLabel, Spinner } from "./Profileconstants";

// ─── Helper: extract email from JWT token in localStorage ────────────────────

const getEmailFromToken = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const notifMeta = {
  LOST:  { emoji: "🔴", bg: "rgba(249,115,22,0.1)", accent: "#f97316" },
  FOUND: { emoji: "🟢", bg: "rgba(34,197,94,0.1)",  accent: "#22c55e" },
};

const NotifRow = ({ n }) => {
  const meta = notifMeta[n.type] || { emoji: "📢", bg: C.orangeDim, accent: C.orange };
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "14px 16px", borderRadius: 12,
      background: "rgba(249,115,22,0.05)",
      border: `1px solid ${C.borderHot}`,
      transition: "all 0.2s",
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: meta.bg, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16,
      }}>{meta.emoji}</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: C.white, fontSize: 13, lineHeight: 1.5,
          margin: "0 0 4px", fontWeight: 600,
        }}>{n.title}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {n.location && (
            <span style={{ color: C.slate500, fontSize: 11 }}>📍 {n.location}</span>
          )}
          {n.date && (
            <span style={{ color: C.slate600, fontSize: 11 }}>📅 {n.date}</span>
          )}
        </div>
      </div>

      {/* Type badge */}
      <span style={{
        fontSize: 10, fontWeight: 700, padding: "2px 7px",
        borderRadius: 100, flexShrink: 0,
        background: meta.bg, color: meta.accent,
        border: `1px solid ${meta.accent}33`,
      }}>{n.type}</span>
    </div>
  );
};

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 2px" }}>
    <span style={{
      color: C.slate500, fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
    }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: C.border }} />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const email = getEmailFromToken();
        const data  = await getNotifications(email);
        setNotifs(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <SectionLabel>Alerts</SectionLabel>
          <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
            Notifications
            {notifs.length > 0 && (
              <span style={{ background: C.red, color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 100 }}>
                {notifs.length}
              </span>
            )}
          </h3>
        </div>
      </div>

      {/* Body */}
      {loading ? <Spinner /> : error ? (
        <p style={{ color: C.red, textAlign: "center", padding: "24px 0" }}>{error}</p>
      ) : notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.slate600 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔕</div>
          <p style={{ fontSize: 14 }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Divider label={`Notifications (${notifs.length})`} />
          {notifs.map((n) => (
            <NotifRow key={n.id} n={n} />
          ))}
        </div>
      )}

    </div>
  );
}