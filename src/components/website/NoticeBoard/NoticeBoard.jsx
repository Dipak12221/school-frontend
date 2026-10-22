import "./NoticeBoard.css";
import notices from "../../../assets/data/notices";
import { FaBell, FaDownload } from "react-icons/fa";

function NoticeBoard() {
  return (
    <section className="notice-board">
      <div className="container">

        <div className="section-heading">
          <span>Latest Updates</span>
          <h2>Notice Board</h2>
          <p>
            Stay updated with the latest announcements and important notices.
          </p>
        </div>

        <div className="notice-list">

          {notices.map((notice) => (

            <div className="notice-card" key={notice.id}>

              <div className="notice-left">

                <div className="notice-icon">
                  <FaBell />
                </div>

                <div>

                  <h3>{notice.title}</h3>

                  <small>
                    {notice.date} • {notice.type}
                  </small>

                </div>

              </div>

              <div className="notice-right">

                {notice.isNew && (
                  <span className="new-badge">
                    NEW
                  </span>
                )}

                <button className="download-btn">

                  <FaDownload />

                </button>

              </div>

            </div>

          ))}

        </div>

        <div className="view-all">

          <button>
            View All Notices
          </button>

        </div>

      </div>
    </section>
  );
}

export default NoticeBoard;