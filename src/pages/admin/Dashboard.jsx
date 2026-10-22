import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import API from "../../services/api";
import Loader from "../../components/common/Loader/Loader";
import adminData from "../../data/adminData";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaMoneyBillWave,
  FaUserPlus,
  FaBullhorn,
  FaClipboardList,
  FaImages,
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Live Dashboard Stats from Backend API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/dashboard/stats");
        setStats(data);
      } catch (error) {
        // Fallback to static adminData if Backend route isn't ready yet
        setStats(adminData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Quick Action Handlers with State Transfer
  const handleAddStudent = () => {
    navigate("/admin/students", { state: { openAddModal: true } });
  };

  const handleAddNotice = () => {
    navigate("/admin/notices", { state: { openAddModal: true } });
  };

  const handleUploadResult = () => {
    navigate("/admin/results", { state: { openAddModal: true } });
  };

  const handleUploadGallery = () => {
    navigate("/admin/gallery", { state: { openAddModal: true } });
  };

  // Safe Fallback Data
  const currentStats = stats || adminData;

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          {/* Welcome Section */}
          <div className="admin-welcome">
            <div>
              <h1>Welcome Admin 👋</h1>
              <p>Manage your school efficiently from one dashboard.</p>
            </div>
            <img src="/logo.png" alt="School Logo" />
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* Dashboard Cards */}
              <div className="admin-cards">
                <div className="admin-card">
                  <FaUserGraduate className="card-icon blue" />
                  <h2>{currentStats.totalStudents ?? 0}</h2>
                  <p>Total Students</p>
                </div>

                <div className="admin-card">
                  <FaChalkboardTeacher className="card-icon green" />
                  <h2>{currentStats.totalTeachers ?? 0}</h2>
                  <p>Total Teachers</p>
                </div>

                <div className="admin-card">
                  <FaSchool className="card-icon orange" />
                  <h2>{currentStats.totalClasses ?? 0}</h2>
                  <p>Total Classes</p>
                </div>

                <div className="admin-card">
                  <FaMoneyBillWave className="card-icon red" />
                  <h2>₹{currentStats.pendingFees ?? 0}</h2>
                  <p>Pending Fees</p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="admin-bottom">
                {/* Recent Activities */}
                <div className="activity-box">
                  <h2>Recent Activities</h2>
                  <ul>
                    {currentStats.recentActivities &&
                    currentStats.recentActivities.length > 0 ? (
                      currentStats.recentActivities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))
                    ) : (
                      <li>No recent activity logged.</li>
                    )}
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                  <h2>Quick Actions</h2>
                  <div className="action-grid">
                    <button onClick={handleAddStudent}>
                      <FaUserPlus />
                      Add Student
                    </button>

                    <button onClick={handleAddNotice}>
                      <FaBullhorn />
                      Add Notice
                    </button>

                    <button onClick={handleUploadResult}>
                      <FaClipboardList />
                      Upload Result
                    </button>

                    <button onClick={handleUploadGallery}>
                      <FaImages />
                      Upload Gallery
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
