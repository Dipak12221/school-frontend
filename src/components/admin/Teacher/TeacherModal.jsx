import React, { useState, useEffect } from "react";
import "./TeacherModal.css";
import { toast } from "react-toastify";

function TeacherModal({ onClose, onSave, editingTeacher }) {
  const [formData, setFormData] = useState({
    teacherId: "",
    name: "",
    gender: "Male",
    subject: "",
    qualification: "",
    experience: "",
    mobile: "",
    email: "",
    joiningDate: "",
    salary: "",
    status: "Active",
    photo: "",
  });
  useEffect(() => {
    if (editingTeacher) {
      setFormData(editingTeacher);
    }
  }, [editingTeacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.teacherId ||
      !formData.name ||
      !formData.subject ||
      !formData.mobile ||
      !formData.email
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    onSave(formData);
    if (editingTeacher) {
      toast.success("Teacher Updated Successfully");
    } else {
      toast.success("Teacher Added Successfully");
    }
    onClose();
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Teacher</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Teacher ID</label>

            <input
              type="text"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              placeholder="Teacher ID"
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject</label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
            />
          </div>

          <div className="form-group">
            <label>Qualification</label>

            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="Qualification"
            />
          </div>

          <div className="form-group">
            <label>Experience</label>

            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience"
            />
          </div>

          <div className="form-group">
            <label>Mobile</label>

            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label>Joining Date</label>

            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Salary</label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
            />
          </div>
          <div className="form-group">
            <label>Teacher Photo</label>

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
                alt="Teacher"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="submit">Save Teacher</button>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TeacherModal;
