import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../../Services/profileApi";
import ChangePasswordPage from "./Changepasswordpage";
import MatchingPage from "./Matchingpage";
import MyClaimsPage from "./Myclaimspage";
import MyReportsPage from "./Myreportspage";
import NotificationsPage from "./Notificationspage";
import { C, SectionLabel, Spinner } from "./Profileconstants";
import ProfilePage from "./Profilepage";

// ── Decode JWT (no library needed) ────────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate   = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          <span style={{ color: C.orange, fontWeight: 900, fontSize: 17, letterSpacing: "-0.3px" }}>Campus Tracker</span>
        </Link>

        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link to="/"               style={{ color: C.slate400, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Home</Link>
          <Link to="/student/browse" style={{ color: C.slate400, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Browse</Link>
          {isLoggedIn ? (
            <>
              <span style={{ color: C.orange, fontWeight: 700, fontSize: 14, borderBottom: `2px solid ${C.orange}`, paddingBottom: 2 }}>Profile</span>
              <button onClick={handleLogout} style={{
                padding: "7px 18px", background: "transparent",
                color: C.orange, border: `1.5px solid ${C.orange}`,
                borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.target.style.background = C.orange; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = C.orange; }}
              >Logout</button>
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

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: "profile",       label: "👤  Profile"       },
  { key: "password",      label: "🔒  Password"      },
  { key: "reports",       label: "📋  My Reports"    },
  { key: "notifications", label: "🔔  Notifications" },
  { key: "claims",        label: "✅  My Claims"     },
  { key: "matching",      label: "🔗  Matching"      },
];

// ── Main shell ─────────────────────────────────────────────────────────────────
export default function StudentProfile() {
  const [profile,       setProfile]       = useState(null);
  const [loading,       setLoading]       = useState(true);   // ← starts true
  const [profileError,  setProfileError]  = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  // ── FETCH PROFILE ON MOUNT ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setProfileError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setProfileError("No logged-in user found. Please log in again.");
          return;
        }
        const decoded = decodeToken(token);
        // Spring Boot JWTs use "sub" or "email" claim for the email
        const email = decoded?.email || decoded?.sub || "";
        if (!email) {
          setProfileError("Could not read email from token. Please log in again.");
          return;
        }
        const data = await getProfile(email);
        setProfile(data);
      } catch (err) {
        setProfileError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const renderPage = () => {
    if (loading) return (
      <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 40 }}>
        <Spinner />
      </div>
    );
    if (profileError) return (
      <div style={{
        background: "rgba(15,23,42,0.8)", border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 20, padding: 40, textAlign: "center",
      }}>
        <p style={{ color: C.red, fontSize: 15 }}>{profileError}</p>
        <button onClick={() => window.location.reload()} style={{
          marginTop: 12, padding: "8px 20px", background: C.orangeDim,
          border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.orange, fontWeight: 700, cursor: "pointer",
        }}>Retry</button>
      </div>
    );
    switch (activeSection) {
      case "profile":       return <ProfilePage       profile={profile} onSave={(u) => setProfile((p) => ({ ...p, ...u }))} />;
      case "password":      return <ChangePasswordPage />;
      case "reports":       return <MyReportsPage />;
      case "notifications": return <NotificationsPage />;
      case "claims":        return <MyClaimsPage />;
      case "matching":      return <MatchingPage />;
      default:              return null;
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.white }}>
      <Navbar />

      {/* Page header strip */}
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

        {/* Desktop Sidebar */}
        <aside className="profile-sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 80 }}>
          <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 16, padding: 8 }}>
            {NAV_ITEMS.map(({ key, label }) => (
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

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile tabs */}
          <div className="profile-mobile-tabs" style={{ display: "none", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
            {NAV_ITEMS.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveSection(key)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: 10,
                background: activeSection === key ? C.orange : "rgba(15,23,42,0.8)",
                border: `1px solid ${activeSection === key ? C.orange : C.border}`,
                color: activeSection === key ? "#fff" : C.slate400,
                fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
              }}>{label}</button>
            ))}
          </div>

          {renderPage()}
        </main>
      </div>

      {/* Footer */}
      <footer style={{
        background: "#020810", borderTop: "1px solid rgba(249,115,22,0.1)",
        padding: "32px 24px", textAlign: "center", marginTop: 40,
      }}>
        <p style={{ color: C.slate600, fontSize: 14, margin: 0 }}>
          © 2026 Campus Gadget Tracker — MLRIT. All rights reserved.
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .profile-sidebar     { display: none !important; }
          .profile-mobile-tabs { display: flex !important; }
        }
      `}</style>
    </div>
  );
}