import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Custom Hook import
import useAuth from "../../hooks/useAuth";
import "../../styles/AdminLogin.css";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // AuthContext se login function access karein

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Agar user pehle se logged-in hai, toh Direct Dashboard par redirect karein
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // 2. Saved email load karein agar 'Remember Me' pehle se saved ho
  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Form Submit Handler (Real API Integration)
  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    // Validation check
    if (!trimmedEmail || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Real API Call: Hardcoded checks ki jagah AuthContext ke login function se Backend API ko email/password bhejein
      const res = await login(trimmedEmail, password);

      // Agar Backend response success return kare
      if (res.success) {
        // Remember Me functionality: Email ko local storage me save ya clear karein
        if (rememberMe) {
          localStorage.setItem("admin_remembered_email", trimmedEmail);
        } else {
          localStorage.removeItem("admin_remembered_email");
        }

        toast.success("Login successful! Redirecting...");
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Agar backend error throw kare (e.g., Wrong Password / User Not Found)
        toast.error(res.message || "Invalid email address or password.");
      }
    } catch (error) {
      // Network ya Server Failures handle karne ke liye
      toast.error(error?.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        {/* Logo */}
        <div className="admin-login-logo">
          <img src="/logo.png" alt="School Logo" />
        </div>

        {/* Header */}
        <div className="admin-login-header">
          <h2>School Management Portal</h2>
          <p>Administrator Login</p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          {/* Email Input */}
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email Address</label>
            <div className="input-box">
              <FaUserShield className="input-icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="Enter Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-box">
              <FaLock className="input-icon" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-icon-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="admin-options">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* Submit Button */}
          <button className="admin-login-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinning-icon" /> Logging In...
              </>
            ) : (
              "Admin Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
