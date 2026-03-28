// ─────────────────────────────────────────────────────────────────────────────
// ContactRequestsPage.jsx  —  Incoming & Sent contact requests
// Route: /chat/requests
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Avatar, Badge, Btn, C, GLOBAL_STYLES, SEED_REQUESTS, StatusPill } from "./Chatshared";

export default function ContactRequestsPage() {
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [filter,   setFilter]   = useState("All");

  const pendingCount = requests.incoming.filter((r) => r.status === "pending").length;

  function handleAction(id, action) {
    setRequests((prev) => ({
      ...prev,
      incoming: prev.incoming.map((r) =>
        r.id === id ? { ...r, status: action === "accept" ? "accepted" : "rejected" } : r
      ),
    }));
  }

  function filterList(list) {
    if (filter === "Pending")  return list.filter((r) => r.status === "pending");
    if (filter === "Accepted") return list.filter((r) => r.status === "accepted");
    return list;
  }

  // ── Request card ────────────────────────────────────────────────────────────
  function RequestCard({ req, showActions }) {
    return (
      <div style={{
        background: C.surface2,
        border: `1px solid ${C.border2}`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        animation: "fadeIn 0.2s ease",
      }}>
        <Avatar initials={req.avatar} color={req.avatarColor} size={44} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{req.name}</span>
            <StatusPill status={req.status} />
          </div>
          <div style={{ color: C.accent, fontSize: 12, fontWeight: 600, marginTop: 3 }}>📎 {req.item}</div>
          <p style={{ color: C.subtle, fontSize: 13, marginTop: 5, lineHeight: 1.5, margin: "5px 0 0" }}>{req.msg}</p>
          <span style={{ color: C.muted, fontSize: 11 }}>{req.time}</span>
        </div>

        {showActions && req.status === "pending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <Btn onClick={() => handleAction(req.id, "accept")} variant="success" size="sm">✓ Accept</Btn>
            <Btn onClick={() => handleAction(req.id, "reject")} variant="danger"  size="sm">✗ Reject</Btn>
            <Btn variant="ghost" size="sm">👤 Profile</Btn>
          </div>
        )}
      </div>
    );
  }

  // ── Section block ────────────────────────────────────────────────────────────
  function Section({ title, list, showActions }) {
    const filtered = filterList(list);
    return (
      <div style={{ marginBottom: 36 }}>
        <h3 style={{
          color: C.text, fontWeight: 800, fontSize: 16,
          marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
        }}>
          {title}
          {showActions && pendingCount > 0 && <Badge count={pendingCount} />}
        </h3>

        {filtered.length === 0 ? (
          <div style={{
            color: C.muted, fontSize: 14,
            padding: "24px 20px",
            background: C.surface2,
            border: `1px dashed ${C.border2}`,
            borderRadius: 12,
            textAlign: "center",
          }}>
            No {filter !== "All" ? filter.toLowerCase() + " " : ""}requests here.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((r) => (
              <RequestCard key={r.id} req={r} showActions={showActions} />
            ))}
          </div>
        )}
      </div>
    );
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
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤝</span>
          <span style={{ color: C.text, fontWeight: 900, fontSize: 18 }}>Contact Requests</span>
          {pendingCount > 0 && <Badge count={pendingCount} color={C.accent} />}
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Pending", "Accepted"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px", borderRadius: 100,
                border: `1px solid ${filter === f ? C.accent : C.border2}`,
                background: filter === f ? C.accentDim : "transparent",
                color: filter === f ? C.accent : C.subtle,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: 820, margin: "0 auto" }}>
        <Section title="Incoming Requests" list={requests.incoming} showActions={true}  />
        <Section title="Sent Requests"     list={requests.sent}     showActions={false} />
      </div>
    </div>
  );
}