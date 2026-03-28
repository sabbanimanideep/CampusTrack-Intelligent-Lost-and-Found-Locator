// pages/FlaggedPage.jsx
import { s } from "./styles";

export default function FlaggedPage({ flaggedPosts, onDismissFlag, onRemove }) {
  if (flaggedPosts.length === 0) {
    return (
      <div style={s.emptyState}>
        <div style={{ fontSize: "3rem" }}>🎉</div>
        <div>No flagged content. Everything looks clean!</div>
      </div>
    );
  }

  return (
    <div style={s.postList}>
      {flaggedPosts.map(post => (
        <div key={post.id} style={{ ...s.postCard, borderLeft: "4px solid #ef4444" }}>
          {/* Flag Banner */}
          <div style={s.flagBanner}>
            <span>🚩</span>
            <span style={s.flagText}>
              Reported {post.flagCount} time{post.flagCount !== 1 ? "s" : ""} by community members
            </span>
          </div>

          <div style={s.postHeader}>
            <span style={{
              ...s.typePill,
              background: post.type === "LOST" ? "#fee2e2" : "#d1fae5",
              color:      post.type === "LOST" ? "#dc2626" : "#059669",
            }}>
              {post.type}
            </span>
            <span style={s.postDate}>{post.date}</span>
          </div>

          <h3 style={s.postTitle}>{post.title}</h3>
          <p style={s.postDesc}>{post.description}</p>

          <div style={s.postFooter}>
            <div style={s.postAuthor}>
              <div style={s.authorAvatar}>{post.author[0]}</div>
              <div>
                <div style={s.authorName}>{post.author}</div>
                <div style={s.authorRoll}>{post.rollNo}</div>
              </div>
            </div>
            <div style={s.postActions}>
              <button onClick={() => onDismissFlag(post.id)} style={s.btnApprove}>✓ Dismiss Flag</button>
              <button onClick={() => onRemove(post.id)} style={s.btnDelete}>🗑️ Remove Post</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}