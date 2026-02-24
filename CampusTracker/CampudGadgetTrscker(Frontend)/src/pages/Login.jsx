import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./authService";

const CAMPUS_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx9CYw5Jzsh-fd-_9CRDJYX9z9FMwlzeETIw&s";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ emailOrRollNo: email, password });
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Login failed");
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="relative z-10 h-full flex items-center justify-center px-10">
          <div className="text-white max-w-md">
            <h1 className="text-4xl font-bold mb-4">Campus Gadget Tracker</h1>
            <p className="text-slate-300">
              Track your gadgets, report lost devices, and stay secure across the campus.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400 mb-6">Sign in to your CampusTrack account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email / Roll No</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="21CS001 or rollno@mlrit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}