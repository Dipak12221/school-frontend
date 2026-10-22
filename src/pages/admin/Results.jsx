import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaGraduationCap,
  FaTrophy,
  FaChartLine,
  FaCheckCircle,
  FaSave,
  FaUsers,
  FaCogs,
  FaPlusCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import "./Results.css";

// CLASS OPTIONS: Pre-Nursery to Class 10
const ALL_CLASSES = [
  "Pre-Nursery",
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
];

// EXAM TYPES
const EXAM_TYPES = [
  "First Periodic",
  "Half Yearly",
  "Second Periodic",
  "Yearly Exam",
];

// DEFAULT SUBJECT CONFIGURATION PER CLASS
const DEFAULT_CLASS_SUBJECTS = {
  "Class 10": [
    { name: "Mathematics", fullMarks: 100, passMarks: 33 },
    { name: "Science", fullMarks: 100, passMarks: 33 },
    { name: "English", fullMarks: 100, passMarks: 33 },
    { name: "Social Science", fullMarks: 100, passMarks: 33 },
    { name: "Hindi / Computer", fullMarks: 100, passMarks: 33 },
  ],
  "Class 9": [
    { name: "Mathematics", fullMarks: 100, passMarks: 33 },
    { name: "Science", fullMarks: 100, passMarks: 33 },
    { name: "English", fullMarks: 100, passMarks: 33 },
    { name: "Social Science", fullMarks: 100, passMarks: 33 },
    { name: "Hindi", fullMarks: 100, passMarks: 33 },
  ],
  DEFAULT: [
    { name: "English", fullMarks: 100, passMarks: 33 },
    { name: "Hindi", fullMarks: 100, passMarks: 33 },
    { name: "Mathematics", fullMarks: 100, passMarks: 33 },
    { name: "EVS / Science", fullMarks: 100, passMarks: 33 },
    { name: "Drawing / Oral", fullMarks: 50, passMarks: 18 },
  ],
};

const REGISTERED_STUDENTS_DB = [
  {
    id: 101,
    enrollment: "STU001",
    studentName: "Rahul Kumar",
    className: "Class 10",
  },
  {
    id: 102,
    enrollment: "STU004",
    studentName: "Neha Gupta",
    className: "Class 10",
  },
  {
    id: 201,
    enrollment: "STU002",
    studentName: "Priya Sharma",
    className: "Class 9",
  },
  {
    id: 301,
    enrollment: "STU003",
    studentName: "Amit Singh",
    className: "Class 5",
  },
  {
    id: 401,
    enrollment: "STU008",
    studentName: "Aarav Yadav",
    className: "Nursery",
  },
];

const INITIAL_RESULTS = [
  {
    id: 1,
    enrollment: "STU001",
    studentName: "Rahul Kumar",
    className: "Class 10",
    exam: "Yearly Exam",
    subjects: {
      Mathematics: 92,
      Science: 88,
      English: 82,
      "Social Science": 78,
      "Hindi / Computer": 85,
    },
    totalMarks: 500,
    obtainedMarks: 425,
    percentage: 85,
    grade: "A",
    status: "Pass",
  },
  {
    id: 2,
    enrollment: "STU002",
    studentName: "Priya Sharma",
    className: "Class 9",
    exam: "First Periodic",
    subjects: {
      Mathematics: 98,
      Science: 95,
      English: 89,
      "Social Science": 86,
      Hindi: 87,
    },
    totalMarks: 500,
    obtainedMarks: 455,
    percentage: 91,
    grade: "A+",
    status: "Pass",
  },
];

