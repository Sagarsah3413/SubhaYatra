import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const admin = localStorage.getItem("admin"); // check the stored admin object
  const location = useLocation();

  if (!admin) {
    // Not logged in, redirect to admin login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
