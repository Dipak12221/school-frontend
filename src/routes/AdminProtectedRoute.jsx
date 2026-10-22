import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AdminProtectedRoute({ children }) {
  const { user } = useAuth();

  // LocalStorage se fallback check
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUser = user || storedUser;

  // Role check ("admin")
  const isAdmin =
    currentUser &&
    currentUser.role &&
    currentUser.role.toLowerCase() === "admin";

  // Agar user missing ho ya admin role na ho toh hi login par bhejein
  if (!currentUser || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
