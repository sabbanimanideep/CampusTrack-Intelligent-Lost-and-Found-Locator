// ReportingPage.jsx — Reporting Dashboard + User Engagement Metrics
import { useState } from "react";
import { s } from "./styles";

// ── Sparkline SVG ──────────────────────────────────────────────────
function Sparkline({ data, color = "#6366f1", height = 40, width = 100 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.12" strokeWidth="0" />
    </svg>
  );
}

// ── Donut chart ────────────────────────────────────────────────────
function DonutChart({ segments, size = 130 }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  let cumulative = 0;
  const r = 45;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const ratio = seg.value / total;
        const dash = ratio * circumference;
        const gap = circumference - dash;
        const rotation = -90 + (cumulative / total) * 360;
        cumulative += seg.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`} transform={`rotate(${rotation} ${cx} ${cy})`} />
        );
      })}
      <circle cx={cx} cy={cy} r="35" fill="white" />
    </svg>
  );
}

// ── Progress bar ───────────────────────────────────────────────────
function ProgressBar({ label, value, max, color, count }) {
  const pct = Math.round((value / (max || 1)) * 100);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "13px", color: "#475569", fontWeight: "500" }}>{label}</span>
        <span style={{ fontSize: "13px", color: "#94a3b8" }}>{count} <span style={{ color: "#cbd5e1" }}>({pct}%)</span></span>
      </div>
      <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "99px", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── Shared card ────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: "12px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>{children}</h3>
);

// ── Static mock data (replace with real API calls) ─────────────────
const CATEGORIES = ["Electronics", "Accessories", "Documents", "Clothing", "Bags", "Others"];
const MONTHS     = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const DAYS       = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const D = {
  reported:      [28, 35, 22, 41, 38, 30],
  matched:       [12, 18, 10, 22, 20, 16],
  recovered:     [8,  11, 6,  15, 14, 11],
  activeUsers:   [42, 55, 38, 67, 61, 48, 52],
  postFrequency: [14, 19, 11, 24, 21, 17, 20],
  messages:      [88, 102, 74, 130, 118, 95, 108],
  byCategory: [
    { label: "Electronics", reported: 48 },
    { label: "Accessories", reported: 35 },
    { label: "Documents",   reported: 27 },
    { label: "Clothing",    reported: 20 },
    { label: "Bags",        reported: 18 },
    { label: "Others",      reported: 16 },
  ],
};

// ── Main ───────────────────────────────────────────────────────────
export default function ReportingPage() {
  const [dateFilter,     setDateFilter]     = useState("6months");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const totalReported  = D.reported.reduce((a, b) => a + b, 0);
  const totalMatched   = D.matched.reduce((a, b) => a + b, 0);
  const totalRecovered = D.recovered.reduce((a, b) => a + b, 0);
  const recoveryRate   = Math.round((totalRecovered / totalReported) * 100);

  const avgActiveUsers   = Math.round(D.activeUsers.reduce((a, b) => a + b, 0)   / D.activeUsers.length);
  const avgMessages      = Math.round(D.messages.reduce((a, b) => a + b, 0)      / D.messages.length);
  const avgPostFrequency = Math.round(D.postFrequency.reduce((a, b) => a + b, 0) / D.postFrequency.length);

  const donutSegments = [
    { label: "Recovered", value: totalRecovered,                  color: "#10b981" },
    { label: "Matched",   value: totalMatched - totalRecovered,   color: "#6366f1" },
    { label: "Pending",   value: totalReported - totalMatched,    color: "#e2e8f0" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── Filters (location removed) ── */}
      <div style={s.filterRow}>
        <div style={s.filterGroup}>
          <span style={s.filterLabel}>Period</span>
          <select style={s.select} value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="1month">Last Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        <div style={s.filterGroup}>
          <span style={s.filterLabel}>Category</span>
          <select style={s.select} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ══ SECTION 1 — REPORTING DASHBOARD ══ */}
      <div>
        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>📋 Reporting Dashboard</h2>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { icon: "📦", label: "Items Reported",  value: totalReported,      color: "#6366f1", spark: D.reported,  change: "+12%" },
            { icon: "🔗", label: "Items Matched",   value: totalMatched,       color: "#f59e0b", spark: D.matched,   change: "+8%"  },
            { icon: "✅", label: "Items Recovered", value: totalRecovered,     color: "#10b981", spark: D.recovered, change: "+15%" },
            { icon: "📈", label: "Recovery Rate",   value: `${recoveryRate}%`, color: "#0ea5e9", spark: D.recovered.map((v,i) => Math.round(v/D.reported[i]*100)), change: "+3%" },
          ].map(kpi => (
            <Card key={kpi.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{kpi.icon}</div>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{kpi.label}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", background: "#d1fae5", padding: "2px 7px", borderRadius: "20px" }}>{kpi.change}</span>
                  <Sparkline data={kpi.spark} color={kpi.color} width={80} height={35} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trend bars + Donut */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px", marginBottom: "20px" }}>
          <Card>
            <SectionTitle>📊 Monthly Trends</SectionTitle>
            <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
              {[{ label: "Reported", color: "#6366f1" }, { label: "Matched", color: "#f59e0b" }, { label: "Recovered", color: "#10b981" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: l.color }} />
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", height: "120px" }}>
              {MONTHS.map((month, i) => (
                <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "2px", width: "100%" }}>
                    {[{ val: D.reported[i], color: "#6366f1" }, { val: D.matched[i], color: "#f59e0b" }, { val: D.recovered[i], color: "#10b981" }].map((bar, j) => (
                      <div key={j} style={{ flex: 1, height: `${(bar.val / 50) * 100}%`, background: bar.color, borderRadius: "3px 3px 0 0", minHeight: "3px", opacity: 0.85 }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>{month}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>🎯 Outcome Breakdown</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <DonutChart segments={donutSegments} size={130} />
              <div style={{ width: "100%" }}>
                {donutSegments.map(seg => (
                  <div key={seg.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: seg.color }} />
                      <span style={{ fontSize: "13px", color: "#475569" }}>{seg.label}</span>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* By Category only (location removed) */}
        <Card>
          <SectionTitle>🏷️ By Category</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
            {D.byCategory.map(cat => (
              <ProgressBar key={cat.label} label={cat.label} value={cat.reported} max={48} count={cat.reported} color="#6366f1" />
            ))}
          </div>
        </Card>
      </div>

      {/* ══ SECTION 2 — USER ENGAGEMENT ══ */}
      <div>
        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: "0 0 16px 0" }}>👥 User Engagement Metrics</h2>

        {/* Engagement KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" }}>
          {[
            { icon: "👤", label: "Avg Active Users / Day", value: avgActiveUsers,   color: "#6366f1", spark: D.activeUsers,   change: "+9%",  sub: "unique sessions" },
            { icon: "💬", label: "Avg Messages / Day",     value: avgMessages,      color: "#f59e0b", spark: D.messages,      change: "+18%", sub: "platform messages" },
            { icon: "📝", label: "Avg Posts / Day",        value: avgPostFrequency, color: "#10b981", spark: D.postFrequency, change: "+6%",  sub: "lost + found posts" },
          ].map(m => (
            <Card key={m.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "6px" }}>{m.icon}</div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: m.color, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{m.sub}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", background: "#d1fae5", padding: "2px 7px", borderRadius: "20px" }}>{m.change}</span>
                  <Sparkline data={m.spark} color={m.color} width={90} height={40} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Daily activity only (top users + platform effectiveness removed) */}
        <Card>
          <SectionTitle>📅 Daily Activity (This Week)</SectionTitle>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            {[{ label: "Active Users", color: "#6366f1" }, { label: "Posts", color: "#10b981" }, { label: "Messages", color: "#f59e0b" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: l.color }} />
                <span style={{ fontSize: "11px", color: "#64748b" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", height: "140px" }}>
            {DAYS.map((day, i) => (
              <div key={day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "2px", width: "100%" }}>
                  {[
                    { val: D.activeUsers[i],   max: 80,  color: "#6366f1" },
                    { val: D.postFrequency[i], max: 30,  color: "#10b981" },
                    { val: D.messages[i],      max: 150, color: "#f59e0b" },
                  ].map((bar, j) => (
                    <div key={j} style={{ flex: 1, height: `${(bar.val / bar.max) * 100}%`, background: bar.color, borderRadius: "3px 3px 0 0", minHeight: "3px", opacity: 0.85 }} />
                  ))}
                </div>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>{day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}