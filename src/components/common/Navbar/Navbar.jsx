import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUserGraduate, FaUserShield } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png" alt="School Logo" />
          <div className="logo-text">
            <h2>ABC Public School</h2>
            <span>CBSE Affiliated School</span>
          </div>
        </Link>

        {/* Navigation Menu (Desktop & Mobile Links) */}
        <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/admission" onClick={closeMenu}>
            Admission
          </NavLink>
          <NavLink to="/gallery" onClick={closeMenu}>
            Gallery
          </NavLink>
          <NavLink to="/notice" onClick={closeMenu}>
            Notice
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {/* Ye Buttons Mobile Menu ke andar dikhenge */}
          <div className="mobile-nav-buttons">
            <Link
              to="/student/login"
              className="student-btn"
              onClick={closeMenu}
            >
              <FaUserGraduate />
              Student Login
            </Link>

            <Link to="/admin/login" className="admin-btn" onClick={closeMenu}>
              <FaUserShield />
              Admin Login
            </Link>
          </div>
        </nav>

        {/* Ye Buttons sirf Desktop Screen par dikhenge */}
        <div className="nav-buttons desktop-only-buttons">
          <Link to="/student/login" className="student-btn">
            <FaUserGraduate />
            Student Login
          </Link>

          <Link to="/admin/login" className="admin-btn">
            <FaUserShield />
            Admin Login
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
