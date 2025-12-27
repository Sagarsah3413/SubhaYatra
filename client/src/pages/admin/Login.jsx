import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call backend login API
      const res = await axios.post(
        "http://localhost:8000/admin/login",
        { username, password },
        { withCredentials: true }
      );

      // Save admin info and login time
      const adminData = {
        ...res.data,
        login_time: res.data.login_time || new Date().toISOString(),
        last_logout: null,
      };
      localStorage.setItem("admin", JSON.stringify(adminData));

      // Optional: save backend-provided activity_id
      if (res.data.activity_id) {
        localStorage.setItem("adminActivityId", res.data.activity_id);
      }

      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Admin Login
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Enter your credentials to access the admin dashboard
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button className="w-full py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded transition duration-300">
              Sign In
            </button>
          </form>
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 py-4 mt-8 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm space-y-1">
          <p>Tourism Management System &mdash; Admin Portal</p>
          <p>For internal use only. Unauthorized access is prohibited.</p>
          <p>&copy; {new Date().getFullYear()} Tourism Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
