import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./authService";

const emailRegex = /^[a-zA-Z0-9._%+-]+@mlrit\.ac\.in$/;

const CAMPUS_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx9CYw5Jzsh-fd-_9CRDJYX9z9FMwlzeETIw&s";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNoOrEmpId, setRollNoOrEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(email)) e.email = "Use mlrit.ac.in email";
    if (!rollNoOrEmpId.trim()) e.rollNoOrEmpId = "Roll No / Employee ID is required";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!terms) e.terms = "You must accept the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await registerUser({ name, email, rollNoOrEmpId, password, role });
      alert(res);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950">
      {/* Left: Campus Image */}
      <div
        className="hidden md:block relative"
        style={{
          backgroundImage: `url(${CAMPUS_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center px-10">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-extrabold mb-4">Campus Gadget Tracker</h1>
            <p className="text-slate-300">
              Create your account and start protecting your gadgets across campus.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-1 text-center">Create Account</h2>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Join the CampusTrackingGadgets community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email + Roll No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  placeholder="rollno@mlrit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Roll No / Emp ID"
                  value={rollNoOrEmpId}
                  onChange={(e) => setRollNoOrEmpId(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.rollNoOrEmpId && (
                  <p className="text-xs text-red-400 mt-1">{errors.rollNoOrEmpId}</p>
                )}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="STUDENT">Student</option>
            </select>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="accent-orange-500 mt-1"
              />
              <span>
                I agree to the{" "}
                <span className="text-orange-400 hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-orange-400 hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}