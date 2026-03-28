// ─────────────────────────────────────────────────────────────────────────────
// chatShared.js  —  Shared tokens, seed data & micro-components
// Import from every chat page file
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
export const C = {
  bg:        "#050b1a",
  surface:   "#0d1628",
  surface2:  "#111c2e",
  border:    "rgba(249,115,22,0.14)",
  border2:   "rgba(255,255,255,0.07)",
  accent:    "#f97316",
  accentDim: "rgba(249,115,22,0.12)",
  accentHov: "#ea6c0a",
  text:      "#e2e8f0",
  muted:     "#64748b",
  subtle:    "#94a3b8",
  green:     "#22c55e",
  red:       "#ef4444",
  blue:      "#3b82f6",
  yellow:    "#eab308",
};

// ── Seed data ─────────────────────────────────────────────────────────────────
export const SEED_CONVERSATIONS = [
  {
    id: 1,
    name: "Riya Sharma",
    item: "Lost Laptop",
    avatar: "RS",
    avatarColor: "#8b5cf6",
    lastMsg: "Did you check the library?",
    time: "2m ago",
    unread: 3,
    status: "Active",
    messages: [
      { id: 1, from: "them",   text: "Hi! I think I found your laptop near the cafeteria.", time: "10:01 AM", type: "text" },
      { id: 2, from: "me",     text: "Oh really? What color is it?",                        time: "10:02 AM", type: "text" },
      { id: 3, from: "them",   text: "It's silver, Dell Inspiron, has a sticker on it.",    time: "10:03 AM", type: "text" },
      { id: 4, from: "me",     text: "That's mine! Can we meet?",                            time: "10:05 AM", type: "text" },
      { id: 5, from: "them",   text: "Did you check the library?",                           time: "10:07 AM", type: "text" },
      { id: 6, from: "system", text: "Contact Request Sent",                                 time: "10:07 AM", type: "system" },
    ],
  },
  {
    id: 2,
    name: "Arjun Mehta",
    item: "Blue Backpack",
    avatar: "AM",
    avatarColor: "#06b6d4",
    lastMsg: "Sure, I'll be there at 4pm",
    time: "15m ago",
    unread: 0,
    status: "Active",
    messages: [
      { id: 1, from: "them", text: "Is this your backpack? Found it near Block-C.", time: "9:30 AM", type: "text" },
      { id: 2, from: "me",   text: "Yes! Thank you so much.",                       time: "9:32 AM", type: "text" },
      { id: 3, from: "them", text: "Sure, I'll be there at 4pm",                   time: "9:35 AM", type: "text" },
    ],
  },
  {
    id: 3,
    name: "Priya Nair",
    item: "AirPods Case",
    avatar: "PN",
    avatarColor: "#ec4899",
    lastMsg: "Let me know if you find them",
    time: "1h ago",
    unread: 1,
    status: "Closed",
    messages: [
      { id: 1, from: "me",   text: "Hi, I lost my AirPods case yesterday.", time: "8:00 AM", type: "text" },
      { id: 2, from: "them", text: "I haven't seen one, sorry!",            time: "8:05 AM", type: "text" },
      { id: 3, from: "them", text: "Let me know if you find them",          time: "8:06 AM", type: "text" },
    ],
  },
];

export const SEED_REQUESTS = {
  incoming: [
    { id: 1, name: "Karan Patel",  item: "Lost ID Card",       msg: "I found an ID card near the ground floor...",     time: "Today, 11:30 AM",    status: "pending",  avatar: "KP", avatarColor: "#f59e0b" },
    { id: 2, name: "Sneha Rao",    item: "Black Wallet",        msg: "Is this your wallet? I found it in the canteen.", time: "Yesterday, 3:15 PM", status: "accepted", avatar: "SR", avatarColor: "#10b981" },
  ],
  sent: [
    { id: 3, name: "Vikram Singh", item: "Mechanical Keyboard", msg: "Hi, I saw your listing — I think I found it.",    time: "Mar 22, 10:00 AM",   status: "pending",  avatar: "VS", avatarColor: "#6366f1" },
    { id: 4, name: "Ananya Das",   item: "Water Bottle",         msg: "I have a blue bottle I found near Lab-2.",        time: "Mar 20, 2:45 PM",    status: "rejected", avatar: "AD", avatarColor: "#f43f5e" },
  ],
};

export const SEED_BLOCKED = [
  { id: 1, name: "Unknown User", blockedDate: "Mar 10, 2026" },
];

// ── Reusable components ───────────────────────────────────────────────────────

export function Avatar({ initials, color, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color || C.accent,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.36, color: "#fff",
      flexShrink: 0, letterSpacing: "-0.5px",
    }}>
      {initials}
    </div>
  );
}

export function Badge({ count, color = C.red }) {
  if (!count) return null;
  return (
    <span style={{
      background: color, color: "#fff",
      fontSize: 10, fontWeight: 800,
      borderRadius: 100, minWidth: 17, height: 17,
      display: "inline-flex", alignItems: "center",
      justifyContent: "center", padding: "0 4px",
    }}>
      {count}
    </span>
  );
}

export function Toggle({ on, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div
        onClick={() => onChange(!on)}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: on ? C.accent : "rgba(255,255,255,0.12)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }} />
      </div>
      <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{label}</span>
    </label>
  );
}

export function StatusPill({ status }) {
  const map = {
    Active:   { bg: "rgba(34,197,94,0.15)",   color: C.green,  label: "Active" },
    Closed:   { bg: "rgba(100,116,139,0.15)", color: C.muted,  label: "Closed" },
    pending:  { bg: "rgba(234,179,8,0.15)",   color: C.yellow, label: "Pending" },
    accepted: { bg: "rgba(34,197,94,0.15)",   color: C.green,  label: "Accepted" },
    rejected: { bg: "rgba(239,68,68,0.15)",   color: C.red,    label: "Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700,
      borderRadius: 100, padding: "3px 10px",
    }}>
      {s.label}
    </span>
  );
}

export function Btn({ onClick, children, variant = "primary", size = "md", style: extra = {} }) {
  const base = {
    borderRadius: 9, fontWeight: 700, cursor: "pointer",
    transition: "all 0.18s", border: "none",
    display: "inline-flex", alignItems: "center", gap: 6,
    fontSize: size === "sm" ? 12 : 14,
    padding: size === "sm" ? "5px 12px" : "9px 18px",
  };
  const variants = {
    primary: { background: C.accent,                 color: "#fff" },
    outline: { background: "transparent",            color: C.accent, border: `1.5px solid ${C.accent}` },
    ghost:   { background: "rgba(255,255,255,0.06)", color: C.subtle, border: `1px solid ${C.border2}` },
    danger:  { background: "rgba(239,68,68,0.12)",   color: C.red,    border: `1px solid rgba(239,68,68,0.3)` },
    success: { background: "rgba(34,197,94,0.12)",   color: C.green,  border: `1px solid rgba(34,197,94,0.3)` },
  };
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant], opacity: hov ? 0.85 : 1, ...extra }}
    >
      {children}
    </button>
  );
}

export const GLOBAL_STYLES = `
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(249,115,22,0.25); border-radius: 10px; }
  select option { background: #0d1628; color: #e2e8f0; }
`;