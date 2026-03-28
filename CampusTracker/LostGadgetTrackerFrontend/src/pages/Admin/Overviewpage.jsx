// pages/OverviewPage.jsx
import { useEffect, useState } from "react";
import { getAllLostItems } from "../../Services/adminapi";
import { getOverviewCounts } from "../../Services/dashboardApi";
import { s } from "./styles";

export default function OverviewPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    flagged: 0,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both in parallel
        const [raw, items] = await Promise.all([
          getOverviewCounts(),
          getAllLostItems(),
        ]);

        // Map backend keys → stats shape OverviewPage expects
        setStats({
          total:    raw.totalPosts    ?? 0,
          pending:  raw.pendingPosts  ?? (raw.totalPosts - raw.approvedPosts - raw.flaggedPosts) ?? 0,
          approved: raw.approvedPosts ?? 0,
          flagged:  raw.flaggedPosts  ?? 0,
        });

        // Map items → shape each activity row expects
        const mapped = (items ?? []).map((item) => ({
          id:      item.id,
          type:    item.type ?? "LOST",
          title:   item.title ?? "Untitled",
          author:  item.reportedBy ?? item.userName ?? item.email ?? "Unknown",
          status:  item.approved ? "APPROVED" : "PENDING",
          flagged: item.flagged ?? false,
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⏳</div>
          <div>Loading dashboard…</div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        margin: "24px",
        padding: "16px 20px",
        background: "#fee2e2",
        border: "1px solid #fca5a5",
        borderRadius: "8px",
        color: "#dc2626",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span>⚠️</span>
        <span>{error}</span>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginLeft: "auto",
            padding: "4px 12px",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────
  return (
    <div>
      {/* Stats Cards */}
      <div style={s.statsGrid}>
        {[
          { label: "Total Posts",    value: stats.total,    color: "#6366f1", icon: "📋" },
          { label: "Pending Review", value: stats.pending,  color: "#f59e0b", icon: "⏳" },
          { label: "Approved",       value: stats.approved, color: "#10b981", icon: "✅" },
          { label: "Flagged",        value: stats.flagged,  color: "#ef4444", icon: "🚩" },
        ].map((card) => (
          <div key={card.label} style={{ ...s.statCard, borderTop: `4px solid ${card.color}` }}>
            <div style={s.statIcon}>{card.icon}</div>
            <div style={{ ...s.statValue, color: card.color }}>{card.value}</div>
            <div style={s.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={s.recentSection}>
        <h2 style={s.sectionTitle}>Recent Activity</h2>

        {posts.length === 0 ? (
          <div style={{ color: "#9ca3af", padding: "16px 0" }}>No recent activity found.</div>
        ) : (
          posts.slice(0, 5).map((post) => (
            <div key={post.id} style={s.activityRow}>
              <span
                style={{
                  ...s.typePill,
                  background: post.type === "LOST" ? "#fee2e2" : "#d1fae5",
                  color:      post.type === "LOST" ? "#dc2626" : "#059669",
                }}
              >
                {post.type}
              </span>

              <span style={s.activityTitle}>{post.title}</span>
              <span style={s.activityAuthor}>by {post.author}</span>

              <span
                style={{
                  ...s.statusPill,
                  background: post.status === "APPROVED" ? "#d1fae5" : "#fef3c7",
                  color:      post.status === "APPROVED" ? "#059669" : "#92400e",
                }}
              >
                {post.status}
              </span>

              {post.flagged && (
                <span style={{ ...s.statusPill, background: "#fee2e2", color: "#dc2626" }}>
                  🚩 Flagged
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}