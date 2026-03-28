// pages/AllPostsPage.jsx
import { useCallback, useEffect, useState } from "react";
import {
  approveLostItem,
  deleteLostItem,
  editLostItem,
  getAllLostItems,
} from "../../Services/adminapi"; // adjust import path as needed
import { s } from "./styles";

export default function AllPostsPage() {
  const [posts,         setPosts]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [filterStatus,  setFilterStatus]  = useState("ALL");
  const [filterType,    setFilterType]    = useState("ALL");
  const [editPost,      setEditPost]      = useState(null);
  const [editText,      setEditText]      = useState({});
  const [actionLoading, setActionLoading] = useState({}); // per-post loading state

  /* ── Fetch all posts on mount ── */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllLostItems();
      setPosts(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ── Filtered view ── */
  const filtered = posts.filter(p => {
    const statusMatch = filterStatus === "ALL" || p.status === filterStatus;
    const typeMatch   = filterType   === "ALL" || p.type   === filterType;
    return statusMatch && typeMatch;
  });

  /* ── Approve ── */
  const handleApprove = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: "approve" }));
    try {
      const updated = await approveLostItem(id);
      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updated } : p))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve post.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Edit ── */
  const handleEdit = (post) => {
    setEditPost(post.id);
    setEditText({ title: post.title, description: post.description });
  };

  const handleSaveEdit = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: "edit" }));
    try {
      const updated = await editLostItem(id, editText);
      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updated } : p))
      );
      setEditPost(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setActionLoading(prev => ({ ...prev, [id]: "delete" }));
    try {
      await deleteLostItem(id);
      fetchPosts(); // refresh from server
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete post.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Render states ── */
  if (loading) {
    return (
      <div style={s.emptyState}>
        <div style={{ fontSize: "2rem" }}>⏳</div>
        <div>Loading posts…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.emptyState}>
        <div style={{ fontSize: "2rem" }}>⚠️</div>
        <div>{error}</div>
        <button onClick={fetchPosts} style={s.btnApprove}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div style={s.filterRow}>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={s.select}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} style={s.select}>
            <option value="ALL">All</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
        </div>
        <div style={s.filterCount}>{filtered.length} posts found</div>
      </div>

      {/* Post List */}
      <div style={s.postList}>
        {filtered.length === 0 && (
          <div style={s.emptyState}>
            <div style={{ fontSize: "3rem" }}>📭</div>
            <div>No posts match your filters.</div>
          </div>
        )}

        {filtered.map(post => (
          <div key={post.id} style={s.postCard}>
            {editPost === post.id ? (
              /* ── Edit Mode ── */
              <div style={s.editMode}>
                <input
                  value={editText.title}
                  onChange={e => setEditText(t => ({ ...t, title: e.target.value }))}
                  style={s.editInput}
                  placeholder="Title"
                />
                <textarea
                  value={editText.description}
                  onChange={e => setEditText(t => ({ ...t, description: e.target.value }))}
                  style={s.editTextarea}
                  rows={3}
                  placeholder="Description"
                />
                <div style={s.editActions}>
                  <button
                    onClick={() => handleSaveEdit(post.id)}
                    style={s.btnSave}
                    disabled={actionLoading[post.id] === "edit"}
                  >
                    {actionLoading[post.id] === "edit" ? "Saving…" : "💾 Save"}
                  </button>
                  <button
                    onClick={() => setEditPost(null)}
                    style={s.btnCancel}
                    disabled={actionLoading[post.id] === "edit"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <>
                <div style={s.postHeader}>
                  <div style={s.postMeta}>
                    <span style={{
                      ...s.typePill,
                      background: post.type === "LOST" ? "#fee2e2" : "#d1fae5",
                      color:      post.type === "LOST" ? "#dc2626" : "#059669",
                    }}>
                      {post.type}
                    </span>
                    <span style={{
                      ...s.statusPill,
                      background: post.status === "APPROVED" ? "#d1fae5" : "#fef3c7",
                      color:      post.status === "APPROVED" ? "#059669" : "#92400e",
                    }}>
                      {post.status}
                    </span>
                  </div>
                  <span style={s.postDate}>{post.date}</span>
                </div>

                <h3 style={s.postTitle}>{post.title}</h3>
                <p style={s.postDesc}>{post.description}</p>

                <div style={s.postFooter}>
                  <div style={s.postAuthor}>
                    <div style={s.authorAvatar}>{post.author?.[0]}</div>
                    <div>
                      <div style={s.authorName}>{post.author}</div>
                      <div style={s.authorRoll}>{post.rollNo}</div>
                    </div>
                  </div>
                  <div style={s.postActions}>
                    {post.status === "PENDING" && (
                      <button
                        onClick={() => handleApprove(post.id)}
                        style={s.btnApprove}
                        disabled={!!actionLoading[post.id]}
                      >
                        {actionLoading[post.id] === "approve" ? "Approving…" : "✓ Approve"}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(post)}
                      style={s.btnEdit}
                      disabled={!!actionLoading[post.id]}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={s.btnDelete}
                      disabled={!!actionLoading[post.id]}
                    >
                      {actionLoading[post.id] === "delete" ? "Deleting…" : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}