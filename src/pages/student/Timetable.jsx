import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import timetableData from "../../data/timetableData";

import "./Timetable.css";

function Timetable() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">
          <h1 className="page-title">Class Time Table</h1>

          {timetableData.map((day, index) => (
            <div className="timetable-card" key={index}>
              <h2>{day.day}</h2>

              <table>
                <thead>
                  <tr>
                    <th>Time</th>

                    <th>Subject</th>

                    <th>Teacher</th>

                    <th>Room</th>
                  </tr>
                </thead>

                <tbody>
                  {day.periods.map((period, i) => (
                    <tr key={i}>
                      <td>{period.time}</td>

                      <td>{period.subject}</td>

                      <td>{period.teacher}</td>

                      <td>{period.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timetable;
