import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { FaUserGraduate, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Back button par click karte hi history loop tod kar Home Page (/) par bhejne ke liye
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Purane visited pages ki history bypass karke seedha Home Page par redirect karein
      window.location.replace("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Dummy Login
      login({
        id: data.studentId,
        name: "Dipak Yadav",
        role: "student",
      });

      toast.success("Login Successful");

      // Replace: true se login page ki history override ho jayegi
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      toast.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* School Logo */}
        <div className="login-logo">
          <img src="/logo.png" alt="School Logo" />
        </div>

        <h2>Student Login</h2>
        <p>Welcome Back</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Student ID */}
          <div className="input-group">
            <FaUserGraduate className="input-icon" />
            <input
              type="text"
              placeholder="Student ID"
              {...register("studentId", {
                required: "Student ID is required",
              })}
            />
          </div>

          {errors.studentId && (
            <small className="error">{errors.studentId.message}</small>
          )}

          {/* Password */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errors.password && (
            <small className="error">{errors.password.message}</small>
          )}

          {/* Remember */}
          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
            <Link to="#">Forgot Password?</Link>
          </div>

          {/* Button */}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
