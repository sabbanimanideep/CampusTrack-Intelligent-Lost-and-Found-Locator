// src/pages/Student/profile-pages/MyReportsPage.jsx
import { useEffect, useState } from "react";
import { deleteItem, getFoundItems, getLostItems } from "../../Services/itemApi";
import { C, SectionLabel, Spinner } from "./Profileconstants";

// ── JWT decoder ────────────────────────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const getEmailFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not logged in. Please log in again.");
  const decoded = decodeToken(token);
  const email   = decoded?.email || decoded?.sub || "";
  if (!email) throw new Error("Could not read email from token.");
  return email;
};

// ── Format date ────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// ── Category emoji map ─────────────────────────────────────────────────────────
const categoryIcon = (cat = "") => {
  const map = {
    electronics: "💻", phone: "📱", wallet: "👛", keys: "🔑",
    bag: "🎒", book: "📚", id: "🪪", watch: "⌚", jewelry: "💍",
    clothing: "👕", laptop: "💻", airpods: "🎧", other: "📦",
  };
  return map[cat.toLowerCase()] || "📦";
};

// ── Single Report Card ─────────────────────────────────────────────────────────
function ReportCard({ item, type, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const isLost = type === "lost";

  const accentColor  = isLost ? "#f97316" : "#22c55e";
  const accentDim    = isLost ? "rgba(249,115,22,0.12)" : "rgba(34,197,94,0.12)";
  const accentBorder = isLost ? "rgba(249,115,22,0.25)" : "rgba(34,197,94,0.25)";

  return (
    <div style={{
      background: "rgba(5,11,26,0.7)",
      border: `1px solid ${accentBorder}`,
      borderRadius: 16, overflow: "hidden",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${accentDim}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Header */}
      <div style={{
        background: accentDim, borderBottom: `1px solid ${accentBorder}`,
        padding: "12px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontSize: 24, background: "rgba(0,0,0,0.2)",
            borderRadius: 10, padding: "6px 10px", lineHeight: 1,
          }}>{categoryIcon(item.category)}</span>
          <div>
            <p style={{ margin: 0, color: "#f8fafc", fontWeight: 800, fontSize: 15 }}>{item.name || "—"}</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              {item.category || "Uncategorized"}
            </p>
          </div>
        </div>
        <span style={{
          padding: "3px 12px", borderRadius: 100, fontSize: 11, fontWeight: 800,
          background: accentDim, color: accentColor, border: `1px solid ${accentBorder}`,
          whiteSpace: "nowrap",
        }}>
          {isLost ? "😟 Lost" : "🤝 Found"}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px" }}>

        {/* Base64 image if present */}
        {item.image && (
          <img
            src={`data:${item.imageType || "image/jpeg"};base64,${item.image}`}
            alt={item.name}
            style={{
              width: "100%", maxHeight: 180, objectFit: "cover",
              borderRadius: 10, border: "1px solid rgba(249,115,22,0.15)", marginBottom: 12,
            }}
          />
        )}

        {/* Description */}
        {item.description && (
          <>
            <p style={{
              color: "#94a3b8", fontSize: 13, margin: "0 0 4px", lineHeight: 1.6,
              display: "-webkit-box", WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {item.description}
            </p>
            {item.description.length > 80 && (
              <button onClick={() => setExpanded((p) => !p)} style={{
                background: "none", border: "none", color: accentColor,
                fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "0 0 10px",
              }}>
                {expanded ? "▲ Show less" : "▼ Show more"}
              </button>
            )}
          </>
        )}

        {/* Details grid — all DB fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { icon: "📍", label: isLost ? "Last Seen"  : "Found At",   value: item.location         },
            { icon: "📅", label: isLost ? "Date Lost"  : "Date Found", value: formatDate(item.date)  },
            { icon: "📱", label: "Contact",                             value: item.contact           },
            ...(isLost && item.reward ? [{ icon: "💰", label: "Reward", value: `₹${item.reward}` }] : []),
          ].filter((f) => f.value).map(({ icon, label, value }) => (
            <div key={label} style={{
              background: "rgba(15,23,42,0.6)",
              border: "1px solid rgba(249,115,22,0.08)",
              borderRadius: 10, padding: "8px 10px",
            }}>
              <p style={{ margin: 0, color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {icon} {label}
              </p>
              <p style={{ margin: "3px 0 0", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Delete action */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => onDelete(item.id, type)}
            style={{
              padding: "6px 14px", background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8,
              color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.22)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)";  }}
          >🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Pill ──────────────────────────────────────────────────────────────────
function StatPill({ icon, label, count, color, dim, border }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: dim, border: `1px solid ${border}`,
      borderRadius: 12, padding: "10px 18px", flex: 1, minWidth: 120,
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, color, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{count}</p>
        <p style={{ margin: 0, color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function MyReportsPage() {
  const [tab,     setTab]     = useState("lost");
  const [lost,    setLost]    = useState([]);
  const [found,   setFound]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const email = getEmailFromToken();
        const [lostItems, foundItems] = await Promise.all([
          getLostItems(email),
          getFoundItems(email),
        ]);
        setLost(lostItems);
        setFound(foundItems);
      } catch (err) {
        setError(err.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteItem(id, type);
      if (type === "lost") setLost((p)  => p.filter((i) => i.id !== id));
      else                 setFound((p) => p.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const items = tab === "lost" ? lost : found;

  return (
    <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>

      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <SectionLabel>Reports</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0" }}>My Reports</h3>
        <p style={{ color: C.slate500, fontSize: 13, margin: "4px 0 0" }}>
          All items you have reported as lost or found
        </p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <StatPill icon="😟" label="Lost Reports"  count={lost.length}               color="#f97316" dim="rgba(249,115,22,0.1)"  border="rgba(249,115,22,0.25)"  />
          <StatPill icon="🤝" label="Found Reports" count={found.length}              color="#22c55e" dim="rgba(34,197,94,0.1)"   border="rgba(34,197,94,0.25)"   />
          <StatPill icon="📋" label="Total"         count={lost.length + found.length} color="#94a3b8" dim="rgba(148,163,184,0.08)" border="rgba(148,163,184,0.15)" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { key: "lost",  label: "😟 Lost Items",  count: lost.length,  active: "#f97316" },
          { key: "found", label: "🤝 Found Items", count: found.length, active: "#22c55e" },
        ].map(({ key, label, count, active }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 10,
            background: tab === key ? active : "rgba(5,11,26,0.6)",
            border: `1px solid ${tab === key ? active : C.border}`,
            color: tab === key ? "#fff" : C.slate400,
            fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            boxShadow: tab === key ? `0 4px 12px ${active}44` : "none",
          }}>
            {label}
            <span style={{
              background: tab === key ? "rgba(255,255,255,0.2)" : C.orangeDim,
              color: tab === key ? "#fff" : C.orange,
              padding: "1px 7px", borderRadius: 100, fontSize: 11, fontWeight: 800,
            }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Body */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <p style={{ color: C.red, fontSize: 14, marginBottom: 12 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: "8px 20px", background: C.orangeDim,
            border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.orange, fontWeight: 700, cursor: "pointer",
          }}>Retry</button>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.slate600 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.slate500 }}>No {tab} item reports yet</p>
          <p style={{ fontSize: 13 }}>Items you report as {tab} will appear here.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {items.map((item) => (
            <ReportCard key={item.id} item={item} type={tab} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}