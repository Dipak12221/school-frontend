import React from "react";
import { toast } from "react-toastify";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

import "./Topbar.css";

function Topbar() {
  const { logout } = useAuth(); // Auth Context se logout destructured

  const handleLogout = () => {
    // 1. Auth State reset karein
    if (logout) {
      logout();
    }

    // 2. Storage clear karein
    localStorage.clear();

    // 3. Success Toast
    toast.success("Logged out successfully!");

    // 4. Window replace se internal history reset karke Admin Login page par redirect karein
    window.location.replace("/admin/login");
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h2>Admin Dashboard</h2>
      </div>

      <div className="admin-topbar-right">
        <button className="admin-notification">
          <FaBell />
          <span className="notification-count">3</span>
        </button>

        <div className="admin-profile">
          <FaUserCircle className="admin-profile-icon" />
          <div className="admin-info">
            <h4>Administrator</h4>
            <p>School Admin</p>
          </div>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
