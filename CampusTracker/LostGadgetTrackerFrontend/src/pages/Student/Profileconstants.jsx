// src/pages/Student/profile-pages/profileConstants.js
// Shared design tokens & reusable components across all profile sub-pages

// ── Design tokens ─────────────────────────────────────────────────────────────
export const C = {
  bg:        "#050b1a",
  bgCard:    "rgba(15,23,42,0.8)",
  border:    "rgba(249,115,22,0.15)",
  borderHot: "rgba(249,115,22,0.4)",
  orange:    "#f97316",
  orangeDim: "rgba(249,115,22,0.12)",
  green:     "#22c55e",
  blue:      "#3b82f6",
  white:     "#ffffff",
  slate400:  "#94a3b8",
  slate500:  "#64748b",
  slate600:  "#475569",
  red:       "#ef4444",
  redDim:    "rgba(239,68,68,0.12)",
};

// ── Status config ─────────────────────────────────────────────────────────────
export const statusCfg = {
  PENDING:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  MATCHED:  { label: "Matched",  color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  RESOLVED: { label: "Resolved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  APPROVED: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  REJECTED: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
  ACTIVE:   { label: "Active",   color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  INACTIVE: { label: "Inactive", color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)" },
};

// ── Shared UI components ───────────────────────────────────────────────────────
export const Badge = ({ status }) => {
  const cfg = statusCfg[status] || { label: status, color: C.slate400, bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: 100,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
};

export const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      border: `3px solid ${C.border}`,
      borderTopColor: C.orange,
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const SectionLabel = ({ children }) => (
  <span style={{ color: C.orange, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
    {children}
  </span>
);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });