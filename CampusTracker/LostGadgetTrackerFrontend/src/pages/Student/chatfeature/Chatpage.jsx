// ─────────────────────────────────────────────────────────────────────────────
// ChatPage.jsx  —  Messaging view (conversation list + chat window)
// Route: /chat
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { Avatar, Badge, Btn, C, GLOBAL_STYLES, SEED_CONVERSATIONS, StatusPill } from "./Chatshared";

export default function ChatPage() {
  const [convos, setConvos] = useState(SEED_CONVERSATIONS);
  const [active, setActive] = useState(convos[0]);
  const [input,  setInput]  = useState("");
  const [typing, setTyping] = useState(false);
  const [toast,  setToast]  = useState(null);
  const endRef              = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages, typing]);

  function flash(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSelectConvo(c) {
    // clear unread badge when opening
    setConvos((prev) => prev.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
    setActive({ ...c, unread: 0 });
  }

  function sendMsg() {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = { id: Date.now(), from: "me", text: input.trim(), time: now, type: "text" };

    const updateConvos = (prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...c.messages, newMsg], lastMsg: input.trim(), time: "just now" }
          : c
      );

    setConvos(updateConvos);
    setActive((prev) => ({ ...prev, messages: [...prev.messages, newMsg], lastMsg: input.trim() }));
    setInput("");

    // simulate typing + auto-reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = {
        id: Date.now() + 1,
        from: "them",
        text: "Got your message! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setActive((prev) => ({ ...prev, messages: [...prev.messages, reply] }));
      setConvos((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, reply] } : c))
      );
    }, 2000);
  }

  function markResolved() {
    setActive((prev) => ({ ...prev, status: "Closed" }));
    setConvos((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, status: "Closed" } : c))
    );
    flash("Conversation marked as Resolved ✅");
  }

  function sendContactReq() {
    const sysMsg = {
      id: Date.now(),
      from: "system",
      text: "Contact Request Sent 📨",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "system",
    };
    setActive((prev) => ({ ...prev, messages: [...prev.messages, sysMsg] }));
    flash("Contact request sent!");
  }

  const totalUnread = convos.reduce((s, c) => s + (c.unread || 0), 0);

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        color: C.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      {/* ── Page header ── */}
      <div style={{
        padding: "18px 24px 14px",
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>💬</span>
        <span style={{ color: C.text, fontWeight: 900, fontSize: 18 }}>Messages</span>
        {totalUnread > 0 && <Badge count={totalUnread} />}
      </div>

      {/* ── Two-panel body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" }}>

        {/* Sidebar */}
        <div style={{
          width: 320, flexShrink: 0,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
            <input
              placeholder="Search conversations…"
              style={{
                width: "100%", padding: "8px 12px",
                background: C.surface2, border: `1px solid ${C.border2}`,
                borderRadius: 8, color: C.text, fontSize: 13,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {convos.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectConvo(c)}
                style={{
                  padding: "14px 16px", cursor: "pointer",
                  background: active?.id === c.id ? C.accentDim : "transparent",
                  borderLeft: active?.id === c.id ? `3px solid ${C.accent}` : "3px solid transparent",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  transition: "background 0.15s",
                }}
              >
                <Avatar initials={c.avatar} color={c.avatarColor} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{c.name}</span>
                    <span style={{ color: C.muted, fontSize: 11 }}>{c.time}</span>
                  </div>
                  <div style={{ color: C.accent, fontSize: 11, fontWeight: 600, marginTop: 1 }}>📎 {c.item}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                    <span style={{
                      color: C.muted, fontSize: 12,
                      overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", maxWidth: 160,
                    }}>
                      {c.lastMsg}
                    </span>
                    {c.unread > 0 && <Badge count={c.unread} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {active ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Header */}
            <div style={{
              padding: "14px 20px",
              background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar initials={active.avatar} color={active.avatarColor} />
                <div>
                  <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{active.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>📎 {active.item}</span>
                    <StatusPill status={active.status} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Btn onClick={sendContactReq} variant="ghost" size="sm">📨 Send Contact Request</Btn>
                <Btn onClick={markResolved}   variant="success" size="sm">✅ Mark Resolved</Btn>
              </div>
            </div>

            {/* Toast */}
            {toast && (
              <div style={{
                margin: "8px 20px 0",
                padding: "8px 16px",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 8, color: C.green,
                fontSize: 13, fontWeight: 600,
              }}>
                {toast}
              </div>
            )}

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "20px 20px 12px",
              display: "flex", flexDirection: "column", gap: 10,
              animation: "fadeIn 0.2s ease",
            }}>
              {active.messages.map((m) => {
                if (m.type === "system") {
                  return (
                    <div key={m.id} style={{ textAlign: "center" }}>
                      <span style={{
                        background: "rgba(249,115,22,0.1)", color: C.accent,
                        fontSize: 12, fontWeight: 600,
                        borderRadius: 100, padding: "4px 14px",
                        border: `1px solid ${C.border}`,
                      }}>
                        {m.text}
                      </span>
                    </div>
                  );
                }
                const isMe = m.from === "me";
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "68%" }}>
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: isMe ? C.accent : C.surface2,
                        color: isMe ? "#fff" : C.text,
                        fontSize: 14, lineHeight: 1.5,
                      }}>
                        {m.text}
                      </div>
                      <div style={{
                        color: C.muted, fontSize: 11, marginTop: 3,
                        textAlign: isMe ? "right" : "left",
                      }}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar initials={active.avatar} color={active.avatarColor} size={28} />
                  <div style={{
                    padding: "8px 14px", background: C.surface2,
                    borderRadius: "16px 16px 16px 4px",
                    color: C.muted, fontSize: 13, fontStyle: "italic",
                  }}>
                    Typing…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div style={{
              padding: "12px 20px",
              background: C.surface,
              borderTop: `1px solid ${C.border}`,
              display: "flex", gap: 10, alignItems: "center",
            }}>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.subtle, padding: 4 }}
                title="Attach file"
              >
                📎
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMsg()}
                placeholder="Type your message…"
                style={{
                  flex: 1, padding: "10px 14px",
                  background: C.surface2,
                  border: `1px solid ${C.border2}`,
                  borderRadius: 10, color: C.text,
                  fontSize: 14, outline: "none",
                }}
              />
              <Btn onClick={sendMsg} variant="primary">Send ➤</Btn>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            justifyContent: "center", color: C.muted, fontSize: 16,
          }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}