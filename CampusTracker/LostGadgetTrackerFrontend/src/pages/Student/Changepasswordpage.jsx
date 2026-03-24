// src/pages/Student/profile-pages/ChangePasswordPage.jsx
import { useState } from "react";
import { C, SectionLabel } from "./Profileconstants";

export default function ChangePasswordPage() {
  const [form, setForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(null);
  const [errMsg, setErrMsg]   = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword)                     e.currentPassword = "Required";
    if (form.newPassword.length < 8)               e.newPassword     = "At least 8 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setStatus(null);
    try {
      await changePassword(form);
      setStatus("success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus("error"); setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
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
      <input
        type="password" value={form[name]} placeholder={placeholder}
        style={inputStyle(!!errors[name])}
        onChange={(e) => { setForm((p) => ({ ...p, [name]: e.target.value })); setErrors((p) => ({ ...p, [name]: "" })); }}
        onFocus={(e) => { if (!errors[name]) e.target.style.borderColor = C.orange; }}
        onBlur={(e)  => { if (!errors[name]) e.target.style.borderColor = "rgba(249,115,22,0.2)"; }}
      />
      {errors[name] && <p style={{ color: C.red, fontSize: 12, marginTop: 4 }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <SectionLabel>Security</SectionLabel>
        <h3 style={{ color: C.white, fontSize: 20, fontWeight: 800, margin: "6px 0 0" }}>Change Password</h3>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
        <Field name="currentPassword" label="Current Password" placeholder="Enter current password" />
        <Field name="newPassword"     label="New Password"     placeholder="Min. 8 characters"      />
        <Field name="confirmPassword" label="Confirm Password" placeholder="Re-enter new password"  />

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
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = C.orange;  }}
        >
          {loading ? "Updating…" : "🔒 Update Password"}
        </button>
      </form>
    </div>
  );
}