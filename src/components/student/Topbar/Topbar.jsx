import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import "./Topbar.css";

function Topbar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    // 1. Context aur LocalStorage se logout karein
    if (logout) {
      logout();
    }
    localStorage.clear();

    // 2. Window replace se history stack reset karke login page par bhej dein
    window.location.replace("/student/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>Student Dashboard</h2>
      </div>

      <div className="topbar-right">
        <button className="notification-btn">
          <FaBell />
        </button>

        <div className="student-info">
          <FaUserCircle className="profile-icon" />
          <div>
            <h4>Dipak Yadav</h4>
            <span>Class 10 - A</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
