import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return children;
}
