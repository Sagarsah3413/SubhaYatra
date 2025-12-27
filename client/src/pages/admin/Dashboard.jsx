import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the correct admin key
    localStorage.removeItem("admin");
    navigate("/admin/login"); // Redirect to login after logout
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="py-2 px-4 bg-red-500 text-white rounded">
            Sign Out
          </button>
        </div>
        <p className="text-gray-700">
          Welcome, {JSON.parse(localStorage.getItem("admin"))?.username || "Admin"}!
        </p>
        <p className="text-gray-700 mt-4">
          This is your admin dashboard. You can add CRUD operations for Hotels, Places, Attractions here.
        </p>
      </div>
    </div>
  );
}
