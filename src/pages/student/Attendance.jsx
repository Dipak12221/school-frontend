import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import attendanceData from "../../data/attendanceData";

import "./Attendance.css";

function Attendance() {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          <h1 className="page-title">Attendance</h1>

          {/* ================= Summary Cards ================= */}

          <div className="attendance-cards">

            <div className="attendance-card">
              <h3>Overall Attendance</h3>
              <h2>{attendanceData.overall}</h2>
            </div>

            <div className="attendance-card">
              <h3>Working Days</h3>
              <h2>{attendanceData.workingDays}</h2>
            </div>

            <div className="attendance-card">
              <h3>Present Days</h3>
              <h2>{attendanceData.present}</h2>
            </div>

            <div className="attendance-card">
              <h3>Absent Days</h3>
              <h2>{attendanceData.absent}</h2>
            </div>

          </div>

          {/* ================= Progress ================= */}

          <div className="attendance-progress">

            <h2>Attendance Progress</h2>

            <div className="progress">

              <div
                className="progress-bar"
                style={{ width: attendanceData.overall }}
              >
                {attendanceData.overall}
              </div>

            </div>

          </div>

          {/* ================= Monthly Table ================= */}

          <div className="attendance-table">

            <h2>Monthly Attendance</h2>

            <table>

              <thead>

                <tr>
                  <th>Month</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Percentage</th>
                </tr>

              </thead>

              <tbody>

                {attendanceData.monthly.map((item, index) => (

                  <tr key={index}>

                    <td>{item.month}</td>

                    <td>{item.present}</td>

                    <td>{item.absent}</td>

                    <td>{item.percentage}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Attendance;