import "./StudentViewModal.css";

function StudentViewModal({ student, onClose }) {
        console.log(student)
  return (
    
    <div className="modal-overlay">
      <div className="student-view-modal">
        <h2>Student Details</h2>

        <div className="student-profile">
  <img src="/student.png" alt="Student" />

  <div className="student-info">
    <h3>{student.name}</h3>
    <p>{student.enrollment}</p>
  </div>
</div>

  <div className="student-details">

  <div>
    <strong>Class</strong>
    <span>{student.class}</span>
  </div>

  <div>
    <strong>Roll No</strong>
    <span>{student.rollNo}</span>
  </div>

  <div>
    <strong>Gender</strong>
    <span>{student.gender}</span>
  </div>

  <div>
    <strong>Mobile</strong>
    <span>{student.mobile}</span>
  </div>

  <div>
    <strong>Email</strong>
    <span>{student.email}</span>
  </div>

  <div>
    <strong>Status</strong>

    <span
      className={
        student.status === "Active"
          ? "active-status"
          : "inactive-status"
      }
    >
      {student.status}
    </span>

  </div>

</div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default StudentViewModal;