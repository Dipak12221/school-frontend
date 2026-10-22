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

          <img
            src="/logo.png"
            alt="School Logo"
          />

          <div className="logo-text">

            <h2>ABC Public School</h2>

            <span>CBSE Affiliated School</span>

          </div>

        </Link>

        {/* Navigation */}

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

        </nav>

        {/* Right Buttons */}

        <div className="nav-buttons">

          <Link
            to="/student/login"
            className="student-btn"
          >
            <FaUserGraduate />
            Student Login
          </Link>

          <Link
            
            to="/admin/login"
            className="admin-btn"
          >
            <FaUserShield />
            Admin Login
          </Link>

        </div>

        {/* Mobile Menu */}

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

    </header>
  );
}

export default Navbar;