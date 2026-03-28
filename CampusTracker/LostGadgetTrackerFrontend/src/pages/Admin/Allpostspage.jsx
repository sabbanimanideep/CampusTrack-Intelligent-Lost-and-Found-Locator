// pages/AllPostsPage.jsx
import { useCallback, useEffect, useState } from "react";
import {
  approveFoundItem,
  approveLostItem,
  deleteLostItem,
  editLostItem,
  getAllFoundItems,
  getAllLostItems,
  rejectFoundItem,
} from "../../Services/adminapi";
import { adminFlagItem } from "../../Services/Flagapi";
import { s } from "./styles";

export default function AllPostsPage() {
  const [tab,           setTab]           = useState("LOST"); // "LOST" | "FOUND"
  const [posts,         setPosts]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [filterStatus,  setFilterStatus]  = useState("ALL");
  const [editPost,      setEditPost]      = useState(null);
  const [editText,      setEditText]      = useState({});
  const [actionLoading, setActionLoading] = useState({});

  /* ── Fetch based on active tab ── */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = tab === "LOST"
        ? await getAllLostItems()
        : await getAllFoundItems();
      setPosts(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ── Helpers to normalise field names across both entities ── */
  const getStatus = (p) => p.status ?? (p.approved ? "APPROVED" : "PENDING");
  const getTitle  = (p) => p.title  ?? p.itemName;
  const getDate   = (p) => p.date   ?? p.dateFound ?? p.dateLost ?? "";
  const getAuthor = (p) => p.author ?? p.reporterEmail ?? p.userEmail ?? "";
  const getRollNo = (p) => p.rollNo ?? "";

  /* ── Filtered view ── */
  const filtered = posts.filter(p => {
    if (filterStatus === "ALL") return true;
    return getStatus(p) === filterStatus;
  });

  /* ── Approve ── */
  const handleApprove = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: "approve" }));
    try {
      const updated = tab === "LOST"
        ? await approveLostItem(id)
        : await approveFoundItem(id);
      setPosts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updated, approved: true } : p))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve post.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Edit (lost items only) ── */
  const handleEdit = (post) => {
    setEditPost(post.id);
    setEditText({ title: getTitle(post), description: post.description });
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

  /* ── Delete / Reject ── */
  const handleDelete = async (id) => {
    const action = tab === "LOST" ? "Delete" : "Reject";
    if (!window.confirm(`${action} this post?`)) return;
    setActionLoading(prev => ({ ...prev, [id]: "delete" }));
    try {
      tab === "LOST"
        ? await deleteLostItem(id)
        : await rejectFoundItem(id);
      fetchPosts();
    } catch (err) {
      alert(err?.response?.data?.message || `Failed to ${action.toLowerCase()} post.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Flag post → moves it to Flagged tab ── */
  const handleFlag = async (id, itemType) => {
    setActionLoading(prev => ({ ...prev, [id]: "flag" }));
    try {
      await adminFlagItem(id, itemType);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to flag post.");
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  /* ── Tab style helper ── */
  const tabStyle = (active) => ({
    padding: "8px 24px",
    border: "none",
    borderBottom: active ? "2px solid #4f46e5" : "2px solid transparent",
    background: "transparent",
    color: active ? "#4f46e5" : "#6b7280",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    fontSize: "0.95rem",
  });

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
      {/* ── Tabs ── */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "16px" }}>
        <button style={tabStyle(tab === "LOST")}  onClick={() => { setTab("LOST");  setFilterStatus("ALL"); }}>
          🔴 Lost Items
        </button>
        <button style={tabStyle(tab === "FOUND")} onClick={() => { setTab("FOUND"); setFilterStatus("ALL"); }}>
          🟢 Found Items
        </button>
      </div>

      {/* ── Filters ── */}
      <div style={s.filterRow}>
        <div style={s.filterGroup}>
          <label style={s.filterLabel}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={s.select}>
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
        <div style={s.filterCount}>{filtered.length} posts found</div>
      </div>

      {/* ── Post List ── */}
      <div style={s.postList}>
        {filtered.length === 0 && (
          <div style={s.emptyState}>
            <div style={{ fontSize: "3rem" }}>📭</div>
            <div>No posts match your filters.</div>
          </div>
        )}

        {filtered.map(post => {
          const status = getStatus(post);
          const isPending = status === "PENDING";

          return (
            <div key={post.id} style={s.postCard}>
              {editPost === post.id ? (
                /* ── Edit Mode (lost only) ── */
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
                        background: tab === "LOST" ? "#fee2e2" : "#d1fae5",
                        color:      tab === "LOST" ? "#dc2626" : "#059669",
                      }}>
                        {tab}
                      </span>
                      <span style={{
                        ...s.statusPill,
                        background: status === "APPROVED" ? "#d1fae5" : "#fef3c7",
                        color:      status === "APPROVED" ? "#059669" : "#92400e",
                      }}>
                        {status}
                      </span>

                    </div>
                    <span style={s.postDate}>{getDate(post)}</span>
                  </div>

                  <h3 style={s.postTitle}>{getTitle(post)}</h3>
                  <p style={s.postDesc}>{post.description}</p>

                  <div style={s.postFooter}>
                    <div style={s.postAuthor}>
                      <div style={s.authorAvatar}>{getAuthor(post)?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={s.authorName}>{getAuthor(post)}</div>
                        <div style={s.authorRoll}>{getRollNo(post)}</div>
                      </div>
                    </div>
                    <div style={s.postActions}>
                      {status === "PENDING" && (
                        <button
                          onClick={() => handleApprove(post.id)}
                          style={s.btnApprove}
                          disabled={!!actionLoading[post.id]}
                        >
                          {actionLoading[post.id] === "approve" ? "Approving…" : "✓ Approve"}
                        </button>
                      )}
                      {tab === "LOST" && (
                        <button
                          onClick={() => handleEdit(post)}
                          style={s.btnEdit}
                          disabled={!!actionLoading[post.id]}
                        >
                          ✏️ Edit
                        </button>
                      )}

                      {/* ── Flag button: PENDING posts only ── */}
                      {isPending && (
                        <button
                          onClick={() => handleFlag(post.id, tab)}
                          style={{
                            padding: "6px 14px",
                            border: "1px solid #fca5a5",
                            borderRadius: "6px",
                            background: "#fff",
                            color: "#dc2626",
                            fontWeight: 500,
                            cursor: actionLoading[post.id] ? "not-allowed" : "pointer",
                            fontSize: "0.85rem",
                            opacity: actionLoading[post.id] ? 0.6 : 1,
                          }}
                          disabled={!!actionLoading[post.id]}
                          title="Flag this post for review"
                        >
                          {actionLoading[post.id] === "flag" ? "Flagging…" : "🚩 Flag"}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(post.id)}
                        style={s.btnDelete}
                        disabled={!!actionLoading[post.id]}
                      >
                        {actionLoading[post.id] === "delete"
                          ? (tab === "LOST" ? "Deleting…" : "Rejecting…")
                          : (tab === "LOST" ? "🗑️ Delete"  : "✕ Reject")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}