// pages/FlaggedPage.jsx
import { useCallback, useEffect, useState } from "react";
import { dismissFlag, getAllFlaggedItems, removeFlaggedPost } from "../../Services/Flagapi";
import { s } from "./styles";

export default function FlaggedPage() {
  const [tab,           setTab]           = useState("LOST"); // "LOST" | "FOUND"
  const [flaggedPosts,  setFlaggedPosts]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  /* ── Fetch all flagged posts ── */
  const fetchFlagged = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFlaggedItems();
      setFlaggedPosts(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load flagged posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlagged();
  }, [fetchFlagged]);

  /* ── Filter by active tab ── */
  const filtered = flaggedPosts.filter(p => p.itemType === tab);

  /* ── Dismiss flag (keep post, just clear the flag) ── */
  const handleDismiss = async (itemId, itemType) => {
    const key = `${itemId}_${itemType}`;
    setActionLoading(prev => ({ ...prev, [key]: "dismiss" }));
    try {
      await dismissFlag(itemId, itemType);
      setFlaggedPosts(prev =>
        prev.filter(p => !(p.itemId === itemId && p.itemType === itemType))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to dismiss flag.");
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: null }));
    }
  };

  /* ── Remove post entirely ── */
  const handleRemove = async (itemId, itemType) => {
    if (!window.confirm("Remove this post permanently?")) return;
    const key = `${itemId}_${itemType}`;
    setActionLoading(prev => ({ ...prev, [key]: "remove" }));
    try {
      await removeFlaggedPost(itemId, itemType);
      setFlaggedPosts(prev =>
        prev.filter(p => !(p.itemId === itemId && p.itemType === itemType))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove post.");
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: null }));
    }
  };

  /* ── Tab style ── */
  const tabStyle = (active) => ({
    padding: "8px 24px",
    border: "none",
    borderBottom: active ? "2px solid #ef4444" : "2px solid transparent",
    background: "transparent",
    color: active ? "#ef4444" : "#6b7280",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    fontSize: "0.95rem",
  });

  const lostCount  = flaggedPosts.filter(p => p.itemType === "LOST").length;
  const foundCount = flaggedPosts.filter(p => p.itemType === "FOUND").length;

  /* ── Loading / error states ── */
  if (loading) {
    return (
      <div style={s.emptyState}>
        <div style={{ fontSize: "2rem" }}>⏳</div>
        <div>Loading flagged posts…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.emptyState}>
        <div style={{ fontSize: "2rem" }}>⚠️</div>
        <div>{error}</div>
        <button onClick={fetchFlagged} style={s.btnApprove}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* ── LOST / FOUND tabs with count badges ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "16px" }}>
        <button style={tabStyle(tab === "LOST")} onClick={() => setTab("LOST")}>
          🔴 Lost
          {lostCount > 0 && (
            <span style={{
              marginLeft: "8px", background: "#ef4444", color: "#fff",
              borderRadius: "999px", padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700,
            }}>
              {lostCount}
            </span>
          )}
        </button>
        <button style={tabStyle(tab === "FOUND")} onClick={() => setTab("FOUND")}>
          🟢 Found
          {foundCount > 0 && (
            <span style={{
              marginLeft: "8px", background: "#ef4444", color: "#fff",
              borderRadius: "999px", padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700,
            }}>
              {foundCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Empty state for this tab ── */}
      {filtered.length === 0 ? (
        <div style={s.emptyState}>
          <div style={{ fontSize: "3rem" }}>🎉</div>
          <div>No flagged {tab.toLowerCase()} items. All clear!</div>
        </div>
      ) : (
        <div style={s.postList}>
          {filtered.map(post => {
            const key  = `${post.itemId}_${post.itemType}`;
            const busy = !!actionLoading[key];

            return (
              <div key={key} style={{ ...s.postCard, borderLeft: "4px solid #ef4444" }}>

                {/* ── Flag Banner ── */}
                <div style={s.flagBanner}>
                  <span>🚩</span>
                  <span style={s.flagText}>Flagged for admin review</span>
                </div>

                {/* ── Header ── */}
                <div style={s.postHeader}>
                  <div style={s.postMeta}>
                    <span style={{
                      ...s.typePill,
                      background: post.itemType === "LOST" ? "#fee2e2" : "#d1fae5",
                      color:      post.itemType === "LOST" ? "#dc2626" : "#059669",
                    }}>
                      {post.itemType}
                    </span>
                  </div>
                  <span style={s.postDate}>{post.date}</span>
                </div>

                {/* ── Content ── */}
                <h3 style={s.postTitle}>{post.title}</h3>
                <p style={s.postDesc}>{post.description}</p>

                {/* ── Footer ── */}
                <div style={s.postFooter}>
                  <div style={s.postAuthor}>
                    <div style={s.authorAvatar}>{post.author?.[0]?.toUpperCase()}</div>
                    <div>
                      <div style={s.authorName}>{post.author}</div>
                    </div>
                  </div>
                  <div style={s.postActions}>
                    <button
                      onClick={() => handleDismiss(post.itemId, post.itemType)}
                      style={s.btnApprove}
                      disabled={busy}
                    >
                      {actionLoading[key] === "dismiss" ? "Dismissing…" : "✓ Dismiss Flag"}
                    </button>
                    <button
                      onClick={() => handleRemove(post.itemId, post.itemType)}
                      style={s.btnDelete}
                      disabled={busy}
                    >
                      {actionLoading[key] === "remove" ? "Removing…" : "🗑️ Remove Post"}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}