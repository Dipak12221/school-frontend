import { useState } from "react";

import Sidebar from "../../components/student/Sidebar/Sidebar";
import Topbar from "../../components/student/Topbar/Topbar";

import noticeData from "../../data/noticeData";

import "./Notices.css";

function Notices() {

  const [search, setSearch] = useState("");

  const filteredNotices = noticeData.filter((notice) =>
    notice.title.toLowerCase().includes(search.toLowerCase()) ||
    notice.category.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Topbar />

        <div className="dashboard-content">

          {/* ================= Page Title ================= */}

          <h1 className="page-title">
            Student Notices
          </h1>

          {/* ================= Search ================= */}

          <div className="search-box">

            <input
              type="text"
              placeholder="Search Notice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* ================= Notice Cards ================= */}

          <div className="student-notice-container">

            {filteredNotices.map((notice) => (

              <div
                className="student-notice-card"
                key={notice.id}
              >

                <div className="student-notice-header">

                  <h3>{notice.title}</h3>

                  {notice.important && (

                    <span className="student-important-badge">
                      Important
                    </span>

                  )}

                </div>

                <div className="student-notice-info">

                  <span>📅 {notice.date}</span>

                  <span className="student-category">
                    {notice.category}
                  </span>

                </div>

                <p>
                  {notice.description}
                </p>

              </div>

            ))}

            {filteredNotices.length === 0 && (

              <div className="student-no-notice">
                No notices found.
              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Notices;