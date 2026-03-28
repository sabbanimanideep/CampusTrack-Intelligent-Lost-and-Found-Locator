// ─────────────────────────────────────────────────────────────────────────────
import { NavLink, Outlet } from "react-router-dom";
import { C, GLOBAL_STYLES, SEED_CONVERSATIONS, SEED_REQUESTS } from "./Chatshared";

const unreadMsg   = SEED_CONVERSATIONS.reduce((s, c) => s + (c.unread || 0), 0);
const pendingReqs = SEED_REQUESTS.incoming.filter((r) => r.status === "pending").length;

function NavBadge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: count ? "#ef4444" : C.accent,
      color: "#fff", fontSize: 10, fontWeight: 800,
      borderRadius: 100, minWidth: 17, height: 17,
      display: "inline-flex", alignItems: "center",
      justifyContent: "center", padding: "0 4px",
    }}>
      {count}
    </span>
  );
}

const tabs = [
  { to: "/chat",          label: "💬 Chat",              badge: unreadMsg,   end: true },
  { to: "/chat/requests", label: "🤝 Contact Requests",  badge: pendingReqs, end: false },
  { to: "/chat/privacy",  label: "🔒 Privacy & Controls",badge: 0,           end: false },
];

export default function ChatLayout() {
  return (
    <div style={{
      background: C.bg,
      minHeight: "100vh",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: C.text,
    }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Tab navigation bar ── */}
      <nav style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 4,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}>
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            style={({ isActive }) => ({
              padding: "15px 18px",
              background: "transparent",
              border: "none",
              borderBottom: isActive ? `2px solid ${C.accent}` : "2px solid transparent",
              color: isActive ? C.accent : C.subtle,
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              textDecoration: "none",
              userSelect: "none",
            })}
          >
            {t.label}
            <NavBadge count={t.badge} />
          </NavLink>
        ))}
      </nav>

      {/* ── Page content (routed) ── */}
      <Outlet />
    </div>
  );
}