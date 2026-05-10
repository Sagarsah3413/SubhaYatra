import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000/api";

function getAuth(navigate) {
  const raw = localStorage.getItem("admin");
  if (!raw) { navigate("/admin/login"); return null; }
  try {
    const a = JSON.parse(raw);
    if (!a.access_token) { navigate("/admin/login"); return null; }
    return { headers: { Authorization: `Bearer ${a.access_token}` } };
  } catch { navigate("/admin/login"); return null; }
}

// ── tiny stat card ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "teal", icon }) {
  const colors = {
    teal:   "from-teal-500 to-cyan-600",
    blue:   "from-blue-500 to-indigo-600",
    purple: "from-purple-500 to-pink-600",
    amber:  "from-amber-500 to-orange-600",
    emerald:"from-emerald-500 to-green-600",
    rose:   "from-rose-500 to-red-600",
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-black text-slate-800">{value ?? "—"}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── bar chart (pure CSS) ──────────────────────────────────────────────────────
function BarChart({ data, labelKey, valueKey, color = "teal" }) {
  if (!data?.length) return <p className="text-slate-400 text-sm py-4 text-center">No data yet</p>;
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const colors = { teal: "bg-teal-500", blue: "bg-blue-500", amber: "bg-amber-500", purple: "bg-purple-500" };
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-28 truncate flex-shrink-0">{d[labelKey]}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
            <div
              className={`h-full ${colors[color] || "bg-teal-500"} rounded-full transition-all duration-700`}
              style={{ width: `${(d[valueKey] / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700 w-8 text-right">{d[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

// ── toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-300">
      <div className={`px-6 py-4 rounded-xl shadow-2xl border-l-4 flex items-center gap-3 ${
        toast.type === "success" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-rose-50 border-rose-500 text-rose-800"
      }`}>
        <span>{toast.type === "success" ? "✅" : "❌"}</span>
        <span className="font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({ auth }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    axios.get(`${API}/analytics/overview`, auth)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <p className="text-center text-slate-400 py-10">Failed to load overview</p>;

  return (
    <div className="space-y-8">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users"       value={data.users.total}            sub={`+${data.users.new_today} today`}       color="teal"   icon="👥" />
        <StatCard label="New This Week"     value={data.users.new_this_week}    sub="registered users"                       color="blue"   icon="🆕" />
        <StatCard label="Total Searches"    value={data.searches.total}         sub={`${data.searches.today} today`}         color="purple" icon="🔍" />
        <StatCard label="Recommendations"   value={data.recommendations.total}  sub="sessions"                               color="amber"  icon="🗺️" />
        <StatCard label="Itineraries"       value={data.itineraries.total}      sub="created"                                color="emerald"icon="📅" />
        <StatCard label="Chat Sessions"     value={data.chats.total}            sub={`${data.chats.messages} messages`}      color="rose"   icon="💬" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search trend */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">📈 Search Trend (Last 7 Days)</h3>
          <BarChart data={data.search_trend} labelKey="date" valueKey="searches" color="teal" />
        </div>

        {/* Top queries */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">🔥 Top Search Queries</h3>
          <BarChart data={data.top_queries} labelKey="query" valueKey="count" color="purple" />
        </div>
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">🆕 Recent Sign-ups</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500 border-b border-slate-100">
              <th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Logins</th><th className="pb-2">Joined</th>
            </tr></thead>
            <tbody>
              {data.recent_users.map(u => (
                <tr key={u.clerk_id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 pr-4 font-medium text-slate-800">{u.name || "—"}</td>
                  <td className="py-2 pr-4 text-slate-500">{u.email}</td>
                  <td className="py-2 pr-4 text-slate-600">{u.total_logins}</td>
                  <td className="py-2 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Users tab ─────────────────────────────────────────────────────────────────
function UsersTab({ auth }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const load = useCallback((pg = 1, search = "") => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/analytics/users`, { ...auth, params: { page: pg, per_page: 20, q: search } })
      .then(r => { setUsers(r.data.users); setTotal(r.data.total); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => { load(1, ""); }, [load]);

  const openUser = (u) => {
    setSelected(u);
    axios.get(`${API}/analytics/users/${u.clerk_id}`, auth)
      .then(r => setDetail(r.data))
      .catch(() => setDetail(null));
  };

  const exportCSV = () => {
    window.open(`${API}/analytics/export/users?` + new URLSearchParams({ Authorization: auth.headers.Authorization }));
    // Use anchor with auth header via fetch
    fetch(`${API}/analytics/export/users`, { headers: auth.headers })
      .then(r => r.blob()).then(blob => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "users.csv"; a.click();
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load(1, q)}
            placeholder="Search name / email…"
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={() => load(1, q)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Search</button>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">⬇ Export CSV</button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Searches</th><th className="px-4 py-3">Recs</th>
                <th className="px-4 py-3">Itineraries</th><th className="px-4 py-3">Chats</th>
                <th className="px-4 py-3">Logins</th><th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-slate-400">Loading…</td></tr>
              ) : users.map(u => (
                <tr key={u.clerk_id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800 flex items-center gap-2">
                    {u.avatar_url && <img src={u.avatar_url} className="w-7 h-7 rounded-full object-cover" alt="" />}
                    {u.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3 text-center">{u.activity?.searches ?? 0}</td>
                  <td className="px-4 py-3 text-center">{u.activity?.recommendations ?? 0}</td>
                  <td className="px-4 py-3 text-center">{u.activity?.itineraries ?? 0}</td>
                  <td className="px-4 py-3 text-center">{u.activity?.chats ?? 0}</td>
                  <td className="px-4 py-3 text-center">{u.total_logins}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openUser(u)} className="text-teal-600 hover:underline text-xs font-semibold">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{total} users total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1, q)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={page * 20 >= total} onClick={() => load(page + 1, q)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>

      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setDetail(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selected.avatar_url && <img src={selected.avatar_url} className="w-12 h-12 rounded-full object-cover" alt="" />}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selected.name || "Unknown"}</h3>
                  <p className="text-slate-500 text-sm">{selected.email}</p>
                </div>
              </div>
              <button onClick={() => { setSelected(null); setDetail(null); }} className="text-slate-400 hover:text-slate-700 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-500">Clerk ID</span><p className="font-mono text-xs mt-1 break-all">{selected.clerk_id}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-500">Total Logins</span><p className="font-bold text-lg">{selected.total_logins}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-500">Last Login</span><p className="text-xs mt-1">{selected.last_login ? new Date(selected.last_login).toLocaleString() : "—"}</p></div>
                <div className="bg-slate-50 rounded-xl p-3"><span className="text-slate-500">Joined</span><p className="text-xs mt-1">{new Date(selected.created_at).toLocaleString()}</p></div>
              </div>
              {detail ? (
                <>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Recent Searches ({detail.searches.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {detail.searches.slice(0, 10).map((s, i) => (
                        <div key={i} className="flex justify-between text-xs bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="font-medium text-slate-700">"{s.query}"</span>
                          <span className="text-slate-400">{s.category} · {new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Recommendations ({detail.recommendations.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {detail.recommendations.slice(0, 5).map((r, i) => (
                        <div key={i} className="text-xs bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="font-medium text-slate-700">{r.trip_type || "—"}</span>
                          <span className="text-slate-400 ml-2">{r.travel_month} · {r.travellers} travellers · {new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2">Itineraries ({detail.itineraries.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {detail.itineraries.slice(0, 5).map((it, i) => (
                        <div key={i} className="text-xs bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="font-medium text-slate-700">{it.destination || "—"}</span>
                          <span className="text-slate-400 ml-2">{it.duration_days}d · {it.budget} · {new Date(it.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : <p className="text-slate-400 text-sm text-center py-4">Loading activity…</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Search Analytics tab ──────────────────────────────────────────────────────
function SearchAnalyticsTab({ auth }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback((pg = 1, search = "") => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/analytics/searches`, { ...auth, params: { page: pg, per_page: 30, q: search } })
      .then(r => { setData(r.data); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    fetch(`${API}/analytics/export/searches`, { headers: auth.headers })
      .then(r => r.blob()).then(blob => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "searches.csv"; a.click();
      });
  };

  return (
    <div className="space-y-6">
      {data && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">🔥 Most Searched</h3>
          <BarChart data={data.top_queries} labelKey="query" valueKey="count" color="purple" />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load(1, q)}
            placeholder="Filter by query…"
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={() => load(1, q)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Filter</button>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">⬇ Export CSV</button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Query</th><th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Results</th><th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Device</th><th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : (data?.logs || []).map((s, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-800">"{s.query}"</td>
                  <td className="px-4 py-2"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{s.category}</span></td>
                  <td className="px-4 py-2 text-center text-slate-600">{s.result_count}</td>
                  <td className="px-4 py-2 text-slate-500 text-xs">{s.user_name || s.clerk_id?.slice(0, 12) || "Guest"}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs max-w-[160px] truncate">{s.device}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{data?.total ?? 0} searches total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1, q)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={!data || page * 30 >= data.total} onClick={() => load(page + 1, q)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Recommendations tab ───────────────────────────────────────────────────────
function RecommendationsTab({ auth }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback((pg = 1) => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/analytics/recommendations`, { ...auth, params: { page: pg, per_page: 30 } })
      .then(r => { setData(r.data); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    fetch(`${API}/analytics/export/recommendations`, { headers: auth.headers })
      .then(r => r.blob()).then(blob => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "recommendations.csv"; a.click();
      });
  };

  return (
    <div className="space-y-6">
      {data && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">🗺️ Most Recommended Places</h3>
          <BarChart data={data.top_places} labelKey="name" valueKey="count" color="amber" />
        </div>
      )}
      <div className="flex justify-end">
        <button onClick={exportCSV} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">⬇ Export CSV</button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">User</th><th className="px-4 py-3">Trip Type</th>
                <th className="px-4 py-3">Month</th><th className="px-4 py-3">Travellers</th>
                <th className="px-4 py-3">Duration</th><th className="px-4 py-3">Places Shown</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : (data?.logs || []).map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-700">{r.user_name || r.clerk_id?.slice(0, 12) || "Guest"}</td>
                  <td className="px-4 py-2 text-xs text-slate-600 max-w-[140px] truncate">{r.trip_type || "—"}</td>
                  <td className="px-4 py-2 text-slate-500">{r.travel_month || "—"}</td>
                  <td className="px-4 py-2 text-center">{r.travellers ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-500">{r.duration || "—"}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{(r.places_shown || []).slice(0, 3).join(", ")}{r.places_shown?.length > 3 ? ` +${r.places_shown.length - 3}` : ""}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{data?.total ?? 0} sessions total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={!data || page * 30 >= data.total} onClick={() => load(page + 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Itineraries tab ───────────────────────────────────────────────────────────
function ItinerariesTab({ auth }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = useCallback((pg = 1) => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/analytics/itineraries`, { ...auth, params: { page: pg, per_page: 30 } })
      .then(r => { setData(r.data); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => { load(); }, [load]);

  const exportCSV = () => {
    fetch(`${API}/analytics/export/itineraries`, { headers: auth.headers })
      .then(r => r.blob()).then(blob => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "itineraries.csv"; a.click();
      });
  };

  return (
    <div className="space-y-6">
      {data && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">📅 Top Destinations</h3>
          <BarChart data={data.top_destinations} labelKey="destination" valueKey="count" color="blue" />
        </div>
      )}
      <div className="flex justify-end">
        <button onClick={exportCSV} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">⬇ Export CSV</button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">User</th><th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Dates</th><th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Budget</th><th className="px-4 py-3">Travellers</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : (data?.logs || []).map((it, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-700">{it.user_name || it.clerk_id?.slice(0, 12) || "Guest"}</td>
                  <td className="px-4 py-2 font-medium text-slate-800">{it.destination || "—"}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">{it.start_date} → {it.end_date}</td>
                  <td className="px-4 py-2 text-center">{it.duration_days ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-500">{it.budget || "—"}</td>
                  <td className="px-4 py-2 text-center">{it.travellers ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{new Date(it.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{data?.total ?? 0} itineraries total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={!data || page * 30 >= data.total} onClick={() => load(page + 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chat History tab ──────────────────────────────────────────────────────────
function ChatHistoryTab({ auth }) {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback((pg = 1) => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/analytics/chats`, { ...auth, params: { page: pg, per_page: 20 } })
      .then(r => { setData(r.data); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">User</th><th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Messages</th><th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : (data?.chats || []).map((c, i) => (
                <>
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{c.user_name || c.clerk_id?.slice(0, 12) || "Guest"}</td>
                    <td className="px-4 py-2 font-medium text-slate-800">{c.title}</td>
                    <td className="px-4 py-2 text-center">{c.message_count}</td>
                    <td className="px-4 py-2 text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => setExpanded(expanded === i ? null : i)} className="text-teal-600 hover:underline text-xs font-semibold">
                        {expanded === i ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === i && (
                    <tr key={`${i}-msgs`} className="bg-slate-50">
                      <td colSpan={5} className="px-6 py-3">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {c.messages.map((m, j) => (
                            <div key={j} className={`flex gap-2 text-xs ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`px-3 py-2 rounded-xl max-w-[80%] ${m.sender === "user" ? "bg-teal-100 text-teal-900" : "bg-white border border-slate-200 text-slate-700"}`}>
                                <span className="font-semibold mr-1">{m.sender === "user" ? "User:" : "Bot:"}</span>
                                {m.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{data?.total ?? 0} chats total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={!data || page * 20 >= data.total} onClick={() => load(page + 1)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Submissions + Reviews tabs (preserved from original) ─────────────────────
function SubmissionsTab({ auth }) {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/places?limit=all&status=all"),
      axios.get("http://localhost:8000/api/hotels?limit=all"),
      axios.get("http://localhost:8000/api/restaurants?limit=all"),
    ]).then(([p, h, r]) => {
      setPlaces((p.data.places || []).filter(x => x.source === "user_submission"));
      setHotels((h.data.hotels || []).filter(x => x.source === "user_submission"));
      setRestaurants((r.data.restaurants || []).filter(x => x.source === "user_submission"));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const action = async (url, method = "post") => {
    try {
      await axios[method](url, {}, auth || {});
      showToast("success", "Done!");
    } catch { showToast("error", "Failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  const API_BASE = "http://localhost:8000";

  // Resolve image URL — handles Cloudinary URLs and local paths
  const resolveImg = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url}`;
  };

  const Section = ({ title, items, type }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">{title} <span className="text-slate-400 font-normal text-sm">({items.length})</span></h3>
      </div>
      {items.length === 0 ? <p className="text-slate-400 text-sm text-center py-8">No {type} submissions</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted by</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const imgSrc = resolveImg(item.image_url || (item.all_images?.[0]));
                return (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2">
                      {imgSrc ? (
                        <img src={imgSrc} alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                          onError={e => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">No img</div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-2 text-slate-500">{item.location || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                        item.status === "pending"  ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }`}>{item.status}</span>
                    </td>
                    <td className="px-4 py-2 text-slate-400 text-xs">{item.submitted_by?.slice(0, 12) || "—"}</td>
                    <td className="px-4 py-2 flex gap-2">
                      {item.status !== "approved" && <button onClick={() => action(`http://localhost:8000/api/${type}s/${item.id}/approve`)} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">Approve</button>}
                      {item.status !== "rejected" && <button onClick={() => action(`http://localhost:8000/api/${type}s/${item.id}/reject`)} className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200">Reject</button>}
                      <button onClick={() => action(`http://localhost:8000/api/${type}s/${item.id}`, "delete")} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Toast toast={toast} />
    </div>
  );

  return (
    <>
      <Section title="🗺️ Place Submissions" items={places} type="place" />
      <Section title="🏨 Hotel Submissions" items={hotels} type="hotel" />
      <Section title="🍽️ Restaurant Submissions" items={restaurants} type="restaurant" />
    </>
  );
}

// ── Reviews tab (simplified) ──────────────────────────────────────────────────
function ReviewsTab({ auth }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/admin/reviews"),
      axios.get("http://localhost:8000/api/admin/dashboard/review-stats"),
    ]).then(([r, s]) => { setReviews(r.data.reviews || []); setStats(s.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const action = async (id, act) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/reviews/${id}/${act}`, {}, auth || {});
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: act === "approve" ? "approved" : "rejected" } : r));
      showToast("success", `Review ${act}d!`);
    } catch { showToast("error", "Failed"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Toast toast={toast} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Reviews"    value={stats.total_reviews}    color="teal"   icon="⭐" />
        <StatCard label="Pending"          value={stats.pending_reviews}  color="amber"  icon="⏳" />
        <StatCard label="Approved"         value={stats.approved_reviews} color="emerald"icon="✅" />
        <StatCard label="Avg Rating"       value={stats.average_rating}   color="blue"   icon="📊" />
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Place</th>
                <th className="px-4 py-3">Rating</th><th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium text-slate-800">{r.name}</td>
                  <td className="px-4 py-2 text-slate-500">{r.place}</td>
                  <td className="px-4 py-2">{"⭐".repeat(Math.min(r.rating, 5))}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                      r.status === "pending"  ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-2 text-slate-400 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {r.status !== "approved" && <button onClick={() => action(r.id, "approve")} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200">Approve</button>}
                    {r.status !== "rejected" && <button onClick={() => action(r.id, "reject")} className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200">Reject</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Saved Itineraries Admin Tab ───────────────────────────────────────────────
function SavedItinerariesAdminTab({ auth }) {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [dest, setDest] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [detail, setDetail] = useState({});

  const load = useCallback((pg = 1, search = "", destination = "") => {
    if (!auth) return;
    setLoading(true);
    axios.get(`${API}/admin/itineraries`, { ...auth, params: { page: pg, per_page: 30, q: search, destination } })
      .then(r => { setData(r.data); setPage(pg); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth]);

  useEffect(() => {
    load();
    if (auth) {
      axios.get(`${API}/admin/itineraries/stats`, auth)
        .then(r => setStats(r.data))
        .catch(() => {});
    }
  }, [load, auth]);

  const openDetail = async (id) => {
    if (detail[id]) { setExpanded(expanded === id ? null : id); return; }
    try {
      const r = await axios.get(`${API}/itineraries/${id}`, auth);
      setDetail(prev => ({ ...prev, [id]: r.data }));
      setExpanded(id);
    } catch { setExpanded(expanded === id ? null : id); }
  };

  const exportCSV = () => {
    fetch(`${API}/analytics/export/itineraries`, { headers: auth.headers })
      .then(r => r.blob()).then(blob => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = "saved_itineraries.csv"; a.click();
      });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">🔖 Total Saved: <span className="text-teal-600">{stats.total}</span></h3>
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Top Destinations</h4>
            <BarChart data={stats.top_destinations} labelKey="destination" valueKey="count" color="teal" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h4 className="font-semibold text-slate-700 mb-3 text-sm">Budget Distribution</h4>
            <BarChart data={stats.budget_distribution} labelKey="budget" valueKey="count" color="blue" />
            <h4 className="font-semibold text-slate-700 mt-4 mb-3 text-sm">Recent Saves</h4>
            <div className="space-y-1">
              {(stats.recent || []).map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs bg-slate-50 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-slate-700 truncate max-w-[60%]">{i.title}</span>
                  <span className="text-slate-400">{i.user_name || "—"} · {new Date(i.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load(1, q, dest)}
            placeholder="Search title / user…"
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <input value={dest} onChange={e => setDest(e.target.value)} onKeyDown={e => e.key === "Enter" && load(1, q, dest)}
            placeholder="Filter destination…"
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={() => load(1, q, dest)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700">Filter</button>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">⬇ Export CSV</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-slate-600">
                <th className="px-4 py-3">Title</th><th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Destinations</th><th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Budget</th><th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Saved</th><th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="text-center py-10 text-slate-400">Loading…</td></tr>
              : (data?.itineraries || []).map((it, i) => (
                <>
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium text-slate-800 max-w-[180px] truncate">{it.title}</td>
                    <td className="px-4 py-2 text-slate-600">{it.user_name || it.clerk_id?.slice(0, 12) || "—"}</td>
                    <td className="px-4 py-2 text-slate-500 max-w-[160px] truncate">{it.destinations || "—"}</td>
                    <td className="px-4 py-2 text-slate-500">{it.duration || "—"}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">{it.budget_level || "—"}</span></td>
                    <td className="px-4 py-2 text-slate-600">{it.total_cost ? `NPR ${it.total_cost.toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-2 text-slate-400 text-xs">{new Date(it.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => openDetail(it.id)} className="text-teal-600 hover:underline text-xs font-semibold">
                        {expanded === it.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === it.id && detail[it.id] && (
                    <tr key={`${i}-detail`} className="bg-slate-50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="text-xs space-y-2">
                          {detail[it.id].notes && <p><span className="font-semibold text-slate-600">Notes:</span> {detail[it.id].notes}</p>}
                          {detail[it.id].itinerary?.summary && <p><span className="font-semibold text-slate-600">Summary:</span> {detail[it.id].itinerary.summary}</p>}
                          {detail[it.id].itinerary?.dailyPlan?.length > 0 && (
                            <p><span className="font-semibold text-slate-600">Days:</span> {detail[it.id].itinerary.dailyPlan.map(d => d.destination).join(" → ")}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm text-slate-500">
          <span>{data?.total ?? 0} saved itineraries total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => load(page - 1, q, dest)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">←</button>
            <span className="px-3 py-1">Page {page}</span>
            <button disabled={!data || page * 30 >= data.total} onClick={() => load(page + 1, q, dest)} className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview",         label: "📊 Overview" },
  { key: "users",            label: "👥 Users" },
  { key: "searches",         label: "🔍 Searches" },
  { key: "recommendations",  label: "🗺️ Recommendations" },
  { key: "saved_itineraries",label: "📅 Itineraries" },
  { key: "chats",            label: "💬 Chat History" },
  { key: "submissions",      label: "📝 Submissions" },
  { key: "reviews",          label: "⭐ Reviews" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);

  const auth = getAuth(navigate);

  const handleSignOut = async () => {
    try { await axios.post("http://localhost:8000/api/admin/logout", {}, auth || {}); } catch {}
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      <Toast toast={toast} />

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
        <div className="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl shadow-xl">
              <span className="text-2xl">🏔️</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs mt-0.5">Tourism Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">Online</span>
            </div>
            <button onClick={handleSignOut} className="px-5 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 overflow-x-auto">
        <div className="max-w-screen-2xl mx-auto px-6 flex gap-1 min-w-max">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`relative px-5 py-4 font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === t.key ? "text-teal-600" : "text-slate-500 hover:text-slate-800"
              }`}>
              {t.label}
              {activeTab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-screen-2xl mx-auto px-6 py-8">
        {activeTab === "overview"        && <OverviewTab auth={auth} />}
        {activeTab === "users"           && <UsersTab auth={auth} />}
        {activeTab === "searches"        && <SearchAnalyticsTab auth={auth} />}
        {activeTab === "recommendations" && <RecommendationsTab auth={auth} />}
        {activeTab === "saved_itineraries" && <SavedItinerariesAdminTab auth={auth} />}
        {activeTab === "chats"            && <ChatHistoryTab auth={auth} />}
        {activeTab === "submissions"      && <SubmissionsTab auth={auth} />}
        {activeTab === "reviews"          && <ReviewsTab auth={auth} />}
      </main>
    </div>
  );
}
