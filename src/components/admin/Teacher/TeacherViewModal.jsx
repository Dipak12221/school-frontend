import "./TeacherViewModal.css";

function TeacherViewModal({ teacher, onClose }) {
  if (!teacher) return null;

  return (
    <div className="modal-overlay">
      <div className="teacher-view-modal">
        <h2>Teacher Details</h2>

        <div className="teacher-header">
          <img
            src={teacher.photo || "/default-avatar.png"}
            alt={teacher.name}
            className="teacher-image"
          />

          <div className="teacher-header-info">
            <h3>{teacher.name}</h3>
            <span>{teacher.teacherId}</span>
          </div>
        </div>

        <hr className="teacher-divider" />

        {/* Details */}
        <div className="teacher-grid">
          <div className="info-card">
            <label>Subject</label>
            <p>{teacher.subject}</p>
          </div>

          <div className="info-card">
            <label>Qualification</label>
            <p>{teacher.qualification}</p>
          </div>

          <div className="info-card">
            <label>Experience</label>
            <p>{teacher.experience}</p>
          </div>

          <div className="info-card">
            <label>Mobile</label>
            <p>{teacher.mobile}</p>
          </div>

          <div className="info-card">
            <label>Email</label>
            <p>{teacher.email}</p>
          </div>

          <div className="info-card">
            <label>Gender</label>
            <p>{teacher.gender}</p>
          </div>

          <div className="info-card">
            <label>Joining Date</label>
            <p>{teacher.joiningDate}</p>
          </div>

          <div className="info-card">
            <label>Salary</label>
            <p>₹ {teacher.salary}</p>
          </div>

          <div className="info-card">
            <label>Status</label>
            <p
              style={{
                color: teacher.status === "Active" ? "#198754" : "#dc3545",
                fontWeight: "600",
              }}
            >
              {teacher.status}
            </p>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default TeacherViewModal;
