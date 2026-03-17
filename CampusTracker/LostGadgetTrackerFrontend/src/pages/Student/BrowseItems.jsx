import { useCallback, useEffect, useState } from "react";
import { claimFoundItem } from "../../Services/lostFoundService";
import { fetchFoundItems } from "./../../Services/lostFoundService";

const CATEGORIES = ["All", "Electronics", "Documents", "Clothing", "Keys", "Accessories", "Other"];

const CategoryBadge = ({ category }) => {
  const colors = {
    electronics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    documents: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    clothing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    keys: "bg-green-500/20 text-green-300 border-green-500/30",
    accessories: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    other: "bg-slate-500/20 text-slate-300 border-slate-500/30",
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
      {query ? `No items matching "${query}"` : "No found items yet"}
    </h3>
    <p className="text-slate-400 max-w-sm">
      {query
        ? "Try adjusting your search or filter criteria."
        : "Be the first to report a found item and help someone out!"}
    </p>
  </div>
);

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFoundItems();
      setItems(res || []);
    } catch (err) {
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Filter + search + sort
  useEffect(() => {
    let result = [...items];

    if (category !== "All") {
      result = result.filter(
        (i) => i.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name?.localeCompare(b.name));
    }

    setFiltered(result);
  }, [items, search, category, sortBy]);
  
    const handleClaim = async () => {
  try {
    await claimFoundItem(item.id);
    setClaimed(true);
  } catch (err) {
    console.error("Claim failed", err);
  }
};
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Browse Found Items
          </h2>
          <p className="text-slate-400 mt-1">
            {loading ? "Loading..." : `${filtered.length} item${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
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
              >
                ×
              </button>
            )}
          </div>

          {/* Sort */}
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

        {/* Category Filter Pills */}
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

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadItems}
              className="text-sm underline hover:no-underline ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
            ? <EmptyState query={search} />
            : filtered.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
        </div>
      </div>
    </div>
  );
}

function ItemCard({ item }) {
  const [claimed, setClaimed] = useState(item.status === "claimed");

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5">
      {/* Image or placeholder */}
      <div className="h-44 bg-slate-800 overflow-hidden flex items-center justify-center relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl opacity-30 select-none">📦</span>
        )}
        {claimed && (
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              CLAIMED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-white text-base leading-tight line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 flex-1">
          {item.description || "No description provided."}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span>📍</span>
          <span className="truncate">{item.location || "Unknown location"}</span>
        </div>

        {formattedDate && (
          <div className="text-xs text-slate-600">{formattedDate}</div>
        )}

        <div className="flex items-center justify-between mt-1">
          <CategoryBadge category={item.category} />
          {!claimed && (
            <button
              onClick={() => setClaimed(true)}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              This is mine →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}