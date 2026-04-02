// ─────────────────────────────────────────────────────────────────────────────
// ContactRequestsPage.jsx  —  Incoming & Sent contact requests
// Route: /chat/requests
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import {
  acceptChatRequest,
  getPendingRequests,
  rejectChatRequest,
} from "../../../Services/chatRequestApi";
import { Avatar, Badge, Btn, C, GLOBAL_STYLES, StatusPill } from "./Chatshared";

// ─── Helper: derive avatar initials from a name ───────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Palette for auto-assigned avatar colours ─────────────────────────────────
const AVATAR_COLORS = [
  "#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b",
  "#10b981", "#6366f1", "#f43f5e", "#14b8a6",
];
function pickColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Normalise raw API response into the shape the UI expects ─────────────────
function normaliseRequest(raw) {
  return {
    id:          raw.id,
    name:        raw.senderName  || raw.sender        || "Unknown",
    item:        raw.itemName    || raw.itemId        || "Item",
    msg:         raw.message     || "",
    time:        raw.createdAt
                   ? new Date(raw.createdAt).toLocaleString("en-IN", {
                       day: "numeric", month: "short",
                       hour: "2-digit", minute: "2-digit",
                     })
                   : "",
    status:      raw.status      || "pending",
    avatar:      getInitials(raw.senderName || raw.sender || "?"),
    avatarColor: pickColor(raw.id || 0),
    // keep raw id fields for API calls
    _raw: raw,
  };
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      background: C.surface2, border: `1px solid ${C.border2}`,
      borderRadius: 14, padding: "16px 18px",
      display: "flex", gap: 14, alignItems: "flex-start",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 14, width: "40%", background: "rgba(255,255,255,0.06)", borderRadius: 6 }} />
        <div style={{ height: 12, width: "70%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
        <div style={{ height: 12, width: "55%", background: "rgba(255,255,255,0.04)", borderRadius: 6 }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactRequestsPage() {
  // ── State ────────────────────────────────────────────────────────────────────
  const [incoming,    setIncoming]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [filter,      setFilter]      = useState("All");
  const [actionState, setActionState] = useState({}); // { [id]: "accepting"|"rejecting"|"done" }
  const [toast,       setToast]       = useState(null);

  // ── Get the current user from localStorage / your auth store ─────────────────
  // Adjust this line to match however you store the logged-in user.
  const currentUser =
    JSON.parse(localStorage.getItem("user") || "null")?.username ||
    localStorage.getItem("username") ||
    "";

  // ── Fetch pending requests ────────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPendingRequests(currentUser);
      const data = Array.isArray(res.data) ? res.data : [];
      setIncoming(data.map(normaliseRequest));
    } catch (err) {
      console.error("Failed to fetch requests", err);
      setError("Could not load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // ── Flash toast ───────────────────────────────────────────────────────────────
  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Accept / Reject ───────────────────────────────────────────────────────────
  async function handleAction(id, action) {
    setActionState((prev) => ({ ...prev, [id]: action === "accept" ? "accepting" : "rejecting" }));
    try {
      if (action === "accept") {
        await acceptChatRequest(id);
        setIncoming((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
        );
        flash("✅ Request accepted! You can now chat.");
      } else {
        await rejectChatRequest(id);
        setIncoming((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
        );
        flash("❌ Request rejected.");
      }
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
      flash(`⚠️ Failed to ${action} request. Please try again.`);
    } finally {
      setActionState((prev) => ({ ...prev, [id]: "done" }));
    }
  }

  // ── Derived counts ────────────────────────────────────────────────────────────
  const pendingCount = incoming.filter((r) => r.status === "pending").length;

  // ── Filter helper ─────────────────────────────────────────────────────────────
  function filterList(list) {
    if (filter === "Pending")  return list.filter((r) => r.status === "pending");
    if (filter === "Accepted") return list.filter((r) => r.status === "accepted");
    if (filter === "Rejected") return list.filter((r) => r.status === "rejected");
    return list;
  }

  // ── Request card ──────────────────────────────────────────────────────────────
  function RequestCard({ req }) {
    const busy = actionState[req.id] === "accepting" || actionState[req.id] === "rejecting";
    const isPending = req.status === "pending";

    return (
      <div style={{
        background: C.surface2,
        border: `1px solid ${
          req.status === "accepted" ? "rgba(34,197,94,0.2)"
          : req.status === "rejected" ? "rgba(239,68,68,0.15)"
          : C.border2
        }`,
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        animation: "fadeIn 0.2s ease",
        transition: "border-color 0.2s",
      }}>
        <Avatar initials={req.avatar} color={req.avatarColor} size={44} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + status */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{req.name}</span>
            <StatusPill status={req.status} />
          </div>

          {/* Item */}
          <div style={{ color: C.accent, fontSize: 12, fontWeight: 600, marginTop: 3 }}>
            📎 {req.item}
          </div>

          {/* Message */}
          {req.msg && (
            <p style={{
              color: C.subtle, fontSize: 13, lineHeight: 1.5,
              margin: "6px 0 0", wordBreak: "break-word",
            }}>
              "{req.msg}"
            </p>
          )}

          {/* Time */}
          <span style={{ color: C.muted, fontSize: 11, marginTop: 4, display: "block" }}>
            {req.time}
          </span>
        </div>

        {/* Action buttons — only for pending incoming */}
        {isPending && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <Btn
              onClick={() => handleAction(req.id, "accept")}
              variant="success"
              size="sm"
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              {actionState[req.id] === "accepting" ? "…" : "✓ Accept"}
            </Btn>
            <Btn
              onClick={() => handleAction(req.id, "reject")}
              variant="danger"
              size="sm"
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              {actionState[req.id] === "rejecting" ? "…" : "✗ Reject"}
            </Btn>
          </div>
        )}
      </div>
    );
  }

  // ── Section block ─────────────────────────────────────────────────────────────
  function Section({ title, list }) {
    const filtered = filterList(list);
    return (
      <div style={{ marginBottom: 36 }}>
        <h3 style={{
          color: C.text, fontWeight: 800, fontSize: 16,
          marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
        }}>
          {title}
          {pendingCount > 0 && <Badge count={pendingCount} />}
        </h3>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            color: C.muted, fontSize: 14,
            padding: "24px 20px",
            background: C.surface2,
            border: `1px dashed ${C.border2}`,
            borderRadius: 12,
            textAlign: "center",
          }}>
            {filter !== "All"
              ? `No ${filter.toLowerCase()} requests.`
              : "No requests yet — check back later."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((r) => (
              <RequestCard key={r.id} req={r} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: C.text,
    }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Refresh button */}
          <button
            onClick={fetchRequests}
            disabled={loading}
            title="Refresh"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${C.border2}`,
              borderRadius: 8, color: C.subtle,
              fontSize: 16, width: 34, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1, transition: "opacity 0.2s",
            }}
          >
            🔄
          </button>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Pending", "Accepted", "Rejected"].map((f) => (
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
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          margin: "12px 32px 0",
          padding: "10px 16px",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: 10, color: C.green,
          fontSize: 13, fontWeight: 600,
          animation: "fadeIn 0.2s ease",
        }}>
          {toast}
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          margin: "12px 32px 0",
          padding: "10px 16px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10, color: C.red,
          fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>⚠️ {error}</span>
          <button
            onClick={fetchRequests}
            style={{
              background: "none", border: "none", color: C.red,
              fontSize: 12, cursor: "pointer", textDecoration: "underline",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ padding: "28px 32px", maxWidth: 820, margin: "0 auto" }}>
        {/*
          getPendingRequests() only returns incoming requests from your API.
          If you later add a "getSentRequests(receiver)" endpoint, add a second
          Section here the same way.
        */}
        <Section title="Incoming Requests" list={incoming} />
      </div>
    </div>
  );
}