import { useCallback, useEffect, useState } from "react";
import axios from "../../Services/axiosinstance";
import { claimFoundItem, getAllFoundItems, getFoundItemImage } from "../../Services/browseItem";
import { sendChatRequest } from "../../Services/chatRequestApi"; // ← real API

// ─── Lost-item helpers ────────────────────────────────────────────────────────
const getAllLostItems = async () => {
  const res = await axios.get("/api/lost-items/all");
  return (res.data || []).map((item) => ({
    ...item,
    name: item.itemName || item.name,
    location: item.location || item.lastSeenLocation || null,
    createdAt: item.createdAt || item.dateLost || null,
    _type: "lost",
  }));
};

const getLostItemImage = (id) =>
  `http://localhost:8089/api/lost-items/image/${id}`;

// ─── Get the logged-in user's username ───────────────────────────────────────
// Adjust this to match how your app stores the current user
// (localStorage, AuthContext, Redux, etc.)
function getCurrentUsername() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.username || user?.email || localStorage.getItem("username") || "";
  } catch {
    return localStorage.getItem("username") || "";
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Electronics", "Documents", "Clothing", "Keys", "Accessories", "Other"];
const TABS = ["All", "Lost", "Found"];

// ─── Sub-components ───────────────────────────────────────────────────────────
const TypeBadge = ({ type }) =>
  type === "lost" ? (
    <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-widest uppercase bg-red-500/20 text-red-300 border-red-500/30">
      Lost
    </span>
  ) : (
    <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
      Found
    </span>
  );

const CategoryBadge = ({ category }) => {
  const colors = {
    electronics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    documents:   "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    clothing:    "bg-purple-500/20 text-purple-300 border-purple-500/30",
    keys:        "bg-green-500/20 text-green-300 border-green-500/30",
    accessories: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    other:       "bg-slate-500/20 text-slate-300 border-slate-500/30",
  };
  const cls = colors[category?.toLowerCase()] || colors.other;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}>
      {category}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="bg-slate-900 rounded-2xl p-5 animate-pulse border border-slate-800">
    <div className="h-40 bg-slate-800 rounded-xl mb-4" />
    <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-800 rounded w-full mb-1" />
    <div className="h-3 bg-slate-800 rounded w-2/3 mb-3" />
    <div className="h-6 bg-slate-800 rounded-full w-24" />
  </div>
);

const EmptyState = ({ query }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-bold text-white mb-2">
      {query ? `No items matching "${query}"` : "No items yet"}
    </h3>
    <p className="text-slate-400 max-w-sm">
      {query
        ? "Try adjusting your search or filter criteria."
        : "Be the first to report a lost or found item and help someone out!"}
    </p>
  </div>
);

