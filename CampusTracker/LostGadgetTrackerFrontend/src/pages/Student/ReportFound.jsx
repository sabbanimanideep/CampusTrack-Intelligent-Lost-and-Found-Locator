import { useState } from "react";
import { reportFoundItem } from "../../Services/foundItemApi";

const CATEGORIES = ["electronics", "documents", "clothing", "keys", "accessories", "other"];

const INITIAL_FORM = {
  itemName: "",
  description: "",
  foundLocation: "",
  category: "electronics",
  contactNumber: "",
  reporterEmail: "",
  dateFound: new Date().toISOString().split("T")[0],
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

function validate(form, image) {
  const errs = {};
  if (!form.itemName.trim()) errs.itemName = "Item name is required.";
  if (!form.description.trim()) errs.description = "Please describe the item.";
  if (!form.foundLocation.trim()) errs.foundLocation = "Found location is required.";
  if (!form.dateFound) errs.dateFound = "Date is required.";
  if (!form.reporterEmail.trim()) {
    errs.reporterEmail = "Your email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reporterEmail)) {
    errs.reporterEmail = "Enter a valid email address.";
  }
  if (
    form.contactNumber &&
    !/^\d{10}$/.test(form.contactNumber.replace(/\s/g, ""))
  ) {
    errs.contactNumber = "Enter a valid 10-digit phone number.";
  }
  if (!image) errs.image = "An image of the found item is required.";
  return errs;
}

export default function ReportFound() {
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
    const errs = validate(form, image);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await reportFoundItem({
        itemName: form.itemName,
        category: form.category,
        description: form.description,
        dateFound: form.dateFound,
        foundLocation: form.foundLocation,
        contactNumber: form.contactNumber || undefined,
        reporterEmail: form.reporterEmail,
        file: image,
      });
      setSubmitted(true);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to submit. Please try again.";
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
        <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Thank You!</h2>
          <p className="text-slate-400 mb-6">
            Your found item report has been submitted. We'll notify the owner and you'll be a campus hero!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white rounded-xl font-semibold transition-colors"
            >
              Report Another
            </button>
            <a
              href="/student/browse"
              className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Browse All Items
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
          <a href="/" className="text-green-400 text-sm font-medium hover:underline">
            ← Back to Home
          </a>
          <h1 className="text-3xl font-extrabold text-white mt-3">Report Found Item</h1>
          <p className="text-slate-400 text-sm mt-1">
            Help reunite someone with their lost belongings.
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
          <InputField label="Item Name *" error={errors.itemName}>
            <input
              name="itemName"
              value={form.itemName}
              placeholder="e.g. Black wallet with ID cards"
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                errors.itemName ? "border-red-500" : "border-slate-700 focus:border-green-500"
              }`}
            />
          </InputField>

          {/* Category */}
          <InputField label="Category *">
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                  className={`flex flex-col items-center py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    form.category === cat
                      ? "bg-green-500/20 border-green-500 text-green-300"
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
              placeholder="Describe what you found — color, brand, condition, any labels or IDs…"
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border resize-none transition-colors focus:outline-none ${
                errors.description ? "border-red-500" : "border-slate-700 focus:border-green-500"
              }`}
            />
          </InputField>

          {/* Date + Location */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date Found *" error={errors.dateFound}>
              <input
                type="date"
                name="dateFound"
                value={form.dateFound}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white border transition-colors focus:outline-none ${
                  errors.dateFound ? "border-red-500" : "border-slate-700 focus:border-green-500"
                }`}
              />
            </InputField>

            <InputField label="Found Location *" error={errors.foundLocation}>
              <input
                name="foundLocation"
                value={form.foundLocation}
                placeholder="e.g. Cafeteria, Table 4"
                onChange={handleChange}
                className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                  errors.foundLocation ? "border-red-500" : "border-slate-700 focus:border-green-500"
                }`}
              />
            </InputField>
          </div>

          {/* Reporter Email */}
          <InputField label="Your Email *" error={errors.reporterEmail}>
            <input
              name="reporterEmail"
              type="email"
              value={form.reporterEmail}
              placeholder="you@example.com"
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                errors.reporterEmail ? "border-red-500" : "border-slate-700 focus:border-green-500"
              }`}
            />
          </InputField>

          {/* Contact */}
          <InputField label="Your Contact Number" error={errors.contactNumber}>
            <input
              name="contactNumber"
              value={form.contactNumber}
              placeholder="Optional — so the owner can reach you"
              onChange={handleChange}
              className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border transition-colors focus:outline-none ${
                errors.contactNumber ? "border-red-500" : "border-slate-700 focus:border-green-500"
              }`}
            />
          </InputField>

          {/* Image upload */}
          <InputField label="Attach Image *" error={errors.image}>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-green-500/50 rounded-xl cursor-pointer transition-colors bg-slate-800/50">
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
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
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
            className="w-full py-3 bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Found Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}