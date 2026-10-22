import {
  FaTachometerAlt,
  FaUser,
  FaMoneyBillWave,
  FaClipboardList,
  FaBullhorn,
  FaCalendarAlt,
  FaBus,
  FaCog,
  FaSignOutAlt,
  FaClipboardCheck,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "./Sidebar.css";

function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    // 1. Auth State reset & Storage clear
    if (logout) {
      logout();
    }
    localStorage.clear();

    // 2. History reset karke Student Login par redirect
    window.location.replace("/student/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/logo.png" alt="School Logo" />
        <h2>ABC School</h2>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <NavLink to="/student/dashboard">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/student/profile">
          <FaUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink to="/student/fees">
          <FaMoneyBillWave />
          <span>Fees</span>
        </NavLink>

        <NavLink to="/student/results">
          <FaClipboardList />
          <span>Results</span>
        </NavLink>

        <NavLink to="/student/notices">
          <FaBullhorn />
          <span>Notices</span>
        </NavLink>

        <NavLink to="/student/timetable">
          <FaCalendarAlt />
          <span>Timetable</span>
        </NavLink>

        <NavLink to="/student/transport">
          <FaBus />
          <span>Transport</span>
        </NavLink>

        <NavLink to="/student/attendance">
          <FaClipboardCheck />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/student/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
