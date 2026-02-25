import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordResetOtp, resetPasswordWithOtp, verifyPasswordResetOtp } from "./authService";

const emailRegex = /^[a-zA-Z0-9._%+-]+@mlrit\.ac\.in$/;

const CAMPUS_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx9CYw5Jzsh-fd-_9CRDJYX9z9FMwlzeETIw&s";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateStep1 = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(email.trim())) e.email = "Use your mlrit.ac.in email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!otp.trim()) e.otp = "OTP is required";
    else if (!/^\d{4,8}$/.test(otp.trim())) e.otp = "OTP must be 4 to 8 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!otp.trim()) e.otp = "OTP is required";
    if (!newPassword) e.newPassword = "New password is required";
    else if (newPassword.length < 8) e.newPassword = "Password must be at least 8 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== newPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const res = await requestPasswordResetOtp({ email: email.trim() });
      setMessage(res?.message || "OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage("");
      alert(err.response?.data?.message || err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const res = await verifyPasswordResetOtp({ email: email.trim(), otp: otp.trim() });
      setMessage(res?.message || "OTP verified. Set your new password.");
      setStep(3);
    } catch (err) {
      setMessage("");
      alert(err.response?.data?.message || err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      alert(res?.message || "Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const stepTitle =
    step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Create New Password";

  const stepSubTitle =
    step === 1
      ? "Enter your registered email to receive OTP"
      : step === 2
        ? "Enter the OTP sent to your email"
        : "Set a secure password for your account";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-950">
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
              Recover your account securely with one-time password verification.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{stepTitle}</h2>
            <p className="text-slate-400 text-sm">{stepSubTitle}</p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={`h-1.5 flex-1 rounded ${step >= 1 ? "bg-orange-500" : "bg-slate-700"}`} />
              <span className={`h-1.5 flex-1 rounded ${step >= 2 ? "bg-orange-500" : "bg-slate-700"}`} />
              <span className={`h-1.5 flex-1 rounded ${step >= 3 ? "bg-orange-500" : "bg-slate-700"}`} />
            </div>
          </div>

          {message && (
            <div className="mb-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm px-3 py-2">
              {message}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-4" onSubmit={handleSendOtp} noValidate>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="rollno@mlrit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4" onSubmit={handleVerifyOtp} noValidate>
              <div>
                <label className="block text-sm text-slate-300 mb-1">OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  maxLength={8}
                />
                {errors.otp && <p className="text-xs text-red-400 mt-1">{errors.otp}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSendOtp}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition disabled:opacity-60 border border-slate-700"
              >
                Resend OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
              <div>
                <label className="block text-sm text-slate-300 mb-1">OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  maxLength={8}
                />
                {errors.otp && <p className="text-xs text-red-400 mt-1">{errors.otp}</p>}
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-sm text-slate-400 text-center mt-6">
            Back to{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
