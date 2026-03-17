// src/App.jsx
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

import AdminRoute from "./component/AdminRoute";
import Home from "./Home";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";

import BrowseItems from "./pages/Student/BrowseItems";
import StudentProfile from "./pages/Student/Profile";
import ReportFound from "./pages/Student/ReportFound";
import ReportLost from "./pages/Student/ReportLost";

// ── Simple Placeholder (for future pages only) ─────────
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-slate-400 mb-4">This page is under construction.</p>
      <Link to="/" className="text-orange-500 hover:underline text-sm">
        ← Back to Home
      </Link>
    </div>
  </div>
);

// ── Protected Route ─────────────────────────────────────
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("user");
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// ── App ─────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ───────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── Student (Public Browse) ─────────────────────── */}
      <Route path="/student/browse" element={<BrowseItems />} />

      {/* ── Student (Protected) ─────────────────────────── */}
      <Route
        path="/student/report-lost"
        element={
          <ProtectedRoute>
            <ReportLost />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/report-found"
        element={
          <ProtectedRoute>
            <ReportFound />
          </ProtectedRoute>
        }
      />

      {/* ── User Dashboard (Protected, Placeholder for now) ─ */}
      <Route
        path="/my-gadgets"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="My Gadgets" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="My Reports" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Notifications" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

      {/* ── Fallback: Redirect unknown URLs to Home ─────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}