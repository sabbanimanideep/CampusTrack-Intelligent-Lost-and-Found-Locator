// src/pages/Student/profile-pages/MatchingPage.jsx
import { useEffect, useState } from "react";
import { getMatches } from "../../Services/matchingApi";
import { C, SectionLabel, Spinner } from "./Profileconstants";

export default function MatchingPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {

  const fetchMatches = async () => {
    try {
      const stored = localStorage.getItem("user");

      let email = null;

      if (stored) {
        const user = JSON.parse(stored);

        if (user.token) {
          const payload = JSON.parse(atob(user.token.split(".")[1]));
          email = payload.sub;
        }
      }

      console.log("Decoded email:", email);

      if (!email) {
        throw new Error("Email not found in token");
      }

      const data = await getMatches(email);
      setMatches(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchMatches();

}, []);

  return (
    <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Matching</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0" }}>Item Matches</h3>
        <p style={{ color: C.slate500, fontSize: 13, margin: "6px 0 0" }}>
          Potential matches between your lost reports and found items.
        </p>
      </div>

      {loading ? <Spinner /> : error ? (
        <p style={{ color: C.red, textAlign: "center", padding: "24px 0" }}>{error}</p>
      ) : matches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: C.slate600 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.slate400, marginBottom: 6 }}>No matches yet</p>
          <p style={{ fontSize: 13 }}>When a found item matches your lost report, it will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {matches.map((m) => (
            <div key={m.lostId} style={{
              background: "rgba(5,11,26,0.6)", border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "16px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              transition: "border-color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = C.borderHot}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
            >
              <div>
                <p style={{ color: C.white, fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{m.lostName}</p>
                <p style={{ color: C.slate500, fontSize: 12, margin: 0 }}>Matched with: {m.foundName}</p>
              </div>
              <span style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)",
              }}>
                {Math.round(m.score * 100)}% match
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}