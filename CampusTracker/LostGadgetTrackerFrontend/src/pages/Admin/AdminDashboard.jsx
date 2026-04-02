// AdminDashboard.jsx — Shell: sidebar + routing between page components
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AllPostsPage from "./Allpostspage";
import FlaggedPage from "./Flaggedpage";
import OverviewPage from "./Overviewpage";
import ReportingPage from "./Reportingpage"; // ✅ NEW
import { s } from "./styles";

/* ── Temporary mock data (remove once backend is wired up) ── */
const mockPosts = [
  { id: 1, type: "LOST",  title: "Lost iPhone 14 Pro",    description: "Lost near the library on Monday evening. Black case with a crack.",               author: "Rahul Sharma", rollNo: "CS21001", date: "2026-03-07", status: "PENDING",  flagged: false, flagCount: 0 },
  { id: 2, type: "FOUND", title: "Found Blue Backpack",   description: "Found a blue backpack near Block C canteen. Contains books and a water bottle.", author: "Priya Reddy",  rollNo: "EC21045", date: "2026-03-08", status: "APPROVED", flagged: false, flagCount: 0 },
  { id: 3, type: "LOST",  title: "Lost Laptop Charger",   description: "Dell 65W charger lost in Lab 3. Please contact if found.",                        author: "Anil Kumar",   rollNo: "ME21089", date: "2026-03-08", status: "PENDING",  flagged: true,  flagCount: 3 },
  { id: 4, type: "FOUND", title: "Found Gold Ring",       description: "Found near the sports ground. Looks expensive. Please claim with proof.",          author: "Sneha Patel",  rollNo: "CS21112", date: "2026-03-09", status: "PENDING",  flagged: true,  flagCount: 7 },
  { id: 5, type: "LOST",  title: "Lost Student ID Card",  description: "Lost my MLRIT ID card somewhere on campus.",                                        author: "Vikram Singh", rollNo: "IT21023", date: "2026-03-06", status: "APPROVED", flagged: false, flagCount: 0 },
  { id: 6, type: "LOST",  title: "Lost AirPods Case",     description: "White AirPods case without the pods. Lost in the auditorium.",                     author: "Divya Nair",   rollNo: "CS21078", date: "2026-03-09", status: "PENDING",  flagged: true,  flagCount: 2 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts]         = useState(mockPosts);
  const [toast, setToast]         = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const navigate = useNavigate();

  const adminName = JSON.parse(localStorage.getItem("user") || "{}").name || "Admin";

  // ── Toast ──────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Confirm dialog helper ──────────────────────────────
  const confirm = (message, onConfirm) => setConfirmDialog({ message, onConfirm });

  // ── Handlers ──────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      await approvePost(id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "APPROVED" } : p));
      showToast("✅ Post approved successfully");
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    }
  };

  const handleEdit = async (id, editText) => {
    try {
      await updatePost(id, editText);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...editText } : p));
      showToast("✏️ Post updated successfully");
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    }
  };

  const handleDelete = (id) => {
    confirm("Are you sure you want to delete this post?", async () => {
      try {
        await deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
        setConfirmDialog(null);
        showToast("🗑️ Post deleted", "error");
      } catch (err) {
        showToast(`❌ ${err.message}`, "error");
      }
    });
  };

  const handleDismissFlag = async (id) => {
    try {
      await dismissFlag(id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, flagged: false, flagCount: 0 } : p));
      showToast("✅ Flag dismissed");
    } catch (err) {
      showToast(`❌ ${err.message}`, "error");
    }
  };

  const handleRemoveFlagged = (id) => {
    confirm("Permanently remove this flagged post?", async () => {
      try {
        await removeFlaggedPost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
        setConfirmDialog(null);
        showToast("🗑️ Flagged post removed", "error");
      } catch (err) {
        showToast(`❌ ${err.message}`, "error");
      }
    });
  };

  const handleLogout = async () => {
    try { await logoutAdmin(); } catch (_) {}
    localStorage.clear();
    navigate("/login");
  };

  // ── Derived data ───────────────────────────────────────
  const flaggedPosts = posts.filter(p => p.flagged);
  const allPosts     = posts.filter(p => !p.flagged);
  const stats = {
    total:    posts.length,
    pending:  posts.filter(p => p.status === "PENDING").length,
    approved: posts.filter(p => p.status === "APPROVED").length,
    flagged:  flaggedPosts.length,
  };

  // ── Page meta ──────────────────────────────────────────
  const pageMeta = {
    posts:     { title: "📋 All Posts",          subtitle: "Manage all user-submitted lost & found posts" },
    flagged:   { title: "🚩 Flagged Content",    subtitle: "Review and moderate reported content" },
    overview:  { title: "📊 Overview",           subtitle: "Platform statistics at a glance" },
    reporting: { title: "📈 Reports & Insights", subtitle: "Reporting dashboard and user engagement metrics" }, // ✅ NEW
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
            { id: "posts",     icon: "📋", label: "All Posts" },
            { id: "flagged",   icon: "🚩", label: "Flagged Content" },
            { id: "overview",  icon: "📊", label: "Overview" },
            { id: "reporting", icon: "📈", label: "Reports & Insights" }, // ✅ NEW
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ ...s.navItem, ...(activeTab === item.id ? s.navItemActive : {}) }}
            >
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
          <h1 style={s.pageTitle}>{pageMeta[activeTab].title}</h1>
          <p style={s.pageSubtitle}>{pageMeta[activeTab].subtitle}</p>
        </div>

        {activeTab === "overview"  && <OverviewPage stats={stats} posts={posts} />}
        {activeTab === "posts"     && <AllPostsPage posts={allPosts} onApprove={handleApprove} onEdit={handleEdit} onDelete={handleDelete} />}
        {activeTab === "flagged"   && <FlaggedPage flaggedPosts={flaggedPosts} onDismissFlag={handleDismissFlag} onRemove={handleRemoveFlagged} />}
        {activeTab === "reporting" && <ReportingPage posts={posts} />}  {/* ✅ NEW */}
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