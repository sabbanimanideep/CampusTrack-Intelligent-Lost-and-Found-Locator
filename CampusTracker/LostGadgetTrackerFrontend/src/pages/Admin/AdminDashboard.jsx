import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockPosts = [
  { id: 1, type: "LOST", title: "Lost iPhone 14 Pro", description: "Lost near the library on Monday evening. Black case with a crack.", author: "Rahul Sharma", rollNo: "CS21001", date: "2026-03-07", status: "PENDING", flagged: false, flagCount: 0 },
  { id: 2, type: "FOUND", title: "Found Blue Backpack", description: "Found a blue backpack near Block C canteen. Contains books and a water bottle.", author: "Priya Reddy", rollNo: "EC21045", date: "2026-03-08", status: "APPROVED", flagged: false, flagCount: 0 },
  { id: 3, type: "LOST", title: "Lost Laptop Charger", description: "Dell 65W charger lost in Lab 3. Please contact if found.", author: "Anil Kumar", rollNo: "ME21089", date: "2026-03-08", status: "PENDING", flagged: true, flagCount: 3 },
  { id: 4, type: "FOUND", title: "Found Gold Ring", description: "Found near the sports ground. Looks expensive. Please claim with proof.", author: "Sneha Patel", rollNo: "CS21112", date: "2026-03-09", status: "PENDING", flagged: true, flagCount: 7 },
  { id: 5, type: "LOST", title: "Lost Student ID Card", description: "Lost my MLRIT ID card somewhere on campus.", author: "Vikram Singh", rollNo: "IT21023", date: "2026-03-06", status: "APPROVED", flagged: false, flagCount: 0 },
  { id: 6, type: "LOST", title: "Lost AirPods Case", description: "White AirPods case without the pods. Lost in the auditorium.", author: "Divya Nair", rollNo: "CS21078", date: "2026-03-09", status: "PENDING", flagged: true, flagCount: 2 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState(mockPosts);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [editPost, setEditPost] = useState(null);
  const [editText, setEditText] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const navigate = useNavigate();

  const adminName = JSON.parse(localStorage.getItem("user") || "{}").name || "Admin";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "APPROVED" } : p));
    showToast("✅ Post approved successfully");
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: "Are you sure you want to delete this post?",
      onConfirm: () => {
        setPosts(prev => prev.filter(p => p.id !== id));
        setConfirmDialog(null);
        showToast("🗑️ Post deleted", "error");
      },
    });
  };

  const handleEdit = (post) => {
    setEditPost(post.id);
    setEditText({ title: post.title, description: post.description });
  };

  const handleSaveEdit = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...editText } : p));
    setEditPost(null);
    showToast("✏️ Post updated successfully");
  };

  const handleDismissFlag = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, flagged: false, flagCount: 0 } : p));
    showToast("✅ Flag dismissed");
  };

  const handleRemoveFlagged = (id) => {
    setConfirmDialog({
      message: "Permanently remove this flagged post?",
      onConfirm: () => {
        setPosts(prev => prev.filter(p => p.id !== id));
        setConfirmDialog(null);
        showToast("🗑️ Flagged post removed", "error");
      },
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const allPosts = posts.filter(p => !p.flagged);
  const flaggedPosts = posts.filter(p => p.flagged);

  const filteredPosts = allPosts.filter(p => {
    const statusMatch = filterStatus === "ALL" || p.status === filterStatus;
    const typeMatch = filterType === "ALL" || p.type === filterType;
    return statusMatch && typeMatch;
  });

  const stats = {
    total: posts.length,
    pending: posts.filter(p => p.status === "PENDING").length,
    approved: posts.filter(p => p.status === "APPROVED").length,
    flagged: flaggedPosts.length,
  };

  return (
    <div style={s.root}>
      {/* ── SIDEBAR ── */}
      <aside style={s.sidebar}>
        <div style={s.logoBox}>
          <div style={s.logoIcon}>🔍</div>
          <div>
            <div style={s.logoTitle}>GadgetTrack</div>
            <div style={s.logoSub}>Admin Panel</div>
          </div>
        </div>

        <div style={s.adminInfo}>
          <div style={s.adminAvatar}>{adminName[0]}</div>
          <div>
            <div style={s.adminName}>{adminName}</div>
            <div style={s.adminRole}>Administrator</div>
          </div>
        </div>

        <nav style={s.nav}>
          {[
            { id: "posts",    icon: "📋", label: "All Posts" },
            { id: "flagged",  icon: "🚩", label: "Flagged Content", badge: flaggedPosts.length },
            { id: "overview", icon: "📊", label: "Overview" },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ ...s.navItem, ...(activeTab === item.id ? s.navItemActive : {}) }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
              {item.badge > 0 && <span style={s.badge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={s.logoutBtn}>⬅ Logout</button>
      </aside>

      {/* ── MAIN ── */}
      <main style={s.main}>
        <div style={s.header}>
          <h1 style={s.pageTitle}>
            {activeTab === "posts"    && "📋 All Posts"}
            {activeTab === "flagged"  && "🚩 Flagged Content"}
            {activeTab === "overview" && "📊 Overview"}
          </h1>
          <p style={s.pageSubtitle}>
            {activeTab === "posts"    && "Manage all user-submitted lost & found posts"}
            {activeTab === "flagged"  && "Review and moderate reported content"}
            {activeTab === "overview" && "Platform statistics at a glance"}
          </p>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
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

            <div style={s.recentSection}>
              <h2 style={s.sectionTitle}>Recent Activity</h2>
              {posts.slice(0, 5).map(post => (
                <div key={post.id} style={s.activityRow}>
                  <span style={{ ...s.typePill, background: post.type === "LOST" ? "#fee2e2" : "#d1fae5", color: post.type === "LOST" ? "#dc2626" : "#059669" }}>
                    {post.type}
                  </span>
                  <span style={s.activityTitle}>{post.title}</span>
                  <span style={s.activityAuthor}>by {post.author}</span>
                  <span style={{ ...s.statusPill, background: post.status === "APPROVED" ? "#d1fae5" : "#fef3c7", color: post.status === "APPROVED" ? "#059669" : "#92400e" }}>
                    {post.status}
                  </span>
                  {post.flagged && <span style={{ ...s.statusPill, background: "#fee2e2", color: "#dc2626" }}>🚩 Flagged</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALL POSTS ── */}
        {activeTab === "posts" && (
          <div>
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
              <div style={s.filterCount}>{filteredPosts.length} posts found</div>
            </div>

            <div style={s.postList}>
              {filteredPosts.length === 0 && (
                <div style={s.emptyState}>
                  <div style={{ fontSize: "3rem" }}>📭</div>
                  <div>No posts match your filters.</div>
                </div>
              )}
              {filteredPosts.map(post => (
                <div key={post.id} style={s.postCard}>
                  {editPost === post.id ? (
                    <div style={s.editMode}>
                      <input value={editText.title}
                        onChange={e => setEditText(t => ({ ...t, title: e.target.value }))}
                        style={s.editInput} placeholder="Title" />
                      <textarea value={editText.description}
                        onChange={e => setEditText(t => ({ ...t, description: e.target.value }))}
                        style={s.editTextarea} rows={3} placeholder="Description" />
                      <div style={s.editActions}>
                        <button onClick={() => handleSaveEdit(post.id)} style={s.btnSave}>💾 Save</button>
                        <button onClick={() => setEditPost(null)} style={s.btnCancel}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={s.postHeader}>
                        <div style={s.postMeta}>
                          <span style={{ ...s.typePill, background: post.type === "LOST" ? "#fee2e2" : "#d1fae5", color: post.type === "LOST" ? "#dc2626" : "#059669" }}>
                            {post.type}
                          </span>
                          <span style={{ ...s.statusPill, background: post.status === "APPROVED" ? "#d1fae5" : "#fef3c7", color: post.status === "APPROVED" ? "#059669" : "#92400e" }}>
                            {post.status}
                          </span>
                        </div>
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
                          {post.status === "PENDING" && (
                            <button onClick={() => handleApprove(post.id)} style={s.btnApprove}>✓ Approve</button>
                          )}
                          <button onClick={() => handleEdit(post)} style={s.btnEdit}>✏️ Edit</button>
                          <button onClick={() => handleDelete(post.id)} style={s.btnDelete}>🗑️ Delete</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FLAGGED ── */}
        {activeTab === "flagged" && (
          <div>
            {flaggedPosts.length === 0 ? (
              <div style={s.emptyState}>
                <div style={{ fontSize: "3rem" }}>🎉</div>
                <div>No flagged content. Everything looks clean!</div>
              </div>
            ) : (
              <div style={s.postList}>
                {flaggedPosts.map(post => (
                  <div key={post.id} style={{ ...s.postCard, borderLeft: "4px solid #ef4444" }}>
                    <div style={s.flagBanner}>
                      <span>🚩</span>
                      <span style={s.flagText}>
                        Reported {post.flagCount} time{post.flagCount !== 1 ? "s" : ""} by community members
                      </span>
                    </div>
                    <div style={s.postHeader}>
                      <span style={{ ...s.typePill, background: post.type === "LOST" ? "#fee2e2" : "#d1fae5", color: post.type === "LOST" ? "#dc2626" : "#059669" }}>
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
                        <button onClick={() => handleDismissFlag(post.id)} style={s.btnApprove}>✓ Dismiss Flag</button>
                        <button onClick={() => handleRemoveFlagged(post.id)} style={s.btnDelete}>🗑️ Remove Post</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ ...s.toast, background: toast.type === "error" ? "#ef4444" : "#10b981" }}>
          {toast.message}
        </div>
      )}

      {/* ── CONFIRM DIALOG ── */}
      {confirmDialog && (
        <div style={s.overlay}>
          <div style={s.dialog}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</div>
            <p style={s.dialogMsg}>{confirmDialog.message}</p>
            <div style={s.dialogActions}>
              <button onClick={confirmDialog.onConfirm} style={s.btnDelete}>Yes, Delete</button>
              <button onClick={() => setConfirmDialog(null)} style={s.btnCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" },

  // Sidebar
  sidebar: { width: "260px", minWidth: "260px", background: "#0f172a", display: "flex", flexDirection: "column", padding: "24px 16px", gap: "8px", position: "fixed", height: "100vh", overflowY: "auto" },
  logoBox: { display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "16px" },
  logoIcon: { fontSize: "24px", background: "#6366f1", borderRadius: "10px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoTitle: { color: "#fff", fontWeight: "700", fontSize: "15px" },
  logoSub: { color: "#64748b", fontSize: "11px" },
  adminInfo: { display: "flex", alignItems: "center", gap: "10px", background: "#1e293b", borderRadius: "10px", padding: "12px", marginBottom: "8px" },
  adminAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 },
  adminName: { color: "#fff", fontSize: "13px", fontWeight: "600" },
  adminRole: { color: "#64748b", fontSize: "11px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: "14px", width: "100%" },
  navItemActive: { background: "#6366f1", color: "#fff" },
  badge: { background: "#ef4444", color: "#fff", borderRadius: "10px", padding: "2px 7px", fontSize: "11px", fontWeight: "700" },
  logoutBtn: { padding: "10px 14px", background: "#1e293b", color: "#94a3b8", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", textAlign: "left", marginTop: "8px" },

  // Main
  main: { marginLeft: "260px", flex: 1, padding: "32px" },
  header: { marginBottom: "28px" },
  pageTitle: { fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" },
  pageSubtitle: { color: "#64748b", fontSize: "14px", margin: 0 },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  statIcon: { fontSize: "22px", marginBottom: "8px" },
  statValue: { fontSize: "32px", fontWeight: "800", lineHeight: 1 },
  statLabel: { color: "#64748b", fontSize: "13px", marginTop: "4px" },

  // Recent
  recentSection: { background: "#fff", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" },
  activityRow: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f1f5f9", flexWrap: "wrap" },
  activityTitle: { flex: 1, fontSize: "14px", fontWeight: "500", color: "#1e293b" },
  activityAuthor: { fontSize: "13px", color: "#94a3b8" },

  // Filters
  filterRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", background: "#fff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", flexWrap: "wrap" },
  filterGroup: { display: "flex", alignItems: "center", gap: "8px" },
  filterLabel: { fontSize: "13px", color: "#64748b", fontWeight: "600" },
  select: { padding: "7px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", background: "#f8fafc", cursor: "pointer" },
  filterCount: { marginLeft: "auto", fontSize: "13px", color: "#64748b" },

  // Posts
  postList: { display: "flex", flexDirection: "column", gap: "16px" },
  postCard: { background: "#fff", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  postHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  postMeta: { display: "flex", gap: "8px" },
  postDate: { fontSize: "12px", color: "#94a3b8" },
  postTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" },
  postDesc: { fontSize: "14px", color: "#64748b", margin: "0 0 16px 0", lineHeight: "1.6" },
  postFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" },
  postAuthor: { display: "flex", alignItems: "center", gap: "10px" },
  authorAvatar: { width: "32px", height: "32px", borderRadius: "50%", background: "#e0e7ff", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" },
  authorName: { fontSize: "13px", fontWeight: "600", color: "#1e293b" },
  authorRoll: { fontSize: "11px", color: "#94a3b8" },
  postActions: { display: "flex", gap: "8px", flexWrap: "wrap" },

  // Pills
  typePill: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" },
  statusPill: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" },

  // Flag
  flagBanner: { display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", marginBottom: "14px" },
  flagText: { fontSize: "13px", color: "#dc2626", fontWeight: "500" },

  // Buttons
  btnApprove: { padding: "7px 14px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  btnEdit:    { padding: "7px 14px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  btnDelete:  { padding: "7px 14px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  btnSave:    { padding: "7px 14px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  btnCancel:  { padding: "7px 14px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },

  // Edit
  editMode:     { display: "flex", flexDirection: "column", gap: "10px" },
  editInput:    { padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", fontWeight: "600", outline: "none" },
  editTextarea: { padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", resize: "vertical", outline: "none" },
  editActions:  { display: "flex", gap: "8px" },

  // Empty
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#94a3b8", fontSize: "15px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },

  // Toast
  toast: { position: "fixed", bottom: "24px", right: "24px", color: "#fff", padding: "12px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 9999 },

  // Dialog
  overlay:       { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 },
  dialog:        { background: "#fff", borderRadius: "16px", padding: "32px", maxWidth: "380px", width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  dialogMsg:     { fontSize: "15px", color: "#475569", marginBottom: "20px" },
  dialogActions: { display: "flex", gap: "10px", justifyContent: "center" },
};