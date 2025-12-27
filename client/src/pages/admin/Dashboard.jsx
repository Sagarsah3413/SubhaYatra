import { useEffect, useState } from "react";
import axios from "axios";
import UserStatsCard from "../../components/UserStatsCard";

export default function AdminDashboard() {
  const [lastLoginTime, setLastLoginTime] = useState(null);
  const [lastLogoutTime, setLastLogoutTime] = useState(null);

  // Fetch last login/logout times (optional)
  useEffect(() => {
    const fetchAdminActivity = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/activity");
        setLastLoginTime(res.data.lastLogin);
        setLastLogoutTime(res.data.lastLogout);
      } catch (err) {
        console.error("Failed to fetch admin activity:", err);
      }
    };
    fetchAdminActivity();
  }, []);

  // Sign Out handler
  const handleSignOut = async () => {
    try {
      const activity_id = localStorage.getItem("adminActivityId"); // saved on login
      await axios.post("http://localhost:8000/admin/logout", { activity_id });
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminActivityId");
      window.location.href = "/login"; // redirect to login
    } catch (err) {
      console.error("Sign-out failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <span className="text-2xl font-bold">Admin Dashboard</span>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </header>

      {/* Main content */}
      <main className="p-6 flex-1">
        <UserStatsCard />
        {/* Add more cards/charts here later */}

        {/* Admin activity info */}
        <div className="p-6 bg-white shadow rounded-lg w-full max-w-sm mt-6">
          <h3 className="text-gray-600 text-sm font-medium">Admin Activity</h3>
          <p className="text-gray-800 mt-2">
            Last Login: {lastLoginTime || "N/A"} <br />
            Last Logout: {lastLogoutTime || "N/A"}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 p-4 text-center text-sm mt-auto">
        Tourism Management System — Admin Portal
        <br />
        &copy; {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
}
