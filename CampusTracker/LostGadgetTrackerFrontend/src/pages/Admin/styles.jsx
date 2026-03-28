// styles.js — Shared styles for Admin Dashboard pages
export const s = {
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