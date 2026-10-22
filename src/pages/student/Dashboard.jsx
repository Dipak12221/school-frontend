import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";
import DashboardCard from "../../components/student/DashboardCard/DashboardCard";
import studentData from "../../data/studentData";

import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          {/* ================= Welcome Banner ================= */}

          <div className="welcome-banner">

            <div className="welcome-text">

              <h1>Welcome Back 👋</h1>

              <h2>{studentData.name}</h2>

              <p><strong>Class:</strong> {studentData.class}</p>

              <p><strong>Roll No:</strong> {studentData.rollNo}</p>

              <p><strong>Academic Year:</strong> {studentData.academicYear}</p>

            </div>

            <div className="welcome-image">

              <img
                src="/logo.png"
                alt="Student"
              />

            </div>

          </div>

          {/* ================= Dashboard Cards ================= */}

          <div className="cards">

            <DashboardCard
              title="Attendance"
              value={studentData.attendance}
            />

            <DashboardCard
              title="Pending Fees"
              value={`₹${studentData.pendingFee}`}
            />

            <DashboardCard
              title="Latest Result"
              value={studentData.result}
            />

            <DashboardCard
              title="Notices"
              value={`${studentData.notices.length} New`}
            />

          </div>

          {/* ================= Notices & Events ================= */}

          <div className="dashboard-row">

            {/* Latest Notices */}

            <div className="dashboard-box">

              <h3>📢 Latest Notices</h3>

              <ul>

                {studentData.notices.map((notice, index) => (

                  <li key={index}>
                    ➡️ {notice}
                  </li>

                ))}

              </ul>

            </div>

            {/* Upcoming Events */}

            <div className="dashboard-box">

              <h3>📅 Upcoming Events</h3>

              <ul>

                {studentData.events.map((event, index) => (

                  <li key={index}>
                    📅 {event}
                  </li>

                ))}

              </ul>

            </div>

          </div>

          {/* ================= Dashboard Stats ================= */}

          <div className="dashboard-stats">

            {/* Attendance */}

            <div className="stat-box">

              <h3>📊 Attendance</h3>

              <div className="progress">

                <div
                  className="progress-bar"
                  style={{ width: studentData.attendance }}
                >
                  {studentData.attendance}
                </div>

              </div>

            </div>

            {/* Fee Status */}

            <div className="stat-box">

              <h3>💰 Fee Status</h3>

              <p>Total Fee : ₹{studentData.totalFee}</p>

              <p>Paid : ₹{studentData.paidFee}</p>

              <p style={{ color: "red" }}>
                Pending : ₹{studentData.pendingFee}
              </p>

            </div>

            {/* Student Profile */}

            <div className="stat-box">

              <h3>👤 Student Profile</h3>

              <img
                src="/logo.png"
                alt="Student"
                className="student-photo"
              />

              <h4>{studentData.name}</h4>

              <p>Class {studentData.class}</p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;