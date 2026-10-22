import { Routes, Route, Navigate } from "react-router-dom";
import WebsiteLayout from "../layouts/WebsiteLayout";
import useAuth from "../hooks/useAuth";

import Home from "../pages/website/Home";
import About from "../pages/website/About";
import Admission from "../pages/website/Admission";
import Gallery from "../pages/website/Gallery";
import Notice from "../pages/website/Notice";
import Contact from "../pages/website/Contact";
import NotFound from "../pages/website/NotFound";

import Login from "../pages/student/Login";
import AdminLogin from "../pages/admin/Login";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/student/Dashboard";
import Profile from "../pages/student/Profile";

import StudentFees from "../pages/student/Fees";
import Results from "../pages/student/Results";
import Notices from "../pages/student/Notices";
import Timetable from "../pages/student/Timetable";
import Transport from "../pages/student/Transport";
import Attendance from "../pages/student/Attendance";
import Settings from "../pages/student/Settings";

/* Admin Protected Route */
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Teachers from "../pages/admin/Teachers";
import AdminFees from "../pages/admin/Fees";
import AdminResults from "../pages/admin/Results";
import AdminNotices from "../pages/admin/Notices";
import AdminGallery from "../pages/admin/Gallery";
import AdminTransport from "../pages/admin/Transport";
import AdminSetting from "../pages/admin/Settings";

// Helper Component: Already logged in user ko dashboard bhejne ke liye
const PublicOnlyRoute = ({ children, redirectTo }) => {
  const { user } = useAuth();
  return user ? <Navigate to={redirectTo} replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Website Layout */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Student Login (Logged-in user yahan aayega toh dashboard chala jayega) */}
      <Route
        path="/student/login"
        element={
          <PublicOnlyRoute redirectTo="/student/dashboard">
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Admin Login */}
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute redirectTo="/admin/dashboard">
            <AdminLogin />
          </PublicOnlyRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/fees"
        element={
          <ProtectedRoute role="student">
            <StudentFees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results"
        element={
          <ProtectedRoute role="student">
            <Results />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/timetable"
        element={
          <ProtectedRoute role="student">
            <Timetable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/notices"
        element={
          <ProtectedRoute role="student">
            <Notices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/transport"
        element={
          <ProtectedRoute role="student">
            <Transport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute role="student">
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/settings"
        element={
          <ProtectedRoute role="student">
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <AdminProtectedRoute>
            <Students />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <AdminProtectedRoute>
            <Teachers />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/fees"
        element={
          <AdminProtectedRoute>
            <AdminFees />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/results"
        element={
          <AdminProtectedRoute>
            <AdminResults />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <AdminProtectedRoute>
            <AdminNotices />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <AdminProtectedRoute>
            <AdminGallery />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/transport"
        element={
          <AdminProtectedRoute>
            <AdminTransport />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <AdminSetting />
          </AdminProtectedRoute>
        }
      />

      {/* 404 (Hamesha Sabse End Me) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