function Results() {
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [subjectConfig, setSubjectConfig] = useState(DEFAULT_CLASS_SUBJECTS);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedResults, setSelectedResults] = useState([]);

  // Sorting & Pagination
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [viewResult, setViewResult] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);

  // Setup Modal State
  const [setupTargetClass, setSetupTargetClass] = useState("Class 10");
  const [setupSubjects, setSetupSubjects] = useState([]);

  // Edit Form State
  const [formData, setFormData] = useState({
    id: null,
    enrollment: "",
    studentName: "",
    className: "Class 10",
    exam: "Yearly Exam",
    subjects: {},
  });

  // Batch Entry State
  const [batchClass, setBatchClass] = useState("Class 10");
  const [batchExam, setBatchExam] = useState("Yearly Exam");
  const [batchMarksData, setBatchMarksData] = useState({});

  // Helper: Get Subjects for a Class
  const getSubjectsForClass = (className) => {
    return subjectConfig[className] || subjectConfig["DEFAULT"];
  };

  // Dynamic Calculation Engine
  const calculateDynamicResult = (className, userSubjects) => {
    const classConfig = getSubjectsForClass(className);
    let totalMarks = 0;
    let obtainedMarks = 0;
    let isPassed = true;

    classConfig.forEach((sub) => {
      const full = Number(sub.fullMarks) || 100;
      const pass = Number(sub.passMarks) || 33;
      const obtained = Number(userSubjects[sub.name]) || 0;

      totalMarks += full;
      obtainedMarks += obtained;

      if (obtained < pass) {
        isPassed = false;
      }
    });

    const percentage =
      totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;

    let grade = "E";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 33) grade = "D";

    const status = isPassed && percentage >= 33 ? "Pass" : "Fail";

    return { totalMarks, obtainedMarks, percentage, grade, status };
  };

  // Subject Setup Handlers
  const handleOpenSetupModal = () => {
    setSetupSubjects([...getSubjectsForClass(setupTargetClass)]);
    setIsSetupModalOpen(true);
  };

  const handleSetupClassChange = (e) => {
    const selected = e.target.value;
    setSetupTargetClass(selected);
    setSetupSubjects([...getSubjectsForClass(selected)]);
  };

  const handleSetupSubjectChange = (index, field, value) => {
    const updated = [...setupSubjects];
    updated[index][field] = value;
    setSetupSubjects(updated);
  };

  const handleAddSetupSubject = () => {
    setSetupSubjects([
      ...setupSubjects,
      {
        name: `Subject ${setupSubjects.length + 1}`,
        fullMarks: 100,
        passMarks: 33,
      },
    ]);
  };

  const handleRemoveSetupSubject = (index) => {
    setSetupSubjects(setupSubjects.filter((_, idx) => idx !== index));
  };

  const handleSaveSubjectConfig = (e) => {
    e.preventDefault();
    setSubjectConfig((prev) => ({
      ...prev,
      [setupTargetClass]: setupSubjects,
    }));
    toast.success(`Subject configuration updated for ${setupTargetClass}!`);
    setIsSetupModalOpen(false);
  };

  // Batch Entry Handlers
  const loadClassStudents = (selectedClass, selectedExam) => {
    const classStudents = REGISTERED_STUDENTS_DB.filter(
      (s) => s.className === selectedClass,
    );
    const subjectsForClass = getSubjectsForClass(selectedClass);

    const initialMap = {};
    classStudents.forEach((student) => {
      const existing = results.find(
        (r) => r.enrollment === student.enrollment && r.exam === selectedExam,
      );

      const subjectMarks = {};
      subjectsForClass.forEach((sub) => {
        subjectMarks[sub.name] = existing
          ? existing.subjects[sub.name] || 0
          : 0;
      });

      initialMap[student.enrollment] = {
        studentName: student.studentName,
        className: student.className,
        enrollment: student.enrollment,
        subjects: subjectMarks,
      };
    });

    setBatchMarksData(initialMap);
  };

  const handleOpenBatchEntry = () => {
    loadClassStudents(batchClass, batchExam);
    setIsBatchModalOpen(true);
  };

  const handleClassChangeInBatch = (e) => {
    const selectedClass = e.target.value;
    setBatchClass(selectedClass);
    loadClassStudents(selectedClass, batchExam);
  };

  const handleExamChangeInBatch = (e) => {
    const selectedExam = e.target.value;
    setBatchExam(selectedExam);
    loadClassStudents(batchClass, selectedExam);
  };

  const handleBatchSubjectChange = (enrollment, subjectName, value) => {
    const val = Number(value) || 0;
    setBatchMarksData((prev) => ({
      ...prev,
      [enrollment]: {
        ...prev[enrollment],
        subjects: {
          ...prev[enrollment].subjects,
          [subjectName]: val,
        },
      },
    }));
  };

  const handleSaveBatchResults = (e) => {
    e.preventDefault();
    const newEntries = [];

    Object.keys(batchMarksData).forEach((enrollment) => {
      const studentData = batchMarksData[enrollment];
      const calculated = calculateDynamicResult(
        batchClass,
        studentData.subjects,
      );

      newEntries.push({
        id: Date.now() + Math.random(),
        enrollment: studentData.enrollment,
        studentName: studentData.studentName,
        className: studentData.className,
        exam: batchExam,
        subjects: studentData.subjects,
        ...calculated,
      });
    });

    setResults((prev) => {
      const filteredOut = prev.filter(
        (r) => !(r.className === batchClass && r.exam === batchExam),
      );
      return [...newEntries, ...filteredOut];
    });

    toast.success(`Batch results saved for ${batchClass}!`);
    setIsBatchModalOpen(false);
  };

  // Edit Form Handlers
  const handleEdit = (result) => {
    setFormData({
      id: result.id,
      enrollment: result.enrollment,
      studentName: result.studentName,
      className: result.className,
      exam: result.exam,
      subjects: { ...result.subjects },
    });
    setIsAddEditOpen(true);
  };

  const handleSingleClassChange = (e) => {
    const selectedClass = e.target.value;
    const subs = getSubjectsForClass(selectedClass);
    const subObj = {};
    subs.forEach((s) => (subObj[s.name] = 0));

    setFormData((prev) => ({
      ...prev,
      className: selectedClass,
      subjects: subObj,
    }));
  };

  const handleSingleSubjectChange = (subjectName, value) => {
    const val = Number(value) || 0;
    setFormData((prev) => ({
      ...prev,
      subjects: { ...prev.subjects, [subjectName]: val },
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.enrollment || !formData.studentName) {
      toast.error("Please fill Student Name and Enrollment!");
      return;
    }

    const calculated = calculateDynamicResult(
      formData.className,
      formData.subjects,
    );

    setResults((prev) =>
      prev.map((r) =>
        r.id === formData.id ? { ...formData, ...calculated } : r,
      ),
    );
    toast.success("Result updated successfully!");
    setIsAddEditOpen(false);
  };

  // Delete & Bulk Handlers
  const confirmDelete = () => {
    if (!deleteResult) return;
    setResults((prev) => prev.filter((r) => r.id !== deleteResult.id));
    toast.success("Result record deleted successfully!");
    setDeleteResult(null);
  };

  const handleBulkDelete = () => {
    if (selectedResults.length === 0) {
      toast.warn("Select at least one result record.");
      return;
    }
    if (window.confirm(`Delete ${selectedResults.length} selected results?`)) {
      setResults((prev) => prev.filter((r) => !selectedResults.includes(r.id)));
      setSelectedResults([]);
      toast.success("Selected records deleted!");
    }
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...results].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setResults(sorted);
  };

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const term = search.toLowerCase();
      const matchesSearch =
        r.studentName.toLowerCase().includes(term) ||
        r.enrollment.toLowerCase().includes(term) ||
        r.className.toLowerCase().includes(term);

      const matchesClass = !classFilter || r.className === classFilter;
      const matchesExam = !examFilter || r.exam === examFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;

      return matchesSearch && matchesClass && matchesExam && matchesStatus;
    });
  }, [results, search, classFilter, examFilter, statusFilter]);

  const lastIndex = currentPage * resultsPerPage;
  const firstIndex = lastIndex - resultsPerPage;
  const currentResults = filteredResults.slice(firstIndex, lastIndex);

  const handlePrintMarksheet = () => {
    window.print();
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-dashboard-main">
        <Topbar />
        <div className="admin-dashboard-content">
          <div className="results-page">
            {/* STATS OVERVIEW CARDS */}
            <div className="results-stats-grid">
              <div className="result-stat-card primary">
                <div className="stat-icon">
                  <FaGraduationCap />
                </div>
                <div className="stat-info">
                  <h3>{results.length}</h3>
                  <p>Evaluated Students</p>
                </div>
              </div>

              <div className="result-stat-card success">
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>
                <div className="stat-info">
                  <h3>
                    {results.length
                      ? Math.round(
                          (results.filter((r) => r.status === "Pass").length /
                            results.length) *
                            100,
                        )
                      : 0}
                    %
                  </h3>
                  <p>Overall Pass Rate</p>
                </div>
              </div>

              <div className="result-stat-card warning">
                <div className="stat-icon">
                  <FaTrophy />
                </div>
                <div className="stat-info">
                  <h3>{results.filter((r) => r.grade === "A+").length}</h3>
                  <p>Distinction (A+ Grade)</p>
                </div>
              </div>

              <div className="result-stat-card info">
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div className="stat-info">
                  <h3>
                    {results.length
                      ? Math.round(
                          results.reduce(
                            (acc, curr) => acc + curr.percentage,
                            0,
                          ) / results.length,
                        )
                      : 0}
                    %
                  </h3>
                  <p>Average Score</p>
                </div>
              </div>
            </div>

            {/* HEADER & FILTERS */}
            <div className="results-header">
              <h1>Academic Results</h1>

              <div className="results-header-right">
                <div className="results-top-row">
                  <div className="results-search">
                    <FaSearch className="results-search-icon" />
                    <input
                      type="text"
                      placeholder="Search by Name, Enrollment, Class..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="results-bottom-row">
                  <div className="results-filters">
                    <select
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                    >
                      <option value="">All Classes (Pre-Nur to 10)</option>
                      {ALL_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={examFilter}
                      onChange={(e) => setExamFilter(e.target.value)}
                    >
                      <option value="">All Exams</option>
                      {EXAM_TYPES.map((ex) => (
                        <option key={ex} value={ex}>
                          {ex}
                        </option>
                      ))}
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>

                    <button
                      className="results-reset-btn"
                      onClick={() => {
                        setSearch("");
                        setClassFilter("");
                        setExamFilter("");
                        setStatusFilter("");
                      }}
                      title="Reset Filters"
                    >
                      <FaRedoAlt />
                    </button>
                  </div>

                  <div className="results-export-buttons">
                    <button
                      title="Export PDF"
                      onClick={() => toast.info("Exporting PDF...")}
                    >
                      <FaFilePdf />
                    </button>
                    <button
                      title="Export Excel"
                      onClick={() => toast.info("Exporting Excel...")}
                    >
                      <FaFileExcel />
                    </button>
                  </div>

                  <button
                    className="bulk-delete-btn"
                    onClick={handleBulkDelete}
                    title="Delete Selected"
                  >
                    <FaTrash />
                  </button>

                  <button
                    className="setup-config-btn"
                    onClick={handleOpenSetupModal}
                    title="Configure Subjects per class"
                  >
                    <FaCogs /> Subject Setup
                  </button>

                  <button
                    className="add-batch-btn"
                    onClick={handleOpenBatchEntry}
                  >
                    <FaUsers /> Class Batch Entry
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTS TABLE */}
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          currentResults.length > 0 &&
                          currentResults.every((r) =>
                            selectedResults.includes(r.id),
                          )
                        }
                        onChange={() => {
                          const currentIds = currentResults.map((r) => r.id);
                          const allSelected = currentIds.every((id) =>
                            selectedResults.includes(id),
                          );
                          if (allSelected) {
                            setSelectedResults((prev) =>
                              prev.filter((id) => !currentIds.includes(id)),
                            );
                          } else {
                            setSelectedResults((prev) =>
                              Array.from(new Set([...prev, ...currentIds])),
                            );
                          }
                        }}
                      />
                    </th>
                    <th onClick={() => handleSort("enrollment")}>Enrollment</th>
                    <th onClick={() => handleSort("studentName")}>
                      Student Name
                    </th>
                    <th onClick={() => handleSort("className")}>Class</th>
                    <th>Exam Type</th>
                    <th>Obtained / Total</th>
                    <th onClick={() => handleSort("percentage")}>Percentage</th>
                    <th>Grade</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentResults.length > 0 ? (
                    currentResults.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(r.id)}
                            onChange={() => {
                              setSelectedResults((prev) =>
                                prev.includes(r.id)
                                  ? prev.filter((i) => i !== r.id)
                                  : [...prev, r.id],
                              );
                            }}
                          />
                        </td>
                        <td>
                          <strong>{r.enrollment}</strong>
                        </td>
                        <td>{r.studentName}</td>
                        <td>{r.className}</td>
                        <td>{r.exam}</td>
                        <td>
                          {r.obtainedMarks} / {r.totalMarks}
                        </td>
                        <td>
                          <strong>{r.percentage}%</strong>
                        </td>
                        <td>
                          <span
                            className={`result-grade grade-${r.grade.replace("+", "plus").toLowerCase()}`}
                          >
                            {r.grade}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`result-status ${r.status === "Pass" ? "status-pass" : "status-fail"}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <div className="result-action-buttons">
                            <button
                              className="result-view-btn"
                              onClick={() => setViewResult(r)}
                              title="View & Print Marksheet"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="result-edit-btn"
                              onClick={() => handleEdit(r)}
                              title="Edit Result"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="result-delete-btn"
                              onClick={() => setDeleteResult(r)}
                              title="Delete Result"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="results-empty-state">
                        No result records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* CLASS SUBJECT & MARKS SETUP MODAL */}
      {isSetupModalOpen && (
        <div className="result-modal-overlay">
          <div className="result-modal setup-modal">
            <div className="result-modal-header">
              <h2>Class Exam & Subject Configuration</h2>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSaveSubjectConfig}
              className="result-modal-form"
            >
              <div className="form-group margin-bottom-15">
                <label>Select Target Class</label>
                <select
                  value={setupTargetClass}
                  onChange={handleSetupClassChange}
                >
                  {ALL_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setup-subjects-list">
                <h4>Exam Subjects & Marks Setup for {setupTargetClass}</h4>
                {setupSubjects.map((sub, idx) => (
                  <div className="setup-subject-row" key={idx}>
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={sub.name}
                      onChange={(e) =>
                        handleSetupSubjectChange(idx, "name", e.target.value)
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Full Marks"
                      value={sub.fullMarks}
                      onChange={(e) =>
                        handleSetupSubjectChange(
                          idx,
                          "fullMarks",
                          e.target.value,
                        )
                      }
                      required
                    />
                    <input
                      type="number"
                      placeholder="Pass Marks"
                      value={sub.passMarks}
                      onChange={(e) =>
                        handleSetupSubjectChange(
                          idx,
                          "passMarks",
                          e.target.value,
                        )
                      }
                      required
                    />
                    <button
                      type="button"
                      className="remove-sub-btn"
                      onClick={() => handleRemoveSetupSubject(idx)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="add-sub-row-btn"
                onClick={handleAddSetupSubject}
              >
                <FaPlusCircle /> Add Subject
              </button>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsSetupModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-result-btn">
                  <FaSave /> Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASS-WISE BATCH MARKS ENTRY MODAL */}
      {isBatchModalOpen && (
        <div className="result-modal-overlay">
          <div className="result-modal bulk-entry-modal">
            <div className="result-modal-header">
              <h2>Class Marks Batch Entry</h2>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSaveBatchResults}
              className="result-modal-form"
            >
              <div className="batch-selection-bar">
                <div className="form-group">
                  <label>Select Target Class</label>
                  <select
                    value={batchClass}
                    onChange={handleClassChangeInBatch}
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Exam Type</label>
                  <select value={batchExam} onChange={handleExamChangeInBatch}>
                    {EXAM_TYPES.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="batch-table-wrapper">
                <table className="batch-table">
                  <thead>
                    <tr>
                      <th>Student Details</th>
                      {getSubjectsForClass(batchClass).map((sub) => (
                        <th key={sub.name}>
                          {sub.name} ({sub.fullMarks})
                        </th>
                      ))}
                      <th>Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(batchMarksData).length > 0 ? (
                      Object.keys(batchMarksData).map((enrollment) => {
                        const s = batchMarksData[enrollment];
                        const calc = calculateDynamicResult(
                          batchClass,
                          s.subjects,
                        );
                        return (
                          <tr key={enrollment}>
                            <td>
                              <div className="student-cell-name">
                                {s.studentName}
                              </div>
                              <div className="student-cell-id">
                                {s.enrollment}
                              </div>
                            </td>
                            {getSubjectsForClass(batchClass).map((sub) => (
                              <td key={sub.name}>
                                <input
                                  type="number"
                                  className="batch-mark-input"
                                  value={s.subjects[sub.name] || 0}
                                  max={sub.fullMarks}
                                  onChange={(e) =>
                                    handleBatchSubjectChange(
                                      enrollment,
                                      sub.name,
                                      e.target.value,
                                    )
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              <span
                                className={`batch-preview-badge ${calc.status === "Pass" ? "pass" : "fail"}`}
                              >
                                {calc.percentage}% ({calc.grade})
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="10"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No registered students found in {batchClass}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsBatchModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-result-btn">
                  <FaSave /> Save Class Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RESULT MODAL */}
      {isAddEditOpen && (
        <div className="result-modal-overlay">
          <div className="result-modal dynamic-modal">
            <div className="result-modal-header">
              <h2>Edit Student Result</h2>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="result-modal-form">
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Enrollment No.*</label>
                  <input
                    type="text"
                    required
                    value={formData.enrollment}
                    onChange={(e) =>
                      setFormData({ ...formData, enrollment: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Student Full Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Class*</label>
                  <select
                    value={formData.className}
                    onChange={handleSingleClassChange}
                  >
                    {ALL_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group margin-top-10">
                <label>Examination Type</label>
                <select
                  value={formData.exam}
                  onChange={(e) =>
                    setFormData({ ...formData, exam: e.target.value })
                  }
                >
                  {EXAM_TYPES.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>

              <div className="subject-marks-section">
                <h4>Marks Entry for {formData.className}</h4>
                <div className="subject-inputs-grid">
                  {getSubjectsForClass(formData.className).map((sub) => (
                    <div key={sub.name}>
                      <label>
                        {sub.name} (Max: {sub.fullMarks})
                      </label>
                      <input
                        type="number"
                        value={formData.subjects[sub.name] || 0}
                        max={sub.fullMarks}
                        onChange={(e) =>
                          handleSingleSubjectChange(sub.name, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setIsAddEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-result-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE MARKSHEET MODAL */}
      {viewResult && (
        <div className="result-modal-overlay">
          <div className="result-modal marksheet-modal printable-area">
            <div className="marksheet-printable-card" id="printable-marksheet">
              {/* SCHOOL BRAND & LOGO HEADER */}
              <div className="school-header">
                <div className="school-logo-container">
                  <div className="school-logo-icon">
                    <FaGraduationCap />
                  </div>
                </div>
                <div className="school-details-text">
                  <h1 className="school-title">R.B.G. PUBLIC SCHOOL</h1>
                  <p className="school-address">Titra, Siwan, Bihar - 841245</p>
                  <p className="school-affiliation">
                    Affiliated to CBSE, New Delhi | School Code: 10452
                  </p>
                  <div className="report-card-badge">
                    PROGRESS REPORT CARD ({viewResult.exam.toUpperCase()})
                  </div>
                  <p className="academic-session">
                    ACADEMIC SESSION: 2025 - 2026
                  </p>
                </div>
              </div>

              {/* STUDENT META INFO */}
              <div className="student-info-grid">
                <div>
                  <span>Student Name:</span>{" "}
                  <strong>{viewResult.studentName}</strong>
                </div>
                <div>
                  <span>Enrollment No:</span>{" "}
                  <strong>{viewResult.enrollment}</strong>
                </div>
                <div>
                  <span>Class:</span> <strong>{viewResult.className}</strong>
                </div>
                <div>
                  <span>Exam Type:</span> <strong>{viewResult.exam}</strong>
                </div>
              </div>

              {/* MARKS TABLE */}
              <table className="marksheet-print-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Full Marks</th>
                    <th>Pass Marks</th>
                    <th>Obtained Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {getSubjectsForClass(viewResult.className).map((sub) => {
                    const mark = viewResult.subjects[sub.name] || 0;
                    return (
                      <tr key={sub.name}>
                        <td>{sub.name}</td>
                        <td>{sub.fullMarks}</td>
                        <td>{sub.passMarks}</td>
                        <td>
                          <strong>{mark}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PERFORMANCE SUMMARY */}
              <div className="marksheet-summary-section">
                <div className="summary-card">
                  <span>Grand Total</span>
                  <strong>
                    {viewResult.obtainedMarks} / {viewResult.totalMarks}
                  </strong>
                </div>
                <div className="summary-card">
                  <span>Percentage</span>
                  <strong>{viewResult.percentage}%</strong>
                </div>
                <div className="summary-card">
                  <span>Grade</span>
                  <strong>{viewResult.grade}</strong>
                </div>
                <div className="summary-card">
                  <span>Final Status</span>
                  <strong
                    className={
                      viewResult.status === "Pass" ? "text-pass" : "text-fail"
                    }
                  >
                    {viewResult.status}
                  </strong>
                </div>
              </div>

              {/* SIGNATURE SECTION */}
              <div className="signatures-container">
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <p>Class Teacher</p>
                </div>
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <p>Exam Controller</p>
                </div>
                <div className="sig-box">
                  <div className="sig-line"></div>
                  <p>Principal Signature</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="marksheet-actions print-hide">
              <button
                className="modal-cancel-btn"
                onClick={() => setViewResult(null)}
              >
                Close
              </button>
              <button
                className="modal-print-btn"
                onClick={handlePrintMarksheet}
              >
                <FaPrint /> Print / Download Marksheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteResult && (
        <div className="result-modal-overlay">
          <div className="result-modal delete-modal">
            <div className="result-modal-header">
              <h2>Confirm Deletion</h2>
            </div>
            <p>
              Are you sure you want to delete the result of{" "}
              <strong>{deleteResult.studentName}</strong> (
              {deleteResult.enrollment})?
            </p>
            <div className="modal-actions-bar">
              <button
                className="modal-cancel-btn"
                onClick={() => setDeleteResult(null)}
              >
                Cancel
              </button>
              <button
                className="result-delete-confirm-btn"
                onClick={confirmDelete}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Results;
