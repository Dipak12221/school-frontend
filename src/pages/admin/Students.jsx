import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaUserPlus,
  FaTrash,
  FaEye,
  FaEdit,
  FaBus,
  FaUserCheck,
  FaAddressCard,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";
import transportService from "../../services/transportService"; // New import
import feeService from "../../services/feeService"; // New import
import Loader from "../../components/common/Loader/Loader";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import {
  exportPDF,
  exportExcel,
  printStudents,
} from "../../utils/exportStudents";
import "./Students.css";

const INITIAL_FORM = {
  enrollment: "",
  name: "",
  fatherName: "",
  fatherAadhaarNo: "",
  motherName: "",
  motherAadhaarNo: "",
  dob: "",
  gender: "Male",
  community: "GEN",
  aadhaarNo: "",
  class: "", // Separated Class
  section: "", // Separated Section
  rollNo: "",
  mobile: "",
  secondaryMobile: "",
  address: "",
  correspondenceAddress: "",
  sameAsResidential: false,
  studentType: "New",
  isTransport: false,
  busId: "", // From Transport Module
  busName: "",
  stopId: "", // From Fee Master Module
  stopName: "",
  transportFee: 0,
  feeCategory: "General",
  status: "Active",
  photo: "",
};

function Students() {
  const [students, setStudents] = useState([]);

  // Naye States for Dropdowns
  const [busList, setBusList] = useState([]);
  const [stopList, setStopList] = useState([]);
  const [feeClasses, setFeeClasses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Sort & Pagination
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM);

  // 1. Fetch Students, Buses, and Stops in parallel
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentsRes, busesRes, feeMasterRes] = await Promise.all([
        API.get("/students"),
        transportService.getAllRoutes().catch(() => []), // Transport Module se Van/Buses
        feeService.getMasterSetup().catch(() => null), // Fee Module se Stops/Price
      ]);

      setStudents(studentsRes.data || []);
      setBusList(busesRes || []);

      if (feeMasterRes && feeMasterRes.transportFees) {
        setStopList(feeMasterRes.transportFees);
      }
      if (feeMasterRes.classFees) {
        setFeeClasses(Object.keys(feeMasterRes.classFees));
      }
    } catch (error) {
      toast.error("Failed to load student or related data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Sorting
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...students].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setStudents(sorted);
  };

  // Filtered List
  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.enrollment && s.enrollment.toLowerCase().includes(term)) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(term)) ||
      (s.class && s.class.toLowerCase().includes(term));

    const matchesClass = !classFilter || s.class === classFilter;
    const matchesGender = !genderFilter || s.gender === genderFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;

    return matchesSearch && matchesClass && matchesGender && matchesStatus;
  });

  // Pagination bounds
  const lastIndex = currentPage * studentsPerPage;
  const firstIndex = lastIndex - studentsPerPage;
  const currentStudents = filteredStudents.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;

  // Form Field Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sameAsResidential") {
      setFormData((prev) => ({
        ...prev,
        sameAsResidential: checked,
        correspondenceAddress: checked
          ? prev.address
          : prev.correspondenceAddress,
      }));
    } else if (name === "address") {
      setFormData((prev) => ({
        ...prev,
        address: value,
        correspondenceAddress: prev.sameAsResidential
          ? value
          : prev.correspondenceAddress,
      }));
    } else if (name === "isTransport") {
      setFormData((prev) => ({
        ...prev,
        isTransport: checked,
        busId: checked ? prev.busId : "",
        busName: checked ? prev.busName : "",
        stopId: checked ? prev.stopId : "",
        stopName: checked ? prev.stopName : "",
        transportFee: checked ? prev.transportFee : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Bus Selection Handler
  const handleBusChange = (e) => {
    const selectedBusId = e.target.value;
    if (!selectedBusId) {
      setFormData((prev) => ({ ...prev, busId: "", busName: "" }));
      return;
    }
    const bus = busList.find((b) => b._id === selectedBusId);
    setFormData((prev) => ({
      ...prev,
      busId: selectedBusId,
      busName: bus ? bus.routeName : "",
    }));
  };

  // Stop Selection Handler
  const handleStopChange = (e) => {
    const selectedStopId = e.target.value;
    if (!selectedStopId) {
      setFormData((prev) => ({
        ...prev,
        stopId: "",
        stopName: "",
        transportFee: 0,
      }));
      return;
    }
    const stop = stopList.find((s) => s.id.toString() === selectedStopId);
    setFormData((prev) => ({
      ...prev,
      stopId: stop.id,
      stopName: stop.routeName,
      transportFee: stop.fee,
    }));
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const newEnrollmentNo = `STU00${students.length + 1}`;
    setEditingStudent(null);
    setFormData({
      ...INITIAL_FORM,
      enrollment: newEnrollmentNo,
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ ...student });
    setShowModal(true);
  };

  // 2. Save / Update Student via API
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.class ||
      !formData.section ||
      !formData.mobile
    ) {
      toast.error(
        "Please fill required fields (Name, Class, Section, Primary Contact).",
      );
      return;
    }

    setBtnLoading(true);
    try {
      if (editingStudent) {
        const studentId = editingStudent._id || editingStudent.id;
        const { data } = await API.put(`/students/${studentId}`, formData);
        setStudents((prev) =>
          prev.map((s) => ((s._id || s.id) === studentId ? data : s)),
        );
        toast.success("Student details updated successfully!");
      } else {
        const { data } = await API.post("/students", formData);
        setStudents((prev) => [data, ...prev]);
        toast.success("New Admission completed successfully!");
      }
      setShowModal(false);
    } catch (error) {
      // Global Interceptor handles error
    } finally {
      setBtnLoading(false);
    }
  };

  // 3. Delete Action via API
  const confirmDelete = async () => {
    if (!deleteStudent) return;
    const studentId = deleteStudent._id || deleteStudent.id;

    setBtnLoading(true);
    try {
      await API.delete(`/students/${studentId}`);
      setStudents((prev) => prev.filter((s) => (s._id || s.id) !== studentId));
      toast.success("Student Record Deleted!");
      setDeleteStudent(null);
    } catch (error) {
      // Global Interceptor
    } finally {
      setBtnLoading(false);
    }
  };

  // 4. Bulk Delete via API
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) {
      toast.warn("Please select at least one student.");
      return;
    }
    if (
      window.confirm(`Delete ${selectedStudents.length} selected students?`)
    ) {
      setBtnLoading(true);
      try {
        await API.post("/students/bulk-delete", { ids: selectedStudents });
        setStudents((prev) =>
          prev.filter((s) => !selectedStudents.includes(s._id || s.id)),
        );
        setSelectedStudents([]);
        toast.success("Selected students deleted successfully!");
      } catch (error) {
        // Global Interceptor
      } finally {
        setBtnLoading(false);
      }
    }
  };

  // Checkbox Handlers
  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const currentIds = currentStudents.map((s) => s._id || s.id);
    const allSelected = currentIds.every((id) => selectedStudents.includes(id));

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !currentIds.includes(id)),
      );
    } else {
      setSelectedStudents((prev) =>
        Array.from(new Set([...prev, ...currentIds])),
      );
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-dashboard-main">
        <Topbar />
        <div className="admin-dashboard-content">
          <div className="students-page">
            {/* HEADER SECTION */}
            <div className="students-header">
              <h1>Student Management</h1>

              <div className="students-header-right">
                <div className="students-top-row">
                  <div className="students-search">
                    <input
                      type="text"
                      placeholder="Search by Name, Father's Name, Enrollment, Class..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>

                <div className="students-bottom-row">
                  <div className="students-filters">
                    <select
                      value={classFilter}
                      onChange={(e) => {
                        setClassFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Classes</option>
                      <option value="6">Class 6</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                    </select>

                    <select
                      value={genderFilter}
                      onChange={(e) => {
                        setGenderFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <button
                      className="reset-filter-btn"
                      title="Reset Filters"
                      onClick={() => {
                        setClassFilter("");
                        setGenderFilter("");
                        setStatusFilter("");
                        setSearch("");
                        setCurrentPage(1);
                      }}
                    >
                      <FaRedoAlt />
                    </button>
                  </div>

                  <div className="export-buttons">
                    <button
                      title="Export PDF"
                      onClick={() => exportPDF(filteredStudents)}
                    >
                      <FaFilePdf />
                    </button>
                    <button
                      title="Export Excel"
                      onClick={() => exportExcel(filteredStudents)}
                    >
                      <FaFileExcel />
                    </button>
                    <button
                      title="Print List"
                      onClick={() => printStudents(filteredStudents)}
                    >
                      <FaPrint />
                    </button>
                  </div>

                  <button
                    className="bulk-delete-btn"
                    title="Delete Selected"
                    onClick={handleBulkDelete}
                    disabled={btnLoading}
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="add-student-btn"
                    title="Add New Admission"
                    onClick={handleOpenAddModal}
                  >
                    <FaUserPlus /> Admission
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div className="students-table">
              {loading ? (
                <Loader />
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            currentStudents.length > 0 &&
                            currentStudents.every((s) =>
                              selectedStudents.includes(s._id || s.id),
                            )
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th onClick={() => handleSort("enrollment")}>
                        Enrollment{" "}
                        {sortField === "enrollment" &&
                          (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Photo</th>
                      <th onClick={() => handleSort("name")}>
                        Student Name{" "}
                        {sortField === "name" &&
                          (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Father's Name</th>
                      <th onClick={() => handleSort("class")}>
                        Class & Sec{" "}
                        {sortField === "class" &&
                          (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Roll No</th>
                      <th>Mobile</th>
                      <th>Transport</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.length > 0 ? (
                      currentStudents.map((s) => {
                        const studentId = s._id || s.id;
                        return (
                          <tr key={studentId}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(studentId)}
                                onChange={() => handleSelectStudent(studentId)}
                              />
                            </td>
                            <td>
                              <strong>{s.enrollment}</strong>
                            </td>
                            <td>
                              <img
                                src={s.photo || "https://i.pravatar.cc/150"}
                                alt={s.name}
                                className="student-avatar"
                              />
                            </td>
                            <td>{s.name}</td>
                            <td>{s.fatherName}</td>
                            <td>
                              {s.class} - {s.section}
                            </td>
                            <td>{s.rollNo || "-"}</td>
                            <td>{s.mobile}</td>
                            <td>
                              {s.isTransport ? (
                                <span className="transport-badge active">
                                  <FaBus /> Opted
                                </span>
                              ) : (
                                <span className="transport-badge inactive">
                                  No
                                </span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`status ${(s.status || "active").toLowerCase()}`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="action-btn view-btn"
                                  onClick={() => setViewStudent(s)}
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="action-btn edit-btn"
                                  onClick={() => handleOpenEditModal(s)}
                                  title="Edit Record"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="action-btn delete-btn"
                                  onClick={() => setDeleteStudent(s)}
                                  title="Delete Record"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="11" className="no-students">
                          No Student Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* PAGINATION */}
              {!loading && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {filteredStudents.length === 0 ? 0 : firstIndex + 1}{" "}
                    - {Math.min(lastIndex, filteredStudents.length)} of{" "}
                    {filteredStudents.length} Students
                  </div>

                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx + 1}
                        className={currentPage === idx + 1 ? "active-page" : ""}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* ADMISSION FORM MODAL */}
            {showModal && (
              <div className="student-modal-overlay">
                <div className="student-modal">
                  <div className="modal-header">
                    <h2>
                      <FaUserCheck />{" "}
                      {editingStudent
                        ? "Edit Student Admission"
                        : "New Student Admission"}
                    </h2>
                  </div>

                  <form onSubmit={handleFormSubmit} className="student-form">
                    {/* SECTION 1: PERSONAL DETAILS */}
                    <div className="form-section-title">
                      <FaAddressCard /> Personal Details
                    </div>
                    <div className="form-grid-3">
                      <div>
                        <label>Enrollment / Admission No*</label>
                        <input
                          type="text"
                          name="enrollment"
                          value={formData.enrollment}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <label>Student Full Name*</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      <div>
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label>Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label>Community Category</label>
                        <select
                          name="community"
                          value={formData.community}
                          onChange={handleInputChange}
                        >
                          <option value="GEN">General (GEN)</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label>Student Aadhaar Number</label>
                        <input
                          type="text"
                          name="aadhaarNo"
                          value={formData.aadhaarNo}
                          onChange={handleInputChange}
                          placeholder="12-digit Aadhaar"
                        />
                      </div>
                      <div>
                        <label>Photo URL (Optional)</label>
                        <input
                          type="text"
                          name="photo"
                          value={formData.photo}
                          onChange={handleInputChange}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>

                    {/* SECTION 2: PARENT & CONTACT DETAILS */}
                    <div className="form-section-title">
                      <FaUsers /> Parent & Contact Details
                    </div>
                    <div className="form-grid-3">
                      <div>
                        <label>Father's Name*</label>
                        <input
                          type="text"
                          name="fatherName"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          placeholder="Father Name"
                          required
                        />
                      </div>
                      <div>
                        <label>Father Aadhaar Number</label>
                        <input
                          type="text"
                          name="fatherAadhaarNo"
                          value={formData.fatherAadhaarNo}
                          onChange={handleInputChange}
                          placeholder="12-digit Father Aadhaar"
                        />
                      </div>
                      <div>
                        <label>Mother's Name</label>
                        <input
                          type="text"
                          name="motherName"
                          value={formData.motherName}
                          onChange={handleInputChange}
                          placeholder="Mother Name"
                        />
                      </div>
                      <div>
                        <label>Mother Aadhaar Number</label>
                        <input
                          type="text"
                          name="motherAadhaarNo"
                          value={formData.motherAadhaarNo}
                          onChange={handleInputChange}
                          placeholder="12-digit Mother Aadhaar"
                        />
                      </div>
                      <div>
                        <label>Primary Contact Number*</label>
                        <input
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="Primary Mobile"
                          required
                        />
                      </div>
                      <div>
                        <label>Secondary Contact Number</label>
                        <input
                          type="text"
                          name="secondaryMobile"
                          value={formData.secondaryMobile}
                          onChange={handleInputChange}
                          placeholder="Alternate Mobile"
                        />
                      </div>
                    </div>

                    {/* SECTION 3: ACADEMIC DETAILS */}
                    <div className="form-section-title">Academic Details</div>
                    <div className="form-grid-3">
                      {/* Separated Class & Section */}
                      <div>
                        <label>Class* (From Fee Setup)</label>
                        <select
                          name="class"
                          value={formData.class}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Class</option>
                          {feeClasses.map((clsName) => (
                            <option key={clsName} value={clsName}>
                              {clsName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Section*</label>
                        <select
                          name="section"
                          value={formData.section}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                      <div>
                        <label>Roll No</label>
                        <input
                          type="text"
                          name="rollNo"
                          value={formData.rollNo}
                          onChange={handleInputChange}
                          placeholder="e.g. 15"
                        />
                      </div>
                      <div>
                        <label>Student Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* SECTION 4: ADDRESS INFORMATION */}
                    <div className="form-section-title">
                      <FaHome /> Address Details
                    </div>
                    <div className="form-full-width">
                      <label>Residential (Permanent) Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Complete Permanent Address"
                        rows="2"
                      />
                    </div>

                    <div
                      style={{
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="sameAsResidential"
                        name="sameAsResidential"
                        checked={formData.sameAsResidential}
                        onChange={handleInputChange}
                        style={{ width: "auto", cursor: "pointer" }}
                      />
                      <label
                        htmlFor="sameAsResidential"
                        style={{
                          margin: 0,
                          cursor: "pointer",
                          fontWeight: "600",
                        }}
                      >
                        Correspondence Address is same as Residential Address
                      </label>
                    </div>

                    <div className="form-full-width">
                      <label>Correspondence (Current) Address</label>
                      <textarea
                        name="correspondenceAddress"
                        value={formData.correspondenceAddress}
                        onChange={handleInputChange}
                        disabled={formData.sameAsResidential}
                        placeholder="Complete Current Address"
                        rows="2"
                      />
                    </div>

                    {/* SECTION 5: TRANSPORT & FEE CATEGORY */}
                    <div className="form-section-title">
                      <FaBus /> Transport & Fee Category Setup
                    </div>
                    <div className="form-grid-3">
                      <div>
                        <label>Student Type</label>
                        <select
                          name="studentType"
                          value={formData.studentType}
                          onChange={handleInputChange}
                        >
                          <option value="New">New Student</option>
                          <option value="Existing">Existing Student</option>
                        </select>
                      </div>

                      <div>
                        <label>Fee Category</label>
                        <select
                          name="feeCategory"
                          value={formData.feeCategory}
                          onChange={handleInputChange}
                        >
                          <option value="General">General</option>
                          <option value="Staff Child">
                            Staff Child Concession
                          </option>
                          <option value="Scholarship">
                            Scholarship Holder
                          </option>
                          <option value="RTE">RTE Admission</option>
                        </select>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "22px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="isTransport"
                          name="isTransport"
                          checked={formData.isTransport}
                          onChange={handleInputChange}
                          style={{
                            width: "auto",
                            cursor: "pointer",
                            marginRight: "8px",
                          }}
                        />
                        <label
                          htmlFor="isTransport"
                          style={{
                            margin: 0,
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Opt for School Transport
                        </label>
                      </div>
                    </div>

                    {/* Dynamic Transport Selectors */}
                    {formData.isTransport && (
                      <div
                        className="form-grid-2"
                        style={{
                          marginTop: "15px",
                          background: "#f8fafc",
                          padding: "15px",
                          borderRadius: "8px",
                        }}
                      >
                        <div>
                          <label>
                            Assign Bus / Van (From Transport Module)*
                          </label>
                          <select
                            name="busId"
                            value={formData.busId}
                            onChange={handleBusChange}
                            required
                          >
                            <option value="">-- Select Bus / Van --</option>
                            {busList.map((bus) => (
                              <option key={bus._id} value={bus._id}>
                                {bus.routeName} ({bus.busNumber})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label>Select Stop & Fare (From Fee Master)*</label>
                          <select
                            name="stopId"
                            value={formData.stopId}
                            onChange={handleStopChange}
                            required
                          >
                            <option value="">-- Select Stop Area --</option>
                            {stopList.map((stop) => (
                              <option key={stop.id} value={stop.id}>
                                {stop.routeName} - ₹{stop.fee}/month
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="modal-cancel-btn"
                        onClick={() => setShowModal(false)}
                        disabled={btnLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="modal-save-btn"
                        disabled={btnLoading}
                      >
                        {btnLoading
                          ? "Saving..."
                          : editingStudent
                            ? "Update Student"
                            : "Complete Admission"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW PROFILE MODAL */}
            {viewStudent && (
              <div className="student-modal-overlay">
                <div className="student-modal">
                  <div className="modal-header">
                    <h2>Student Details Card</h2>
                  </div>

                  <div className="student-profile-view">
                    <div className="profile-left">
                      <img
                        src={viewStudent.photo || "https://i.pravatar.cc/150"}
                        alt={viewStudent.name}
                      />
                      <h3>{viewStudent.name}</h3>
                      <p className="enrollment-tag">{viewStudent.enrollment}</p>
                      <span
                        className={`status ${(
                          viewStudent.status || "active"
                        ).toLowerCase()}`}
                      >
                        {viewStudent.status}
                      </span>
                    </div>

                    <div className="profile-right">
                      <div className="profile-info-grid">
                        <div>
                          <span>Class & Roll:</span>
                          <strong>
                            {viewStudent.class} - {viewStudent.section} (Roll:{" "}
                            {viewStudent.rollNo || "N/A"})
                          </strong>
                        </div>
                        <div>
                          <span>Community:</span>
                          <strong>{viewStudent.community || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Father's Name & Aadhaar:</span>
                          <strong>
                            {viewStudent.fatherName}{" "}
                            {viewStudent.fatherAadhaarNo
                              ? `(${viewStudent.fatherAadhaarNo})`
                              : ""}
                          </strong>
                        </div>
                        <div>
                          <span>Mother's Name & Aadhaar:</span>
                          <strong>
                            {viewStudent.motherName || "N/A"}{" "}
                            {viewStudent.motherAadhaarNo
                              ? `(${viewStudent.motherAadhaarNo})`
                              : ""}
                          </strong>
                        </div>
                        <div>
                          <span>Primary Contact:</span>
                          <strong>{viewStudent.mobile}</strong>
                        </div>
                        <div>
                          <span>Secondary Contact:</span>
                          <strong>
                            {viewStudent.secondaryMobile || "N/A"}
                          </strong>
                        </div>
                        <div>
                          <span>Date of Birth:</span>
                          <strong>{viewStudent.dob || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Student Aadhaar No:</span>
                          <strong>{viewStudent.aadhaarNo || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Fee Category:</span>
                          <strong>{viewStudent.feeCategory}</strong>
                        </div>
                        <div>
                          <span>Transport Details:</span>
                          <strong>
                            {viewStudent.isTransport
                              ? `${viewStudent.busName || "Bus Assigned"} | Stop: ${viewStudent.stopName} (₹${viewStudent.transportFee}/mo)`
                              : "No Transport Facility"}
                          </strong>
                        </div>
                        <div className="full-col">
                          <span>Residential Address:</span>
                          <strong>{viewStudent.address || "N/A"}</strong>
                        </div>
                        <div className="full-col">
                          <span>Correspondence Address:</span>
                          <strong>
                            {viewStudent.correspondenceAddress || "N/A"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-actions text-right">
                    <button
                      className="modal-cancel-btn"
                      onClick={() => setViewStudent(null)}
                    >
                      Close Card
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteStudent && (
              <div className="student-modal-overlay">
                <div className="student-modal">
                  <div className="modal-header">
                    <h2>Confirm Delete</h2>
                  </div>
                  <p className="delete-modal-body">
                    Are you sure you want to delete student{" "}
                    <strong>{deleteStudent.name}</strong> (
                    {deleteStudent.enrollment})?
                  </p>
                  <div className="modal-actions">
                    <button
                      className="modal-cancel-btn"
                      onClick={() => setDeleteStudent(null)}
                      disabled={btnLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-delete-btn"
                      onClick={confirmDelete}
                      disabled={btnLoading}
                    >
                      {btnLoading ? "Deleting..." : "Delete Record"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
