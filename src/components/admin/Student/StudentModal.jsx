import { useState, useEffect } from "react";
import "./StudentModal.css";

function StudentModal({ student, onClose, onAddStudent, onUpdateStudent }) {
  const initialState = {
    enrollment: "",
    name: "",
    class: "",
    rollNo: "",
    mobile: "",
    email: "",
    gender: "Male",
    status: "Active",
    photo: "",
  };

  const [formData, setFormData] = useState(initialState);

  // =============================
  // Fill Data When Edit Clicked
  // =============================

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData(initialState);
    }
  }, [student]);

  // =============================
  // Handle Input Change
  // =============================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // Submit
  // =============================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (student) {
      onUpdateStudent(formData);
    } else {
      onAddStudent(formData);
    }

    setFormData(initialState);

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="student-modal">
        <h2>{student ? "Edit Student" : "Add Student"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="enrollment"
            placeholder="Enrollment Number"
            value={formData.enrollment}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={formData.class}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="rollNo"
            placeholder="Roll No"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <div className="form-group">
            <label>Student Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  const reader = new FileReader();

                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      photo: reader.result,
                    }));
                  };

                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          {formData.photo && (
            <div className="form-group">
              <img
                src={formData.photo}
                alt="Student"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {student ? "Update Student" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentModal;
