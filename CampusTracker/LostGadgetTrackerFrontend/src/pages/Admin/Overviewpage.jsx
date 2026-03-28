// pages/OverviewPage.jsx
import { s } from "./styles";

export default function OverviewPage({ stats, posts }) {
  return (
    <div>
      {/* Stats Cards */}
      <div style={s.statsGrid}>
        {[
          { label: "Total Posts",    value: stats.total,    color: "#6366f1", icon: "📋" },
          { label: "Pending Review", value: stats.pending,  color: "#f59e0b", icon: "⏳" },
          { label: "Approved",       value: stats.approved, color: "#10b981", icon: "✅" },
          { label: "Flagged",        value: stats.flagged,  color: "#ef4444", icon: "🚩" },
        ].map(card => (
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
        {posts.slice(0, 5).map(post => (
          <div key={post.id} style={s.activityRow}>
            <span style={{
              ...s.typePill,
              background: post.type === "LOST" ? "#fee2e2" : "#d1fae5",
              color:      post.type === "LOST" ? "#dc2626" : "#059669",
            }}>
              {post.type}
            </span>
            <span style={s.activityTitle}>{post.title}</span>
            <span style={s.activityAuthor}>by {post.author}</span>
            <span style={{
              ...s.statusPill,
              background: post.status === "APPROVED" ? "#d1fae5" : "#fef3c7",
              color:      post.status === "APPROVED" ? "#059669" : "#92400e",
            }}>
              {post.status}
            </span>
            {post.flagged && (
              <span style={{ ...s.statusPill, background: "#fee2e2", color: "#dc2626" }}>🚩 Flagged</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}