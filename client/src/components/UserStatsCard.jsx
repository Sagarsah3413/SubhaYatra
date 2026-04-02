import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    return admin.access_token
      ? { Authorization: `Bearer ${admin.access_token}` }
      : {};
  } catch {
    return {};
  }
}

export default function UserStatsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/admin/dashboard`, { headers: getAuthHeaders() })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Dashboard stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Users (Clerk)",
      value: stats?.total_users ?? "—",
      sub: "All registered via Clerk",
      color: "teal",
    },
    {
      label: "Synced to DB",
      value: stats?.total_users_local ?? "—",
      sub: "Users who have logged in",
      color: "blue",
    },
    {
      label: "Active Users",
      value: stats?.active_users ?? "—",
      sub: "Accounts not deactivated",
      color: "emerald",
    },
    {
      label: "New This Month",
      value: stats?.new_users_this_month ?? "—",
      sub: "Joined in current month",
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="p-5 bg-white shadow rounded-xl border border-slate-100"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {c.label}
          </p>
          <p className="text-3xl font-black text-slate-800 mt-1">
            {loading ? "…" : c.value}
          </p>
          <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
