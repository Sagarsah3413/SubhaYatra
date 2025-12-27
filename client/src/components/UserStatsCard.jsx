import { useEffect, useState } from "react";
import axios from "axios";

export default function UserStatsCard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(true);
  const [loadingNew, setLoadingNew] = useState(true);

  useEffect(() => {
    // Fetch total users
    axios
      .get("http://localhost:8000/admin/dashboard/user-count")
      .then((res) => {
        console.log("Total users:", res.data);
        setTotalUsers(res.data.totalUsers);
        setLoadingTotal(false);
      })
      .catch((err) => {
        console.error("Error fetching total users:", err);
        setLoadingTotal(false);
      });

    // Fetch new users this month
    axios
      .get("http://localhost:8000/admin/dashboard/new-users")
      .then((res) => {
        console.log("New users this month:", res.data);
        setNewUsers(res.data.newUsersThisMonth);
        setLoadingNew(false);
      })
      .catch((err) => {
        console.error("Error fetching new users:", err);
        setLoadingNew(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Users Card */}
      <div className="p-6 bg-white shadow rounded-lg w-full">
        <h3 className="text-gray-600 text-sm font-medium">
          Total Registered Users
        </h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {loadingTotal ? "Loading..." : totalUsers}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Data fetched securely from Clerk API
        </p>
      </div>

      {/* New Users This Month Card */}
      <div className="p-6 bg-white shadow rounded-lg w-full">
        <h3 className="text-gray-600 text-sm font-medium">
          New Users This Month
        </h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {loadingNew ? "Loading..." : newUsers}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Data fetched securely from Clerk API
        </p>
      </div>
    </div>
  );
}
