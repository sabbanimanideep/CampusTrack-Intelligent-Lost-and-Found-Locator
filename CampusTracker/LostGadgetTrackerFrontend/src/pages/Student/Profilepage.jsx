// src/pages/Student/profile-pages/ProfilePage.jsx
import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile, uploadAvatar } from "../../Services/profileApi"; // ✅ FIX 3: added uploadAvatar

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:        "#050b1a",
  white:     "#f8fafc",
  orange:    "#f97316",
  orangeDim: "rgba(249,115,22,0.12)",
  border:    "rgba(249,115,22,0.15)",
  borderHot: "rgba(249,115,22,0.4)",
  slate400:  "#94a3b8",
  slate500:  "#64748b",
  slate600:  "#475569",
  red:       "#ef4444",
  green:     "#22c55e",
};

// ── JWT decoder ────────────────────────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

// ── Tiny shared components ─────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      border: `3px solid ${C.border}`,
      borderTopColor: C.orange,
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const SectionLabel = ({ children }) => (
  <p style={{
    color: C.orange, fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 2, margin: 0,
  }}>{children}</p>
);

const Badge = ({ status }) => {
  const isActive = status === "ACTIVE";
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)",
      color: isActive ? C.green : C.red,
      border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)"}`,
    }}>{isActive ? "Active" : "Disabled"}</span>
  );
};

// ── EditProfileModal ───────────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const fileRef = useRef();
  const [form, setForm]       = useState({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { avatarUrl } = await uploadAvatar(file); // ✅ now properly imported
      setForm((p) => ({ ...p, avatarUrl }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const updated = await updateProfile({
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        department: form.department,
      });
      onSave({ ...form, ...updated });
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name?.split(" ").map((w) => w[0]).join("").toUpperCase();

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "rgba(5,11,26,0.8)", border: "1px solid rgba(249,115,22,0.2)",
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
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: `1px solid ${C.border}`,
        }}>
          <div>
            <SectionLabel>Edit Profile</SectionLabel>
            <h3 style={{ color: C.white, fontSize: 18, fontWeight: 800, margin: "4px 0 0" }}>
              Update Your Info
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "6px 10px", color: C.slate400, cursor: "pointer", fontSize: 16,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Avatar picker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
            {form.avatarUrl ? (
              <img src={form.avatarUrl} alt="" style={{
                width: 72, height: 72, borderRadius: 16, objectFit: "cover",
                border: `2px solid ${C.border}`,
              }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: `linear-gradient(135deg, ${C.orange}, #ea580c)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, fontWeight: 900, color: "#fff",
              }}>{initials}</div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} style={{
              background: "none", border: "none", color: C.orange,
              fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>📷 Change Photo</button>
            <input
              ref={fileRef} type="file" accept="image/*"
              style={{ display: "none" }} onChange={handleFileChange}
            />
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { name: "name",       label: "Full Name",  type: "text"  },
              { name: "email",      label: "Email",      type: "email" },
              { name: "phone",      label: "Phone",      type: "text"  },
              { name: "department", label: "Department", type: "text"  },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label style={{
                  display: "block", color: C.slate500, fontSize: 11,
                  fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6,
                }}>{label}</label>
                <input
                  type={type} name={name} value={form[name] || ""}
                  onChange={(e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(249,115,22,0.2)")}
                />
              </div>
            ))}
          </div>

          {error   && <p style={{ color: C.red,   fontSize: 13, marginTop: 12 }}>{error}</p>}
          {success && (
            <p style={{ color: C.green, fontSize: 13, marginTop: 12, textAlign: "center", fontWeight: 700 }}>
              ✓ Profile updated!
            </p>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", marginTop: 20, padding: "12px",
            background: loading ? "rgba(249,115,22,0.5)" : C.orange,
            border: "none", borderRadius: 10, color: "#fff",
            fontWeight: 800, fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
          }}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── ProfilePage ────────────────────────────────────────────────────────────────
// ✅ FIX 2: accepts profile + onSave from parent (Profile.jsx) to avoid double fetch
export default function ProfilePage({ profile: initialProfile, onSave }) {
  const [profile,  setProfile]  = useState(initialProfile || null);
  const [loading,  setLoading]  = useState(!initialProfile); // skip spinner if parent passed data
  const [error,    setError]    = useState("");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (initialProfile) return; // ✅ skip self-fetch if parent already supplied profile
    fetchProfile();
  }, []);

  // ✅ FIX 1: decode JWT token to get email instead of reading non-existent "user" key
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in. Please log in again.");

      const decoded = decodeToken(token);
      const email   = decoded?.email || decoded?.sub || "";
      if (!email) throw new Error("Could not read email from token. Please log in again.");

      const data = await getProfile(email);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX 2: bubble save up to parent via onSave prop
  const handleSave = (updated) => {
    setProfile((p) => ({ ...p, ...updated }));
    onSave?.(updated);
    setEditOpen(false);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{
      background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`,
      borderRadius: 20, padding: 40,
    }}>
      <Spinner />
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{
      background: "rgba(15,23,42,0.8)", border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 20, padding: 40, textAlign: "center",
    }}>
      <p style={{ color: C.red, fontSize: 15, marginBottom: 12 }}>{error}</p>
      <button onClick={fetchProfile} style={{
        padding: "8px 20px", background: C.orangeDim,
        border: `1px solid ${C.border}`, borderRadius: 8,
        color: C.orange, fontWeight: 700, cursor: "pointer",
      }}>Retry</button>
    </div>
  );

  if (!profile) return null;

  const initials = profile.name?.split(" ").map((w) => w[0]).join("").toUpperCase();

  // ── Profile card ─────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{
        background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`,
        borderRadius: 20, overflow: "hidden",
      }}>
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
          {/* Avatar + Edit button */}
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: -36, marginBottom: 20,
          }}>
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
            <button
              onClick={() => setEditOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px",
                background: C.orangeDim, border: `1px solid ${C.border}`,
                borderRadius: 10, color: C.orange,
                fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background  = "rgba(249,115,22,0.22)";
                e.currentTarget.style.borderColor = C.orange;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = C.orangeDim;
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              ✏️ Edit Profile
            </button>
          </div>

          <h2 style={{ color: C.white, fontSize: 22, fontWeight: 900, margin: "0 0 4px" }}>
            {profile.name}
          </h2>
          <p style={{ color: C.slate500, fontSize: 14, margin: "0 0 20px" }}>
            {profile.department}{profile.year ? ` · ${profile.year}` : ""}
          </p>

          {/* Info grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}>
            {[
              { icon: "📧", label: "Email",       value: profile.email      },
              { icon: "🎓", label: "Roll Number", value: profile.rollNumber },
              { icon: "📱", label: "Phone",       value: profile.phone      },
              { icon: "🏷️", label: "Role",        value: profile.role       },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{
                background: "rgba(5,11,26,0.6)",
                border: "1px solid rgba(249,115,22,0.08)",
                borderRadius: 12, padding: "12px 14px",
                display: "flex", alignItems: "flex-start", gap: 10,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }}>{icon}</span>
                <div>
                  <p style={{
                    color: C.slate600, fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: 1, margin: "0 0 3px",
                  }}>{label}</p>
                  <p style={{ color: C.slate400, fontSize: 13, fontWeight: 600, margin: 0 }}>
                    {value || "—"}
                  </p>
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

      {/* Edit modal */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSave={handleSave} // ✅ FIX 2: uses handleSave which bubbles up to parent
        />
      )}
    </>
  );
}