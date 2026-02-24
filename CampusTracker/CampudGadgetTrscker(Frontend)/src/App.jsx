// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./ Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Optional placeholders (create later)
const MyGadgets = () => <div className="p-6">My Gadgets Page</div>;
const ReportLost = () => <div className="p-6">Report Lost Page</div>;
const MyReports = () => <div className="p-6">My Reports Page</div>;
const FindGadget = () => <div className="p-6">Find Gadget Page</div>;
const Notifications = () => <div className="p-6">Notifications Page</div>;
const Profile = () => <div className="p-6">Profile Page</div>;

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Feature pages (can protect later with auth) */}
      <Route path="/my-gadgets" element={<MyGadgets />} />
      <Route path="/report-lost" element={<ReportLost />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route path="/find-gadget" element={<FindGadget />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}