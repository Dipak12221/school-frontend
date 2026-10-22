import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaUserPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  exportPDF,
  exportExcel,
  printTeachers,
} from "../../utils/exportTeachers";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import Loader from "../../components/common/Loader/Loader";
import teacherService from "../../services/teacherService";
import TeacherModal from "../../components/admin/Teacher/TeacherModal";
import TeacherViewModal from "../../components/admin/Teacher/TeacherViewModal";
import "./Students.css";
import "./Teachers.css";
import "../../components/admin/Teacher/DeleteModal.css";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const teachersPerPage = 10;

  // Fetch real data from backend API
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data || []);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch teachers";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sortedTeachers = [...teachers].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setTeachers(sortedTeachers);
  };

  const handleAddTeacher = async (newTeacher) => {
    try {
      const createdTeacher = await teacherService.addTeacher(newTeacher);
      setTeachers((prev) => [createdTeacher, ...prev]);
      toast.success("Teacher Added Successfully");
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleUpdateTeacher = async (updatedTeacher) => {
    const teacherId = updatedTeacher._id || updatedTeacher.id;
    try {
      const result = await teacherService.updateTeacher(
        teacherId,
        updatedTeacher,
      );
      setTeachers((prev) =>
        prev.map((teacher) =>
          (teacher._id || teacher.id) === (result._id || result.id)
            ? result
            : teacher,
        ),
      );
      toast.success("Teacher Updated Successfully");
      setShowModal(false);
      setEditingTeacher(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update teacher");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteTeacherId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteTeacher = async () => {
    if (!deleteTeacherId) return;
    setDeleting(true);
    try {
      await teacherService.deleteTeacher(deleteTeacherId);
      setTeachers((prev) =>
        prev.filter(
          (teacher) => (teacher._id || teacher.id) !== deleteTeacherId,
        ),
      );
      toast.success("Teacher Deleted Successfully");
      setShowDeleteModal(false);
      setDeleteTeacherId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete teacher");
    } finally {
      setDeleting(false);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.teacherId?.toLowerCase().includes(search.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * teachersPerPage;
  const firstIndex = lastIndex - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage) || 1;

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          <div className="Teacher-header">
            <h1>Teacher Management</h1>

            <div className="Teacher-header-right">
              <div className="Teacher-search">
                <input
                  type="text"
                  placeholder="Search by Name, Teacher ID or Subject..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="Teacher-bottom-row">
                <div className="export-buttons">
                  <button onClick={() => exportPDF(filteredTeachers)}>
                    <FaFilePdf />
                  </button>
                  <button onClick={() => exportExcel(filteredTeachers)}>
                    <FaFileExcel />
                  </button>
                  <button onClick={() => printTeachers(filteredTeachers)}>
                    <FaPrint />
                  </button>
                </div>

                <button
                  className="add-student-btn"
                  onClick={() => {
                    setEditingTeacher(null);
                    setShowModal(true);
                  }}
                >
                  <FaUserPlus />
                </button>
              </div>
            </div>
          </div>

          <div className="students-table">
            {loading ? (
              <Loader />
            ) : error ? (
              <div
                className="error-container"
                style={{ textAlign: "center", padding: "40px 20px" }}
              >
                <FaExclamationTriangle size={36} color="#dc2626" />
                <p style={{ margin: "10px 0", color: "#64748b" }}>{error}</p>
                <button
                  className="admin-login-btn"
                  style={{ width: "auto", padding: "0 20px" }}
                  onClick={fetchTeachers}
                >
                  Retry
                </button>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("teacherId")}>
                      Teacher ID{" "}
                      {sortField === "teacherId" &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                    <th>Photo</th>
                    <th onClick={() => handleSort("name")}>
                      Name{" "}
                      {sortField === "name" &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                    <th onClick={() => handleSort("subject")}>
                      Subject{" "}
                      {sortField === "subject" &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                    <th>Qualification</th>
                    <th onClick={() => handleSort("experience")}>
                      Experience{" "}
                      {sortField === "experience" &&
                        (sortOrder === "asc" ? " ▲" : " ▼")}
                    </th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentTeachers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No Teachers Found
                      </td>
                    </tr>
                  ) : (
                    currentTeachers.map((teacher) => {
                      const teacherId = teacher._id || teacher.id;
                      return (
                        <tr key={teacherId}>
                          <td>{teacher.teacherId || "-"}</td>
                          <td>
                            {teacher.photo ? (
                              <img
                                src={teacher.photo}
                                alt={teacher.name}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "No Photo"
                            )}
                          </td>
                          <td>{teacher.name}</td>
                          <td>{teacher.subject}</td>
                          <td>{teacher.qualification || "-"}</td>
                          <td>{teacher.experience || "-"}</td>
                          <td>{teacher.mobile || "-"}</td>
                          <td>
                            <span
                              className={
                                teacher.status === "Active"
                                  ? "status active"
                                  : "status inactive"
                              }
                            >
                              {teacher.status || "Active"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view-btn"
                                title="View"
                                onClick={() => {
                                  setSelectedTeacher(teacher);
                                  setShowViewModal(true);
                                }}
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit-btn"
                                title="Edit"
                                onClick={() => {
                                  setEditingTeacher(teacher);
                                  setShowModal(true);
                                }}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                title="Delete"
                                onClick={() => openDeleteModal(teacherId)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}

            {showModal && (
              <TeacherModal
                editingTeacher={editingTeacher}
                onSave={editingTeacher ? handleUpdateTeacher : handleAddTeacher}
                onClose={() => {
                  setShowModal(false);
                  setEditingTeacher(null);
                }}
              />
            )}

            {showViewModal && (
              <TeacherViewModal
                teacher={selectedTeacher}
                onClose={() => {
                  setShowViewModal(false);
                  setSelectedTeacher(null);
                }}
              />
            )}

            {showDeleteModal && (
              <div className="modal-overlay">
                <div className="delete-modal">
                  <h2>Delete Teacher</h2>
                  <p>Are you sure you want to delete this teacher?</p>
                  <div className="delete-buttons">
                    <button
                      className="cancel-btn"
                      disabled={deleting}
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteTeacherId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-confirm-btn"
                      disabled={deleting}
                      onClick={handleDeleteTeacher}
                    >
                      {deleting ? (
                        <FaSpinner className="spinning-icon" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && filteredTeachers.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {firstIndex + 1} -{" "}
                  {Math.min(lastIndex, filteredTeachers.length)} of{" "}
                  {filteredTeachers.length} Teachers
                </div>

                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active-page" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teachers;
