import React from "react";
import useAuth from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaClipboardList,
  FaBullhorn,
  FaImages,
  FaBus,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const { logout } = useAuth(); // Auth context se logout destructured

  const handleLogout = () => {
    // 1. Auth State reset karein
    if (logout) {
      logout();
    }

    // 2. Storage clear karein
    localStorage.clear();

    // 3. Success Toast
    toast.success("Logged out successfully!");

    // 4. Window replace se internal history reset karke Admin Login par redirect karein
    window.location.replace("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <img src="/logo.png" alt="School Logo" />
        <h2>Admin Panel</h2>
      </div>

      <nav>
        <NavLink to="/admin/dashboard">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/students">
          <FaUserGraduate />
          <span>Students</span>
        </NavLink>

        <NavLink to="/admin/teachers">
          <FaChalkboardTeacher />
          <span>Teachers</span>
        </NavLink>

        <NavLink to="/admin/fees">
          <FaMoneyBillWave />
          <span>Fees</span>
        </NavLink>

        <NavLink to="/admin/results">
          <FaClipboardList />
          <span>Results</span>
        </NavLink>

        <NavLink to="/admin/notices">
          <FaBullhorn />
          <span>Notices</span>
        </NavLink>

        <NavLink to="/admin/gallery">
          <FaImages />
          <span>Gallery</span>
        </NavLink>

        <NavLink to="/admin/transport">
          <FaBus />
          <span>Transport</span>
        </NavLink>

        <NavLink to="/admin/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>

      <button className="admin-logout" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