// ─── Chat Request Modal ───────────────────────────────────────────────────────
function ChatRequestModal({ item, onClose, onSuccess }) {
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState(null);

  // receiver = the person who posted the item.
  // ⚠️ Adjust the field names below to match what your backend returns.
  // Common Spring Boot field names: postedBy, username, reportedBy, ownerUsername, userEmail
  const receiver =
    item.postedBy      ||
    item.username      ||
    item.reportedBy    ||
    item.ownerUsername ||
    item.userEmail     ||
    "";

  const sender = getCurrentUsername();

  async function handleSend() {
    // Guard: must be logged in
    if (!sender) {
      setError("You must be logged in to send a chat request.");
      return;
    }
    // Guard: item must have an owner
    if (!receiver) {
      setError("Cannot identify the item owner. Please try again later.");
      return;
    }
    // Guard: can't request your own item
    if (sender === receiver) {
      setError("You cannot send a chat request for your own item.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // ✅ Calls: POST /chat-request/send?sender=X&receiver=Y&itemId=Z
      await sendChatRequest(sender, receiver, item.id);
      onSuccess();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data           ||
        "Failed to send request. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSending(false);
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,11,26,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl"
        style={{ background: "#0d1628", animation: "fadeInModal 0.18s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xl">💬</span>
            <div>
              <div className="text-white font-bold text-base">Request to Chat</div>
              <div className="text-orange-400 text-xs font-semibold mt-0.5">📎 {item.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Item preview strip */}
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <TypeBadge type={item._type} />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{item.name}</div>
              {item.location && (
                <div className="text-slate-500 text-xs mt-0.5 truncate">📍 {item.location}</div>
              )}
            </div>
          </div>

          {/* Sender → Receiver pills */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "#111c2e", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                From (You)
              </div>
              <div className="text-white text-sm font-semibold truncate">
                {sender || <span className="text-red-400 italic">Not logged in</span>}
              </div>
            </div>
            <div
              className="rounded-xl p-3"
              style={{ background: "#111c2e", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                To (Owner)
              </div>
              <div className="text-white text-sm font-semibold truncate">
                {receiver || <span className="text-slate-500 italic">Unknown</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className="rounded-xl px-4 py-3 text-sm text-slate-400 leading-relaxed"
            style={{ background: "#111c2e", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            A chat request will be sent to{" "}
            <span className="text-orange-400 font-semibold">{receiver || "the owner"}</span>{" "}
            for item <span className="text-white font-semibold">"{item.name}"</span>.
            They can accept or reject it from their Contact Requests page.
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !sender || !receiver || sender === receiver}
            className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ background: sending ? "#c2621e" : "#f97316" }}
          >
            {sending ? (
              <>
                <span
                  className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                  style={{ animation: "spin 0.6s linear infinite" }}
                />
                Sending…
              </>
            ) : (
              "Send Request 📨"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BrowseItems() {
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems,  setLostItems]  = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [sortBy,     setSortBy]     = useState("newest");
  const [activeTab,  setActiveTab]  = useState("All");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [found, lost] = await Promise.all([
        getAllFoundItems().catch(() => []),
        getAllLostItems().catch(() => []),
      ]);
      setFoundItems((found || []).map((i) => ({ ...i, _type: "found" })));
      setLostItems(lost || []);
    } catch {
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  useEffect(() => {
    let pool =
      activeTab === "Lost"  ? [...lostItems]  :
      activeTab === "Found" ? [...foundItems] :
      [...lostItems, ...foundItems];

    if (category !== "All")
      pool = pool.filter((i) => i.category?.toLowerCase() === category.toLowerCase());

    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest")      pool.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest") pool.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "name")   pool.sort((a, b) => a.name?.localeCompare(b.name));

    setFiltered(pool);
  }, [lostItems, foundItems, search, category, sortBy, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Browse Lost &amp; Found Items</h2>
          <p className="text-slate-400 mt-1">
            {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        <div className="flex gap-1 mb-6 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? "bg-orange-500 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by name, description, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-lg"
              >×</button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                category === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadItems} className="text-sm underline hover:no-underline ml-4">Retry</button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
            ? <EmptyState query={search} />
            : filtered.map((item) => (
                <ItemCard key={`${item._type}-${item.id}`} item={item} />
              ))}
        </div>
      </div>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────
function ItemCard({ item }) {
  const isLost = item._type === "lost";
  const [claimed,     setClaimed]     = useState(item.status === "claimed");
  const [claiming,    setClaiming]    = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const imageUrl =
    item.imageUrl ||
    (item.id
      ? isLost ? getLostItemImage(item.id) : getFoundItemImage(item.id)
      : null);

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimFoundItem(item.id);
      setClaimed(true);
    } catch (err) {
      console.error("Claim failed", err);
    } finally {
      setClaiming(false);
    }
  };

  const hoverBorder = isLost
    ? "hover:border-red-500/40 hover:shadow-red-500/10"
    : "hover:border-orange-500/40 hover:shadow-orange-500/10";

  return (
    <>
      {showModal && (
        <ChatRequestModal
          item={item}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); setRequestSent(true); }}
        />
      )}

      <div
        className={`group bg-slate-900 border border-slate-800 ${hoverBorder} rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
      >
        {/* Image */}
        <div className="h-44 bg-slate-800 overflow-hidden flex items-center justify-center relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-5xl opacity-30 select-none">📦</span>
          )}
          <div className="absolute top-2 left-2">
            <TypeBadge type={item._type} />
          </div>
          {!isLost && claimed && (
            <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
              <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">CLAIMED</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-1">{item.name}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 flex-1">
            {item.description || "No description provided."}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>📍</span>
            <span className="truncate">{item.location || "Unknown location"}</span>
          </div>
          {formattedDate && <div className="text-xs text-slate-600">{formattedDate}</div>}
          {isLost && item.reward && (
            <div className="text-xs text-amber-400 font-semibold">🎁 Reward: ₹{item.reward}</div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between mt-1">
            <CategoryBadge category={item.category} />

            <div className="flex items-center gap-2">
              {!isLost && !claimed && (
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? "Claiming…" : "Mine →"}
                </button>
              )}

              {isLost && item.contactNumber && (
                <a
                  href={`tel:${item.contactNumber}`}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  Call →
                </a>
              )}

              {/* 💬 Chat Request */}
              {requestSent ? (
                <span className="text-xs text-green-400 font-semibold">✓ Sent</span>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                  style={{
                    background: "rgba(249,115,22,0.12)",
                    color: "#f97316",
                    border: "1px solid rgba(249,115,22,0.3)",
                  }}
                >
                  💬 Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}