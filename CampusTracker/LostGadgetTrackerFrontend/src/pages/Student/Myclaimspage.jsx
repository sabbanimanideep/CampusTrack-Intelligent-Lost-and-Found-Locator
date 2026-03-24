// src/pages/Student/profile-pages/MyClaimsPage.jsx
import { useEffect, useState } from "react";
import { Badge, C, formatDate, SectionLabel, Spinner } from "./Profileconstants";

export default function MyClaimsPage() {
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
    <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
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
                <tr key={c.id}
                  style={{ borderBottom: i < claims.length - 1 ? `1px solid rgba(249,115,22,0.05)` : "none" }}
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