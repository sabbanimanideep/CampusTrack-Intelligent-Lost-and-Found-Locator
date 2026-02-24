import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HERO_IMG = "https://mlrit.ac.in/wp-content/uploads/2022/04/about-banner2.jpg";

function Navbar({ active, setActive }) {
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
        background: scrolled ? "rgba(5,11,26,0.95)" : "rgba(5,11,26,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(249,115,22,0.15)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "#f97316", fontWeight: 900, fontSize: 18 }}>
          Campus Gadget Tracker
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              style={{
                color: active === link.label ? "#f97316" : "#cbd5e1",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {link.label}
            </a>
          ))}

          {isLoggedIn ? (
            <>
              <a
                href="/profile"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 16px",
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                style={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Login
              </a>
              <a
                href="/register"
                style={{
                  padding: "6px 16px",
                  background: "#f97316",
                  color: "#fff",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Register
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${HERO_IMG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        paddingTop: 80,
      }}
    >
      <div
        style={{
          background: "rgba(5,11,26,0.75)",
          backdropFilter: "blur(10px)",
          padding: 40,
          borderRadius: 16,
          marginLeft: 40,
          maxWidth: 520,
        }}
      >
        <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900 }}>
          Campus Gadget Tracker
        </h1>
        <p style={{ color: "#cbd5e1", marginTop: 12 }}>
          Track, report lost gadgets, and manage your devices securely across campus.
        </p>
        <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
          <a
            href="#track"
            style={{
              padding: "12px 20px",
              background: "#f97316",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Start Tracking
          </a>
          <a
            href="#lost"
            style={{
              padding: "12px 20px",
              border: "1px solid #fff",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Report Lost
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState("Home");

  return (
    <>
      <Navbar active={active} setActive={setActive} />
      <Hero />
    </>
  );
}