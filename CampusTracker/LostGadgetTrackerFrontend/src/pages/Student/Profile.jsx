// src/pages/Student/Profile.jsx
// Styled to match Home.jsx — dark bg #050b1a, orange #f97316 accents, inline styles

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ✅ Add getProfile to the existing import
import {
    changePassword,
    deleteItem,
    getMyClaims,
    getMyFoundItems,
    getMyLostItems,
    getNotifications,
    getProfile, // ← ADD THIS
    markAllNotificationsRead,
    updateProfile,
    uploadAvatar
} from "../../Services/profileService";

// ── Design tokens (mirrors Home.jsx) ──────────────────────
const C = {
  bg:        "#050b1a",
  bgCard:    "rgba(15,23,42,0.8)",
  border:    "rgba(249,115,22,0.15)",
  borderHot: "rgba(249,115,22,0.4)",
  orange:    "#f97316",
  orangeDim: "rgba(249,115,22,0.12)",
  green:     "#22c55e",
  blue:      "#3b82f6",
  white:     "#ffffff",
  slate400:  "#94a3b8",
  slate500:  "#64748b",
  slate600:  "#475569",
  red:       "#ef4444",
  redDim:    "rgba(239,68,68,0.12)",
};

// ── Status badge ───────────────────────────────────────────
const statusCfg = {
  PENDING:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  MATCHED:  { label: "Matched",  color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  RESOLVED: { label: "Resolved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  APPROVED: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  REJECTED: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
  ACTIVE:   { label: "Active",   color: "#22c55e", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)"   },
  INACTIVE: { label: "Inactive", color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)" },
};

const Badge = ({ status }) => {
  const cfg = statusCfg[status] || { label: status, color: C.slate400, bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: 100,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
};

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      border: `3px solid ${C.border}`,
      borderTopColor: C.orange,
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const SectionLabel = ({ children }) => (
  <span style={{ color: C.orange, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
    {children}
  </span>
);

// ── Navbar (same look as Home.jsx) ────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("user");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? "rgba(5,11,26,0.97)" : "rgba(5,11,26,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? `1px solid ${C.borderHot}` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <span style={{ color: C.orange, fontWeight: 900, fontSize: 17, letterSpacing: "-0.3px" }}>
            Campus Tracker
          </span>
        </Link>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to="/" style={{ color: C.slate400, textDecoration: "none", fontWeight: 600, fontSize: 14, transition: "color 0.2s" }}>
            Home
          </Link>
          <Link to="/student/browse" style={{ color: C.slate400, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            Browse
          </Link>
          {isLoggedIn ? (
            <>
              <span style={{ color: C.orange, fontWeight: 700, fontSize: 14, borderBottom: `2px solid ${C.orange}`, paddingBottom: 2 }}>
                Profile
              </span>
              <button onClick={handleLogout} style={{
                padding: "7px 18px", background: "transparent",
                color: C.orange, border: `1.5px solid ${C.orange}`,
                borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.target.style.background = C.orange; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = C.orange; }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{
              padding: "7px 18px", background: C.orange, color: "#fff",
              borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14,
            }}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── ProfileCard ────────────────────────────────────────────
function ProfileCard({ profile, onEdit }) {
  const initials = profile.name.split(" ").map((w) => w[0]).join("").toUpperCase();

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
      {/* Banner */}
      <div style={{
        height: 90,
        background: "linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))",
        borderBottom: `1px solid ${C.border}`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 15% 50%, rgba(249,115,22,0.15) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", top: 16, right: 20,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(249,115,22,0.15)", border: `1px solid ${C.border}`,
          borderRadius: 100, padding: "4px 12px",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block" }} />
          <span style={{ color: C.orange, fontSize: 12, fontWeight: 600 }}>Live Account</span>
        </div>
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -36, marginBottom: 20 }}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} style={{
              width: 72, height: 72, borderRadius: 16,
              border: `3px solid ${C.bg}`,
              boxShadow: `0 0 0 1px ${C.border}`,
              objectFit: "cover",
            }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: 16,
              border: `3px solid ${C.bg}`,
              background: `linear-gradient(135deg, ${C.orange}, #ea580c)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#fff",
              boxShadow: "0 8px 24px rgba(249,115,22,0.3)",
            }}>
              {initials}
            </div>
          )}
          <button onClick={onEdit} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            background: C.orangeDim, border: `1px solid ${C.border}`,
            borderRadius: 10, color: C.orange,
            fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(249,115,22,0.22)"; e.currentTarget.style.borderColor = C.orange; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.borderColor = C.border; }}
          >
            ✏️ Edit Profile
          </button>
        </div>

        <h2 style={{ color: C.white, fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>{profile.name}</h2>
        <p style={{ color: C.slate500, fontSize: 14, margin: "0 0 20px" }}>{profile.department} · {profile.year}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { icon: "📧", label: "Email",       value: profile.email },
            { icon: "🎓", label: "Roll Number", value: profile.rollNumber },
            { icon: "📱", label: "Phone",       value: profile.phone },
            { icon: "🏷️", label: "Role",        value: profile.role },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              background: "rgba(5,11,26,0.6)", border: `1px solid rgba(249,115,22,0.08)`,
              borderRadius: 12, padding: "12px 14px",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }}>{icon}</span>
              <div>
                <p style={{ color: C.slate600, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 3px" }}>{label}</p>
                <p style={{ color: C.slate400, fontSize: 13, fontWeight: 600, margin: 0 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.slate600, fontSize: 12 }}>Account Status:</span>
          <Badge status={profile.status} />
        </div>
      </div>
    </div>
  );
}

// ── EditProfileModal ───────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const fileRef = useRef();
  const [form, setForm]       = useState({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { const { avatarUrl } = await uploadAvatar(file); setForm((p) => ({ ...p, avatarUrl })); }
    catch (err) { setError(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const updated = await updateProfile({ name: form.name, email: form.email, phone: form.phone, department: form.department });
      onSave({ ...form, ...updated }); setSuccess(true); setTimeout(onClose, 1200);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const initials = form.name.split(" ").map((w) => w[0]).join("").toUpperCase();
  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "rgba(5,11,26,0.8)", border: `1px solid rgba(249,115,22,0.2)`,
    borderRadius: 10, color: C.white, fontSize: 14, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#080f20", border: `1px solid ${C.borderHot}`,
        borderRadius: 20, width: "100%", maxWidth: 440,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: `1px solid ${C.border}`,
        }}>
          <div>
            <SectionLabel>Edit Profile</SectionLabel>
            <h3 style={{ color: C.white, fontSize: 18, fontWeight: 800, margin: "4px 0 0" }}>Update Your Info</h3>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "6px 10px", color: C.slate400, cursor: "pointer", fontSize: 16,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="" style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover", border: `2px solid ${C.border}` }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: `linear-gradient(135deg, ${C.orange}, #ea580c)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 900, color: "#fff",
              }}>{initials}</div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              background: "none", border: "none", color: C.orange, fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>📷 Change Photo</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { name: "name", label: "Full Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone", type: "text" },
              { name: "department", label: "Department", type: "text" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label style={{ display: "block", color: C.slate500, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
                <input type={type} name={name} value={form[name] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = C.orange}
                  onBlur={(e) => e.target.style.borderColor = "rgba(249,115,22,0.2)"}
                />
              </div>
            ))}
          </div>

          {error   && <p style={{ color: C.red,   fontSize: 13, marginTop: 12 }}>{error}</p>}
          {success && <p style={{ color: C.green, fontSize: 13, marginTop: 12, textAlign: "center", fontWeight: 700 }}>✓ Profile updated!</p>}

          <button type="submit" disabled={loading} style={{
            width: "100%", marginTop: 20, padding: "12px",
            background: loading ? "rgba(249,115,22,0.5)" : C.orange,
            border: "none", borderRadius: 10, color: "#fff",
            fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── ChangePassword ─────────────────────────────────────────
function ChangePassword() {
  const [form, setForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null);
  const [errMsg, setErrMsg]   = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword)                       e.currentPassword = "Required";
    if (form.newPassword.length < 8)                 e.newPassword     = "At least 8 characters";
    if (form.newPassword !== form.confirmPassword)   e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setStatus(null);
    try { await changePassword(form); setStatus("success"); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    catch (err) { setStatus("error"); setErrMsg(err.message); }
    finally { setLoading(false); }
  };

  const inputStyle = (hasError) => ({
    width: "100%", padding: "10px 14px",
    background: hasError ? "rgba(239,68,68,0.07)" : "rgba(5,11,26,0.8)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(249,115,22,0.2)"}`,
    borderRadius: 10, color: C.white, fontSize: 14, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  });

  const Field = ({ name, label, placeholder }) => (
    <div>
      <label style={{ display: "block", color: C.slate500, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</label>
      <input type="password" value={form[name]} placeholder={placeholder}
        style={inputStyle(!!errors[name])}
        onChange={(e) => { setForm((p) => ({ ...p, [name]: e.target.value })); setErrors((p) => ({ ...p, [name]: "" })); }}
        onFocus={(e) => { if (!errors[name]) e.target.style.borderColor = C.orange; }}
        onBlur={(e)  => { if (!errors[name]) e.target.style.borderColor = "rgba(249,115,22,0.2)"; }}
      />
      {errors[name] && <p style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Security</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0" }}>Change Password</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
        <Field name="currentPassword" label="Current Password" placeholder="Enter current password" />
        <Field name="newPassword"     label="New Password"     placeholder="Min. 8 characters" />
        <Field name="confirmPassword" label="Confirm Password" placeholder="Re-enter new password" />

        {status === "success" && (
          <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10 }}>
            <p style={{ color: C.green, fontSize: 13, fontWeight: 600, margin: 0 }}>✓ Password changed successfully!</p>
          </div>
        )}
        {status === "error" && (
          <div style={{ padding: "10px 14px", background: C.redDim, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10 }}>
            <p style={{ color: C.red, fontSize: 13, fontWeight: 600, margin: 0 }}>{errMsg}</p>
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          padding: "12px 24px", alignSelf: "flex-start",
          background: loading ? "rgba(249,115,22,0.5)" : C.orange,
          border: "none", borderRadius: 10, color: "#fff",
          fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#ea580c"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = C.orange; }}
        >
          {loading ? "Updating…" : "🔒 Update Password"}
        </button>
      </form>
    </div>
  );
}

// ── MyReports ──────────────────────────────────────────────
function MyReports() {
  const [tab,     setTab]     = useState("lost");
  const [lost,    setLost]    = useState([]);
  const [found,   setFound]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    Promise.all([getMyLostItems(), getMyFoundItems()])
      .then(([l, f]) => { setLost(l); setFound(f); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const items    = tab === "lost" ? lost  : found;
  const setItems = tab === "lost" ? setLost : setFound;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try { await deleteItem(id); setItems((prev) => prev.filter((i) => i.id !== id)); }
    catch (err) { alert(err.message); }
  };

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Reports</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0" }}>My Reports</h3>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { key: "lost",  label: "😟 Lost Items",  count: lost.length  },
          { key: "found", label: "🤝 Found Items", count: found.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 16px", borderRadius: 10,
            background: tab === key ? C.orange : "rgba(5,11,26,0.6)",
            border: `1px solid ${tab === key ? C.orange : C.border}`,
            color: tab === key ? "#fff" : C.slate400,
            fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            boxShadow: tab === key ? "0 4px 12px rgba(249,115,22,0.25)" : "none",
          }}>
            {label}
            <span style={{
              background: tab === key ? "rgba(255,255,255,0.2)" : C.orangeDim,
              color: tab === key ? "#fff" : C.orange,
              padding: "1px 7px", borderRadius: 100, fontSize: 11, fontWeight: 800,
            }}>{count}</span>
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : error ? (
        <p style={{ color: C.red, textAlign: "center", padding: "24px 0" }}>{error}</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.slate600 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
          <p style={{ fontSize: 14 }}>No {tab} item reports yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: "rgba(5,11,26,0.6)", border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "16px 18px", transition: "border-color 0.2s, transform 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHot; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ color: C.white, fontWeight: 800, fontSize: 15 }}>{item.name}</span>
                    <Badge status={item.status} />
                  </div>
                  <p style={{ color: C.slate500, fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}>{item.description}</p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ color: C.slate600, fontSize: 12 }}>📍 {item.location}</span>
                    <span style={{ color: C.slate600, fontSize: 12 }}>📅 {formatDate(item.date)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={{
                    padding: "6px 10px", background: C.orangeDim, border: `1px solid ${C.border}`,
                    borderRadius: 8, color: C.orange, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{
                    padding: "6px 10px", background: C.redDim, border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 8, color: C.red, fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Notifications ──────────────────────────────────────────
function Notifications() {
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    getNotifications()
      .then(setNotifs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    try { await markAllNotificationsRead(); setNotifs((n) => n.map((x) => ({ ...x, read: true }))); }
    catch (err) { alert(err.message); }
  };

  const unread = notifs.filter((n) => !n.read).length;
  const notifMeta = {
    MATCH:        { emoji: "⚡", bg: "rgba(59,130,246,0.1)"  },
    CLAIM:        { emoji: "✅", bg: "rgba(34,197,94,0.1)"   },
    ANNOUNCEMENT: { emoji: "📢", bg: C.orangeDim              },
  };

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <SectionLabel>Alerts</SectionLabel>
          <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
            Notifications
            {unread > 0 && (
              <span style={{ background: C.red, color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 100 }}>
                {unread}
              </span>
            )}
          </h3>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} style={{
            background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.orange, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "6px 12px",
          }}>Mark all read</button>
        )}
      </div>

      {loading ? <Spinner /> : error ? (
        <p style={{ color: C.red, textAlign: "center", padding: "24px 0" }}>{error}</p>
      ) : notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.slate600 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔕</div>
          <p style={{ fontSize: 14 }}>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.map((n) => {
            const meta = notifMeta[n.type] || notifMeta.ANNOUNCEMENT;
            return (
              <div key={n.id} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 16px", borderRadius: 12,
                background: n.read ? "rgba(5,11,26,0.5)" : "rgba(249,115,22,0.05)",
                border: `1px solid ${n.read ? C.border : C.borderHot}`,
                transition: "all 0.2s",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>{meta.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: n.read ? C.slate500 : C.white, fontSize: 13, lineHeight: 1.5, margin: "0 0 4px", fontWeight: n.read ? 400 : 600 }}>
                    {n.message}
                  </p>
                  <p style={{ color: C.slate600, fontSize: 11, margin: 0 }}>{n.time}</p>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.orange, flexShrink: 0, marginTop: 4 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MyClaims ───────────────────────────────────────────────
function MyClaims() {
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    getMyClaims()
      .then(setClaims)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Claims</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
          My Claims
          <span style={{ background: C.orangeDim, border: `1px solid ${C.border}`, color: C.orange, fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 100 }}>
            {claims.length}
          </span>
        </h3>
      </div>

      {loading ? <Spinner /> : error ? (
        <p style={{ color: C.red, textAlign: "center", padding: "24px 0" }}>{error}</p>
      ) : claims.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.slate600 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
          <p style={{ fontSize: 14 }}>No claims submitted yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Item", "Claim Date", "Status"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "8px 12px",
                    color: C.slate600, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < claims.length - 1 ? `1px solid rgba(249,115,22,0.05)` : "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(249,115,22,0.03)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px", color: C.white, fontWeight: 600 }}>{c.itemName}</td>
                  <td style={{ padding: "12px", color: C.slate500 }}>{formatDate(c.claimDate)}</td>
                  <td style={{ padding: "12px" }}><Badge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function StudentProfile() {
  const navigate = useNavigate();
 const [profile, setProfile] = useState({
  name: "",
  email: "",
  rollNoOrEmpId: "",
  lostCount: 0,
  foundCount: 0
});
const [loading, setLoading] = useState(true);
  const [profileError,   setProfileError]   = useState("");
  const [editOpen,       setEditOpen]       = useState(false);
  const [activeSection,  setActiveSection]  = useState("profile");

useEffect(() => {
  getProfile()
    .then(data => {
      console.log("✅ Profile data:", data);
      setProfile(data);
      setLoading(false); // ← add this
    })
    .catch(err => {
      console.log("❌ Error:", err.message);
      setProfileError(err.message); // ← show error in UI
      setLoading(false);            // ← add this
    });
}, []);

  const navItems = [
    { key: "profile",       label: "👤  Profile"       },
    { key: "password",      label: "🔒  Password"      },
    { key: "reports",       label: "📋  My Reports"    },
    { key: "notifications", label: "🔔  Notifications" },
    { key: "claims",        label: "✅  My Claims"     },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.white }}>
      <Navbar />

      {/* Page header strip — matches Home section headers */}
      <div style={{
        paddingTop: 64,
        background: "linear-gradient(to bottom, rgba(249,115,22,0.07) 0%, transparent 100%)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 28px" }}>
          <SectionLabel>Student Portal</SectionLabel>
          <h1 style={{ color: C.white, fontSize: 32, fontWeight: 900, margin: "6px 0 4px" }}>My Profile</h1>
          <p style={{ color: C.slate500, fontSize: 14, margin: 0 }}>
            Manage your account, reports, and notifications
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <aside className="profile-sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 8 }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveSection(key)} style={{
                width: "100%", display: "block",
                padding: "10px 14px", borderRadius: 10, marginBottom: 2,
                background: activeSection === key ? C.orange : "transparent",
                border: `1px solid ${activeSection === key ? C.orange : "transparent"}`,
                color: activeSection === key ? "#fff" : C.slate400,
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                textAlign: "left", transition: "all 0.2s",
                boxShadow: activeSection === key ? "0 4px 12px rgba(249,115,22,0.3)" : "none",
              }}
                onMouseEnter={(e) => { if (activeSection !== key) { e.currentTarget.style.background = C.orangeDim; e.currentTarget.style.color = C.orange; } }}
                onMouseLeave={(e) => { if (activeSection !== key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.slate400; } }}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile tabs */}
          <div className="profile-mobile-tabs" style={{ display: "none", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
            {navItems.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveSection(key)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: 10,
                background: activeSection === key ? C.orange : C.bgCard,
                border: `1px solid ${activeSection === key ? C.orange : C.border}`,
                color: activeSection === key ? "#fff" : C.slate400,
                fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
              }}>{label}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40 }}>
              <Spinner />
            </div>
          ) : profileError ? (
            <div style={{ background: C.bgCard, border: "1px solid rgba(239,68,68,0.3)", borderRadius: 20, padding: 40, textAlign: "center" }}>
              <p style={{ color: C.red, fontSize: 15 }}>{profileError}</p>
              <button onClick={() => window.location.reload()} style={{
                marginTop: 12, padding: "8px 20px", background: C.orangeDim,
                border: `1px solid ${C.border}`, borderRadius: 8, color: C.orange, fontWeight: 700, cursor: "pointer",
              }}>Retry</button>
            </div>
          ) : (
            <>
              {activeSection === "profile"       && profile && <ProfileCard profile={profile} onEdit={() => setEditOpen(true)} />}
              {activeSection === "password"      && <ChangePassword />}
              {activeSection === "reports"       && <MyReports />}
              {activeSection === "notifications" && <Notifications />}
              {activeSection === "claims"        && <MyClaims />}
            </>
          )}
        </main>
      </div>

      {/* Footer — identical to Home.jsx */}
      <footer style={{
        background: "#020810", borderTop: "1px solid rgba(249,115,22,0.1)",
        padding: "32px 24px", textAlign: "center", marginTop: 40,
      }}>
        <p style={{ color: C.slate600, fontSize: 14, margin: 0 }}>
          © 2026 Campus Gadget Tracker — MLRIT. All rights reserved.
        </p>
      </footer>

      {editOpen && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={(updated) => setProfile((p) => ({ ...p, ...updated }))}
        />
      )}

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .profile-sidebar      { display: none !important; }
          .profile-mobile-tabs  { display: flex !important; }
        }
      `}</style>
    </div>
  );
}