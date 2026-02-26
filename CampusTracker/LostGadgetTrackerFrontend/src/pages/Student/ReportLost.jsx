import { useState } from "react";
import { reportLostItem } from "./../../Services/lostFoundService";

const CATEGORIES = ["electronics", "documents", "clothing", "keys", "accessories", "other"];

const INITIAL_FORM = {
  name: "",
  description: "",
  date: "",
  location: "",
  category: "electronics",
  contact: "",
  reward: "",
};

const CATEGORY_ICONS = {
  electronics: "💻",
  documents: "📄",
  clothing: "👕",
  keys: "🔑",
  accessories: "🎒",
  other: "📦",
};

function InputField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Item name is required.";
  if (!form.description.trim()) errs.description = "Please describe the item.";
  if (!form.location.trim()) errs.location = "Last seen location is required.";
  if (!form.date) errs.date = "Date is required.";
  if (form.date && new Date(form.date) > new Date()) errs.date = "Date cannot be in the future.";
  if (form.contact && !/^\d{10}$/.test(form.contact.replace(/\s/g, ""))) {
    errs.contact = "Enter a valid 10-digit phone number.";
  }
  return errs;
}

export default function ReportLost() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5 MB." }));
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (image) fd.append("image", image);

    try {
      await reportLostItem(fd);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to submit. Please try again.";
      setErrors({ global: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setImage(null);
    setImagePreview(null);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Report Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Your lost item has been reported. We'll notify you if someone finds a match.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-semibold transition-colors"
            >
              Report Another
            </button>
            <a
              href="/student/browse"
              className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Browse Found Items
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-6">
          <a href="/" className="text-orange-500 text-sm font-medium hover:underline">
            ← Back to Home
          </a>
          <h1 className="text-3xl font-extrabold text-white mt-3">Report Lost Item</h1>
          <p className="text-slate-400 text-sm mt-1">
            Fill in the details to help us find your item.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
        >
          {errors.global && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
              {errors.global}
            </div>
          )}

          {/* Item Name */}
          <InputField label="Item Name *" error={errors.name}>
            <input
              name="name"
              value={form.name}
              placeholder="e.g. MacBook Pro 14-inch"
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                errors.name ? "border-red-500" : "border-slate-700 focus:border-orange-500"
              }`}
            />
          </InputField>

          {/* Category */}
          <InputField label="Category *" error={errors.category}>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                  className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    form.category === cat
                      ? "bg-orange-500/20 border-orange-500 text-orange-300"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <span className="text-lg mb-0.5">{CATEGORY_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </InputField>

          {/* Description */}
          <InputField label="Description *" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              placeholder="Describe the item — color, brand, serial number, distinctive marks…"
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border resize-none transition-colors focus:outline-none ${
                errors.description ? "border-red-500" : "border-slate-700 focus:border-orange-500"
              }`}
            />
          </InputField>

          {/* Date + Location row */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date Lost *" error={errors.date}>
              <input
                type="date"
                name="date"
                value={form.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white border transition-colors focus:outline-none ${
                  errors.date ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                }`}
              />
            </InputField>

            <InputField label="Last Seen Location *" error={errors.location}>
              <input
                name="location"
                value={form.location}
                placeholder="e.g. Library 2nd Floor"
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                  errors.location ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                }`}
              />
            </InputField>
          </div>

          {/* Contact + Reward row */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Contact Number" error={errors.contact}>
              <input
                name="contact"
                value={form.contact}
                placeholder="10-digit number"
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                  errors.contact ? "border-red-500" : "border-slate-700 focus:border-orange-500"
                }`}
              />
            </InputField>

            <InputField label="Reward Offered (₹)" error={errors.reward}>
              <input
                name="reward"
                value={form.reward}
                type="number"
                min="0"
                placeholder="Optional"
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:border-orange-500 transition-colors focus:outline-none"
              />
            </InputField>
          </div>

          {/* Image upload */}
          <InputField label="Attach Image" error={errors.image}>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-orange-500/50 rounded-xl cursor-pointer transition-colors bg-slate-800/50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-1">📷</div>
                  <p className="text-slate-400 text-xs">Click to upload (max 5 MB)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImage(null); setImagePreview(null); }}
                className="text-xs text-red-400 hover:underline mt-1"
              >
                Remove image
              </button>
            )}
          </InputField>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Lost Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}