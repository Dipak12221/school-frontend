import React, { useState } from "react";
import {
  FaSchool,
  FaLock,
  FaBell,
  FaGraduationCap,
  FaCreditCard,
  FaSave,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  // General School Info State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: "St. Xavier's International School",
    schoolCode: "SCH-2026-9081",
    email: "admin@stxaviers.edu.in",
    phone: "+91 98765 43210",
    academicSession: "2025-2026",
    address: "Knowledge Park III, Greater Noida, UP - 201306",
    website: "https://www.stxaviers.edu.in",
    logoPreview: null,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    enableTwoFactor: true,
    sessionTimeout: "30",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    whatsappAlerts: false,
    feeReminders: true,
    examNotifications: true,
    attendanceAlerts: true,
  });

  // Academic & Grading Settings State
  const [academicSettings, setAcademicSettings] = useState({
    passPercentage: "33",
    maxAttendanceMarks: "10",
    gradingSystem: "CBSE Standard (A+ to E)",
    currentTerm: "Annual Term",
    resultPublishStatus: "Draft Mode",
  });

  // Payment Gateway Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "INR (₹)",
    receiptPrefix: "INV-2026-",
    merchantId: "MID_XAVIER_99812",
    gatewayStatus: "Live",
  });

  // Handlers
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecuritySettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAcademicChange = (e) => {
    const { name, value } = e.target;
    setAcademicSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setGeneralSettings((prev) => ({ ...prev, logoPreview: imageUrl }));
      toast.success("School logo uploaded successfully!");
    }
  };

  const handleSaveAll = (e) => {
    e.preventDefault();

    // Password validation if security tab is updated
    if (activeTab === "security") {
      if (
        securitySettings.newPassword &&
        securitySettings.newPassword !== securitySettings.confirmPassword
      ) {
        toast.error("New password and confirm password do not match!");
        return;
      }
    }

    toast.success("Settings saved successfully!");
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-dashboard-main">
        <Topbar />
        <div className="admin-dashboard-content">
          <div className="settings-page">
            {/* Header Section */}
            <div className="settings-page-header">
              <div>
                <h1>System Settings</h1>
                <p>
                  Manage school profile, system security, notifications &
                  academics
                </p>
              </div>
              <button className="settings-save-btn" onClick={handleSaveAll}>
                <FaSave /> Save Changes
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="settings-tabs-container">
              <button
                className={`settings-tab-btn ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <FaSchool /> General Profile
              </button>
              <button
                className={`settings-tab-btn ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <FaLock /> Security & Auth
              </button>
              <button
                className={`settings-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <FaBell /> Notifications
              </button>
              <button
                className={`settings-tab-btn ${activeTab === "academic" ? "active" : ""}`}
                onClick={() => setActiveTab("academic")}
              >
                <FaGraduationCap /> Academic Setup
              </button>
              <button
                className={`settings-tab-btn ${activeTab === "payment" ? "active" : ""}`}
                onClick={() => setActiveTab("payment")}
              >
                <FaCreditCard /> Fee & Payment
              </button>
            </div>

            {/* Tab Contents */}
            <div className="settings-content-card">
              {/* 1. GENERAL SCHOOL PROFILE */}
              {activeTab === "general" && (
                <form onSubmit={handleSaveAll} className="settings-form">
                  <div className="settings-section-title">
                    <h3>School Profile Details</h3>
                    <p>
                      Update official school identification details and contact
                      information.
                    </p>
                  </div>

                  <div className="logo-upload-container">
                    <div className="logo-preview-box">
                      {generalSettings.logoPreview ? (
                        <img
                          src={generalSettings.logoPreview}
                          alt="School Logo"
                        />
                      ) : (
                        <div className="logo-placeholder">
                          <FaSchool />
                        </div>
                      )}
                    </div>
                    <div className="logo-upload-controls">
                      <label htmlFor="logo-input" className="logo-upload-btn">
                        <FaCloudUploadAlt /> Change School Logo
                      </label>
                      <input
                        id="logo-input"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        hidden
                      />
                      <small>Recommended size: 200x200px (PNG, JPG)</small>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="settings-form-group">
                      <label>School Name</label>
                      <input
                        type="text"
                        name="schoolName"
                        value={generalSettings.schoolName}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>School Affiliation / Code</label>
                      <input
                        type="text"
                        name="schoolCode"
                        value={generalSettings.schoolCode}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 margin-top-16">
                    <div className="settings-form-group">
                      <label>Admin Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={generalSettings.email}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Contact Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={generalSettings.phone}
                        onChange={handleGeneralChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 margin-top-16">
                    <div className="settings-form-group">
                      <label>Current Academic Session</label>
                      <select
                        name="academicSession"
                        value={generalSettings.academicSession}
                        onChange={handleGeneralChange}
                      >
                        <option value="2024-2025">2024 - 2025</option>
                        <option value="2025-2026">2025 - 2026</option>
                        <option value="2026-2027">2026 - 2027</option>
                      </select>
                    </div>
                    <div className="settings-form-group">
                      <label>Official Portal Website</label>
                      <input
                        type="url"
                        name="website"
                        value={generalSettings.website}
                        onChange={handleGeneralChange}
                      />
                    </div>
                  </div>

                  <div className="settings-form-group margin-top-16">
                    <label>School Full Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                    ></textarea>
                  </div>
                </form>
              )}

              {/* 2. SECURITY & AUTHENTICATION */}
              {activeTab === "security" && (
                <form onSubmit={handleSaveAll} className="settings-form">
                  <div className="settings-section-title">
                    <h3>Account Security</h3>
                    <p>
                      Manage your admin login credentials and multi-factor
                      security preferences.
                    </p>
                  </div>

                  <div className="form-grid-3">
                    <div className="settings-form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="••••••••"
                        value={securitySettings.currentPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                      />
                    </div>
                  </div>

                  <hr className="settings-divider" />

                  <div className="security-toggle-card">
                    <div className="security-info">
                      <FaShieldAlt className="shield-icon" />
                      <div>
                        <h4>Two-Factor Authentication (2FA)</h4>
                        <p>
                          Require an OTP code sent to email during admin login.
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securitySettings.enableTwoFactor}
                        onChange={() =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            enableTwoFactor: !prev.enableTwoFactor,
                          }))
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="form-grid-2 margin-top-20">
                    <div className="settings-form-group">
                      <label>Auto Session Timeout (Minutes)</label>
                      <select
                        name="sessionTimeout"
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecurityChange}
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="120">2 Hours</option>
                      </select>
                    </div>
                  </div>
                </form>
              )}

              {/* 3. NOTIFICATION PREFERENCES */}
              {activeTab === "notifications" && (
                <div className="settings-form">
                  <div className="settings-section-title">
                    <h3>System Alerts & Notifications</h3>
                    <p>
                      Configure automated communication settings for parents,
                      students, and teachers.
                    </p>
                  </div>

                  <div className="notifications-list">
                    <div className="notification-row">
                      <div>
                        <h4>Email Notifications</h4>
                        <p>
                          Send result updates and official notices via email.
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailAlerts}
                          onChange={() =>
                            handleNotificationToggle("emailAlerts")
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-row">
                      <div>
                        <h4>SMS Alerts</h4>
                        <p>
                          Send urgent attendance and emergency alerts directly
                          to parent phones.
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.smsAlerts}
                          onChange={() => handleNotificationToggle("smsAlerts")}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-row">
                      <div>
                        <h4>WhatsApp Messaging Integration</h4>
                        <p>
                          Automate report card PDF delivery over WhatsApp API.
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.whatsappAlerts}
                          onChange={() =>
                            handleNotificationToggle("whatsappAlerts")
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="notification-row">
                      <div>
                        <h4>Automatic Fee Reminders</h4>
                        <p>
                          Automate monthly fee due alerts 3 days prior to
                          deadline.
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.feeReminders}
                          onChange={() =>
                            handleNotificationToggle("feeReminders")
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. ACADEMIC & GRADING SETUP */}
              {activeTab === "academic" && (
                <form onSubmit={handleSaveAll} className="settings-form">
                  <div className="settings-section-title">
                    <h3>Academic Rules & Grading Configuration</h3>
                    <p>
                      Set minimum passing criteria, examination terms, and
                      grading standard.
                    </p>
                  </div>

                  <div className="form-grid-2">
                    <div className="settings-form-group">
                      <label>Minimum Passing Percentage (%)</label>
                      <input
                        type="number"
                        name="passPercentage"
                        value={academicSettings.passPercentage}
                        onChange={handleAcademicChange}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Grading Framework</label>
                      <select
                        name="gradingSystem"
                        value={academicSettings.gradingSystem}
                        onChange={handleAcademicChange}
                      >
                        <option value="CBSE Standard (A+ to E)">
                          CBSE Standard (A+ to E)
                        </option>
                        <option value="ICSE Percentage System">
                          ICSE Percentage System
                        </option>
                        <option value="GPA Scale (1.0 - 4.0)">
                          GPA Scale (1.0 - 4.0)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2 margin-top-16">
                    <div className="settings-form-group">
                      <label>Active Examination Term</label>
                      <select
                        name="currentTerm"
                        value={academicSettings.currentTerm}
                        onChange={handleAcademicChange}
                      >
                        <option value="Unit Test 1">Unit Test 1</option>
                        <option value="Half Yearly">Half Yearly</option>
                        <option value="Annual Term">Annual Term</option>
                      </select>
                    </div>
                    <div className="settings-form-group">
                      <label>Result Portal Visibility</label>
                      <select
                        name="resultPublishStatus"
                        value={academicSettings.resultPublishStatus}
                        onChange={handleAcademicChange}
                      >
                        <option value="Draft Mode">Hidden / Draft Mode</option>
                        <option value="Published to Students">
                          Live for Students & Parents
                        </option>
                      </select>
                    </div>
                  </div>
                </form>
              )}

              {/* 5. FEE & PAYMENT GATEWAY */}
              {activeTab === "payment" && (
                <form onSubmit={handleSaveAll} className="settings-form">
                  <div className="settings-section-title">
                    <h3>Fee Receipt & Gateway Settings</h3>
                    <p>
                      Configure online fee collection, merchant details, and
                      billing receipt prefixes.
                    </p>
                  </div>

                  <div className="form-grid-2">
                    <div className="settings-form-group">
                      <label>Default Currency</label>
                      <input
                        type="text"
                        name="currency"
                        value={paymentSettings.currency}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Fee Receipt Invoice Prefix</label>
                      <input
                        type="text"
                        name="receiptPrefix"
                        value={paymentSettings.receiptPrefix}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2 margin-top-16">
                    <div className="settings-form-group">
                      <label>Payment Gateway Merchant ID</label>
                      <input
                        type="text"
                        name="merchantId"
                        value={paymentSettings.merchantId}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Gateway Integration Status</label>
                      <select
                        name="gatewayStatus"
                        value={paymentSettings.gatewayStatus}
                        onChange={handlePaymentChange}
                      >
                        <option value="Live">Live / Production Mode</option>
                        <option value="Sandbox">Testing / Sandbox Mode</option>
                        <option value="Disabled">
                          Offline Collection Only
                        </option>
                      </select>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
