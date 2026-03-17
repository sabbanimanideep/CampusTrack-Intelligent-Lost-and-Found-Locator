import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HERO_IMG = "https://mlrit.ac.in/wp-content/uploads/2022/04/about-banner2.jpg";

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Track", href: "#track" },
    { label: "Lost & Found", href: "#lost" },
    { label: "My Gadgets", href: "#gadgets" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(5,11,26,0.97)" : "rgba(5,11,26,0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(249,115,22,0.2)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🎯</span>
          <span style={{ color: "#f97316", fontWeight: 900, fontSize: 17, letterSpacing: "-0.3px" }}>
            Campus Tracker
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              style={{
                color: active === link.label ? "#f97316" : "#94a3b8",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                transition: "color 0.2s",
                borderBottom: active === link.label ? "2px solid #f97316" : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              {link.label}
            </a>
          ))}

          {isLoggedIn ? (
            <>
              <Link to="/profile" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "7px 18px",
                  background: "transparent",
                  color: "#f97316",
                  border: "1.5px solid #f97316",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = "#f97316"; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#f97316"; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: "#94a3b8", textDecoration: "none", fontWeight: 600, fontSize: 14 }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "7px 18px",
                  background: "#f97316",
                  color: "#fff",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(to bottom right, rgba(5,11,26,0.85), rgba(5,11,26,0.6)), url(${HERO_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <div style={{
        position: "absolute", top: "20%", right: "10%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%" }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 100, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ color: "#f97316", fontSize: 13, fontWeight: 600 }}>Live tracking active</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
            Never Lose Your
            <span style={{ color: "#f97316" }}> Gadgets </span>
            On Campus
          </h1>
          <p style={{ color: "#94a3b8", marginTop: 16, fontSize: 17, lineHeight: 1.7, maxWidth: 480 }}>
            Report, track, and recover lost devices across MLRIT campus. Join thousands of students keeping their gadgets safe.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/student/browse")}
              style={{
                padding: "13px 24px",
                background: "#f97316",
                color: "#fff",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              🔍 Browse Found Items
            </button>
            <button
              onClick={() => navigate("/student/report-lost")}
              style={{
                padding: "13px 24px",
                border: "1.5px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              📋 Report Lost Item
            </button>
          </div>

          {/* Stats row */}
          <div style={{ marginTop: 44, display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { value: "1,200+", label: "Items Tracked" },
              { value: "87%", label: "Recovery Rate" },
              { value: "3,400+", label: "Students" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ color: "#f97316", fontWeight: 900, fontSize: 26 }}>{stat.value}</div>
                <div style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Track Section ────────────────────────────────────────────────────────
function TrackSection() {
  const steps = [
    { icon: "📝", title: "Report Your Device", desc: "Add your gadget with serial number, description, and a photo to our secure registry." },
    { icon: "🔔", title: "Get Instant Alerts", desc: "Receive real-time notifications if your device is found or someone reports a match." },
    { icon: "✅", title: "Recover Safely", desc: "Coordinate a secure handover verified through your campus ID." },
  ];

  return (
    <section id="track" style={{ background: "#050b1a", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ color: "#f97316", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>How It Works</span>
          <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 900, marginTop: 8 }}>Track in 3 Simple Steps</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(249,115,22,0.15)",
                borderRadius: 16,
                padding: 28,
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: -16, left: 24,
                width: 32, height: 32,
                background: "#f97316",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 14,
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 36, marginBottom: 14, marginTop: 8 }}>{step.icon}</div>
              <h3 style={{ color: "#fff", fontWeight: 800, marginBottom: 8, fontSize: 18 }}>{step.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lost & Found CTA Section ───────────────────────────────────────────
function LostFoundSection() {
  return (
    <section id="lost" style={{ background: "#080f20", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{ color: "#f97316", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Lost & Found</span>
          <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 900, marginTop: 8 }}>Lost Something? Found Something?</h2>
          <p style={{ color: "#64748b", marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>
            Our campus-wide lost and found network connects finders with owners quickly and securely.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Report Lost */}
          <Link to="/student/report-lost" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05))",
              border: "1px solid rgba(249,115,22,0.3)",
              borderRadius: 20,
              padding: 36,
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>😟</div>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Lost Something?</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14, marginBottom: 20 }}>
                Report your lost item with details and photos. We'll search our database and alert you on matches.
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#f97316", fontWeight: 700, fontSize: 14,
              }}>
                Report Lost Item →
              </span>
            </div>
          </Link>

          {/* Report Found */}
          <Link to="/student/report-found" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 20,
              padding: 36,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Found Something?</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14, marginBottom: 20 }}>
                Help a fellow student out! Log what you found and we'll connect you with the rightful owner.
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#22c55e", fontWeight: 700, fontSize: 14,
              }}>
                Report Found Item →
              </span>
            </div>
          </Link>

          {/* Browse */}
          <Link to="/student/browse" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 20,
              padding: 36,
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Browse Found Items</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 14, marginBottom: 20 }}>
                Check our collection of currently held found items. Your lost item might already be here.
              </p>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "#3b82f6", fontWeight: 700, fontSize: 14,
              }}>
                Browse Now →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#020810", borderTop: "1px solid rgba(249,115,22,0.1)", padding: "32px 24px", textAlign: "center" }}>
      <p style={{ color: "#334155", fontSize: 14 }}>
        © 2026 Campus Gadget Tracker — MLRIT. All rights reserved.
      </p>
    </footer>
  );
}

// ── Home (root) ───────────────────────────────────────────────────────
export default function Home() {
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const sections = ["home", "track", "lost", "gadgets"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const label = {
              home: "Home",
              track: "Track",
              lost: "Lost & Found",
              gadgets: "My Gadgets",
            }[entry.target.id];
            if (label) setActive(label);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#050b1a" }}>
      <Navbar active={active} setActive={setActive} />
      <Hero />
      <TrackSection />
      <LostFoundSection />
      <Footer />
    </div>
  );
}