import React, { useMemo, useState, useEffect } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaPrint,
  FaCut,
  FaCheckCircle,
  FaCog,
  FaBus,
  FaGraduationCap,
  FaUserCheck,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import feeService from "../../services/feeService";
import studentService from "../../services/studentService";

import "./Fees.css";

const ACADEMIC_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const INITIAL_CLASS_FEE_MASTER = { "9-B": 2000, "10-A": 2500, "11-C": 3000 };
const INITIAL_ANNUAL_FEE_MASTER = { newStudent: 1100, existingStudent: 500 };
const INITIAL_TRANSPORT_ROUTES = [
  { id: 1, routeName: "Route 1 - Main City / Station", fee: 500 },
  { id: 2, routeName: "Route 2 - Bypass / Industrial Area", fee: 800 },
  { id: 3, routeName: "Route 3 - Suburb / Outer Colony", fee: 1000 },
];

function Fees() {
  const [classFeeMaster, setClassFeeMaster] = useState(() => {
    const saved = localStorage.getItem("fees_class_master");
    return saved ? JSON.parse(saved) : INITIAL_CLASS_FEE_MASTER;
  });

  const [annualFeeMaster, setAnnualFeeMaster] = useState(() => {
    const saved = localStorage.getItem("fees_annual_master");
    return saved ? JSON.parse(saved) : INITIAL_ANNUAL_FEE_MASTER;
  });

  const [transportRoutes, setTransportRoutes] = useState(() => {
    const saved = localStorage.getItem("fees_transport_routes");
    return saved ? JSON.parse(saved) : INITIAL_TRANSPORT_ROUTES;
  });

  useEffect(() => {
    localStorage.setItem("fees_class_master", JSON.stringify(classFeeMaster));
  }, [classFeeMaster]);

  useEffect(() => {
    localStorage.setItem("fees_annual_master", JSON.stringify(annualFeeMaster));
  }, [annualFeeMaster]);

  useEffect(() => {
    localStorage.setItem(
      "fees_transport_routes",
      JSON.stringify(transportRoutes),
    );
  }, [transportRoutes]);

  const [studentsMaster, setStudentsMaster] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const feesData = await feeService.getAllFees();
      setFees(feesData || []);

      const studentsData = await studentService.getAllStudents();
      setStudentsMaster(studentsData || []);
    } catch (error) {
      toast.error("Failed to fetch records from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const [newClass, setNewClass] = useState("");
  const [newClassFee, setNewClassFee] = useState("");
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteFee, setNewRouteFee] = useState("");

  const initialForm = {
    enrollment: "",
    studentName: "",
    className: "",
    studentType: "Existing",
    monthlyFee: 0,
    isTransportOpted: false,
    selectedRouteId: "",
    transportFee: 0,
    paidMonthsHistory: [],
    isAnnualPaidHistory: false,
    isExamPaidHistory: false,
    selectedMonths: [],
    includeAnnual: false,
    annualFee: annualFeeMaster.existingStudent,
    includeExam: false,
    examFee: 500,
    previousDues: 0,
    discount: 0,
    paidAmount: "",
    paymentDate: getTodayDateString(),
    paymentMode: "Cash",
  };

  const [formData, setFormData] = useState(initialForm);

  const calculatedTotals = useMemo(() => {
    const monthsCount = formData.selectedMonths.length;
    const tuitionTotal = monthsCount * Number(formData.monthlyFee || 0);
    const transportTotal = formData.isTransportOpted
      ? monthsCount * Number(formData.transportFee || 0)
      : 0;
    const annualTotal = formData.includeAnnual
      ? Number(formData.annualFee || 0)
      : 0;
    const examTotal = formData.includeExam ? Number(formData.examFee || 0) : 0;
    const previousDues = Number(formData.previousDues || 0);

    const grossTotal = tuitionTotal + transportTotal + annualTotal + examTotal;
    const discount = Number(formData.discount || 0);

    // Net Payable me purana bakaaya bhi joda jayega
    const netTotal = Math.max(0, grossTotal + previousDues - discount);

    return {
      monthsCount,
      tuitionTotal,
      transportTotal,
      grossTotal,
      previousDues,
      netTotal,
    };
  }, [formData]);

  const [currentPage, setCurrentPage] = useState(1);
  const feesPerPage = 8;
  const [printModalFee, setPrintModalFee] = useState(null);
  const [viewingFee, setViewingFee] = useState(null);
  const [printMode, setPrintMode] = useState("split");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const text = search.toLowerCase();
      const matchesSearch =
        fee.studentName.toLowerCase().includes(text) ||
        fee.enrollment.toLowerCase().includes(text) ||
        fee.className.toLowerCase().includes(text) ||
        fee.receiptNo.toLowerCase().includes(text);

      const matchesClass = !classFilter || fee.className === classFilter;
      const matchesStatus = !statusFilter || fee.status === statusFilter;
      const matchesDate = !dateFilter || fee.paymentDate === dateFilter;

      return matchesSearch && matchesClass && matchesStatus && matchesDate;
    });
  }, [fees, search, classFilter, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredFees.length / feesPerPage) || 1;
  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee);

  const handleReset = () => {
    setSearch("");
    setClassFilter("");
    setStatusFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const handleSetToday = () => {
    setDateFilter(getTodayDateString());
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (filteredFees.length === 0)
      return toast.warning("No records to export!");
    const headers = [
      "Receipt No,Enrollment,Student Name,Class,Months Paid,Gross,Previous Dues,Discount,Net Payable,Paid,Due,Status,Date",
    ];
    const csvRows = filteredFees.map((f) =>
      [
        f.receiptNo,
        f.enrollment,
        `"${f.studentName}"`,
        f.className,
        `"${(f.selectedMonths || []).join("; ")}"`,
        f.grossTotal,
        f.previousDues || 0,
        f.discount,
        f.totalFee,
        f.paidAmount,
        f.dueAmount,
        f.status,
        f.paymentDate,
      ].join(","),
    );
    const blob = new Blob([[headers, ...csvRows].join("\n")], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fee_Report_${getTodayDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEnrollmentChange = (e) => {
    const enroll = e.target.value;
    const existingStudentRecords = fees.filter(
      (f) =>
        f.enrollment.toLowerCase() === enroll.toLowerCase() &&
        f._id !== editingFee?._id,
    );

    let previouslyPaidMonths = [];
    let isAnnualPaid = false;
    let isExamPaid = false;

    // Accurate Previous Dues Calculation (Total Billed - Total Paid - Total Discount)
    let totalBilledByStudent = 0;
    let totalPaidByStudent = 0;
    let totalDiscountByStudent = 0;

    if (existingStudentRecords.length > 0) {
      previouslyPaidMonths = Array.from(
        new Set(
          existingStudentRecords.flatMap((r) => [
            ...(r.paidMonths || []),
            ...(r.selectedMonths || []),
          ]),
        ),
      );
      isAnnualPaid = existingStudentRecords.some((r) => r.includeAnnual);
      isExamPaid = existingStudentRecords.some((r) => r.includeExam);

      existingStudentRecords.forEach((record) => {
        totalBilledByStudent += record.grossTotal || 0;
        totalPaidByStudent += record.paidAmount || 0;
        totalDiscountByStudent += record.discount || 0;
      });
    }

    const calculatedPreviousDues = Math.max(
      0,
      totalBilledByStudent - totalPaidByStudent - totalDiscountByStudent,
    );

    const studentObj = studentsMaster.find(
      (s) => s.enrollment.toLowerCase() === enroll.toLowerCase(),
    );

    if (studentObj) {
      const studentClass = studentObj.className || studentObj.class || "";
      const fullName =
        studentObj.name ||
        (studentObj.firstName
          ? `${studentObj.firstName} ${studentObj.lastName || ""}`.trim()
          : "");

      const autoMonthlyFee = classFeeMaster[studentClass] || 0;
      let isTransport = studentObj.isTransport || false;
      let routeId = studentObj.routeId || "";
      let autoTransportFee = 0;

      if (isTransport && routeId) {
        const routeObj = transportRoutes.find((r) => r.id === Number(routeId));
        autoTransportFee = routeObj ? routeObj.fee : 0;
      } else {
        isTransport = false;
        routeId = "";
        autoTransportFee = 0;
      }

      const type = studentObj.studentType || "Existing";
      const autoAnnualFee =
        type === "New"
          ? annualFeeMaster.newStudent
          : annualFeeMaster.existingStudent;

      setFormData((prev) => ({
        ...prev,
        enrollment: enroll,
        studentName: fullName,
        className: studentClass,
        studentType: type,
        monthlyFee: autoMonthlyFee,
        annualFee: autoAnnualFee,
        isTransportOpted: isTransport,
        selectedRouteId: routeId,
        transportFee: autoTransportFee,
        paidMonthsHistory: previouslyPaidMonths,
        isAnnualPaidHistory: isAnnualPaid,
        isExamPaidHistory: isExamPaid,
        includeAnnual: false,
        includeExam: false,
        selectedMonths: [],
        previousDues: calculatedPreviousDues,
      }));
    } else {
      setFormData((prev) => ({
        ...initialForm,
        enrollment: enroll,
        previousDues: calculatedPreviousDues,
      }));
    }
  };

  const handleStudentTypeChange = (type) => {
    const autoAnnualFee =
      type === "New"
        ? annualFeeMaster.newStudent
        : annualFeeMaster.existingStudent;
    setFormData((prev) => ({
      ...prev,
      studentType: type,
      annualFee: autoAnnualFee,
    }));
  };

  const handleClassSelect = (e) => {
    const selectedClass = e.target.value;
    setFormData((prev) => ({
      ...prev,
      className: selectedClass,
      monthlyFee: classFeeMaster[selectedClass] || 0,
    }));
  };

  const handleRouteSelect = (e) => {
    const val = e.target.value;
    if (val === "none" || val === "") {
      setFormData((prev) => ({
        ...prev,
        isTransportOpted: false,
        selectedRouteId: "",
        transportFee: 0,
      }));
    } else {
      const routeId = Number(val);
      const selectedRoute = transportRoutes.find((r) => r.id === routeId);
      setFormData((prev) => ({
        ...prev,
        isTransportOpted: true,
        selectedRouteId: routeId,
        transportFee: selectedRoute ? selectedRoute.fee : 0,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "includeAnnual" && checked && formData.isAnnualPaidHistory)
        return toast.warning("Annual Fee already paid!");
      if (name === "includeExam" && checked && formData.isExamPaidHistory)
        return toast.warning("Exam Fee already paid!");
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMonthToggle = (month) => {
    if (formData.paidMonthsHistory.includes(month)) return;
    setFormData((prev) => {
      const updatedMonths = prev.selectedMonths.includes(month)
        ? prev.selectedMonths.filter((m) => m !== month)
        : [...prev.selectedMonths, month];
      return { ...prev, selectedMonths: updatedMonths };
    });
  };

  const handleFillFullPay = () =>
    setFormData((prev) => ({ ...prev, paidAmount: calculatedTotals.netTotal }));

  const handleAddClassFee = (e) => {
    e.preventDefault();
    if (!newClass || !newClassFee) return;
    setClassFeeMaster((prev) => ({ ...prev, [newClass]: Number(newClassFee) }));
    toast.success(`Class ${newClass} Fee set to ₹${newClassFee}`);
    setNewClass("");
    setNewClassFee("");
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRouteName || !newRouteFee) return;
    setTransportRoutes((prev) => [
      ...prev,
      { id: Date.now(), routeName: newRouteName, fee: Number(newRouteFee) },
    ]);
    toast.success("Transport Route Added!");
    setNewRouteName("");
    setNewRouteFee("");
  };

  const handleAnnualFeeMasterChange = (field, val) =>
    setAnnualFeeMaster((prev) => ({ ...prev, [field]: Number(val) }));

  // --- PART 2 IS BELOW ---
  // 3. Backend Integration: Save / Update Fee
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.enrollment || !formData.studentName) {
      toast.error("Please enter enrollment ID and student details.");
      return;
    }

    if (
      formData.selectedMonths.length === 0 &&
      !formData.includeAnnual &&
      !formData.includeExam &&
      calculatedTotals.previousDues === 0 // Agar sirf purana due pay kar raha ho toh allow karein
    ) {
      toast.error("Please select at least one fee component or clear dues.");
      return;
    }

    const netTotal = calculatedTotals.netTotal;
    const paidAmount = Number(formData.paidAmount || 0);

    if (paidAmount < 0) {
      toast.error("Paid amount cannot be negative.");
      return;
    }

    if (paidAmount > netTotal) {
      toast.error("Paid amount cannot exceed payable total.");
      return;
    }

    const dueAmount = netTotal - paidAmount;
    const status =
      paidAmount === netTotal ? "Paid" : paidAmount > 0 ? "Partial" : "Unpaid";

    const feeData = {
      ...formData,
      grossTotal: calculatedTotals.grossTotal,
      previousDues: calculatedTotals.previousDues, // Naya Bakaaya Logic
      totalFee: netTotal,
      paidAmount,
      dueAmount,
      status,
      receiptNo: editingFee
        ? editingFee.receiptNo
        : `REC-${Date.now().toString().slice(-6)}`,
    };

    try {
      if (editingFee) {
        // Update API Call
        const updated = await feeService.updateFee(editingFee._id, feeData);
        setFees((prev) =>
          prev.map((fee) => (fee._id === editingFee._id ? updated : fee)),
        );
        toast.success("Fee Record Updated Successfully!");
      } else {
        // Create API Call
        const added = await feeService.addFee(feeData);
        setFees((prev) => [added, ...prev]);
        toast.success("Fee Collected Successfully!");
        setPrintModalFee(added);
      }
      setFormData(initialForm);
      setEditingFee(null);
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to process transaction.");
    }
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);

    const otherRecords = fees.filter(
      (f) =>
        f.enrollment.toLowerCase() === fee.enrollment.toLowerCase() &&
        f._id !== fee._id,
    );

    setFormData({
      ...fee,
      isAnnualPaidHistory: otherRecords.some((r) => r.includeAnnual),
      isExamPaidHistory: otherRecords.some((r) => r.includeExam),
      annualFee:
        fee.annualFee ||
        (fee.studentType === "New"
          ? annualFeeMaster.newStudent
          : annualFeeMaster.existingStudent),
      examFee: fee.examFee || 500,
      previousDues: fee.previousDues || 0,
      paymentMode: fee.paymentMode || "Cash",
    });
    setShowModal(true);
  };

  // 4. Backend Integration: Delete Fee
  const confirmDeleteFee = async () => {
    if (!feeToDelete) return;
    try {
      await feeService.deleteFee(feeToDelete._id);
      setFees((prev) => prev.filter((fee) => fee._id !== feeToDelete._id));
      toast.success("Record Deleted Successfully!");
      setFeeToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete record.");
    }
  };

  const currency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

  const ReceiptContent = ({ fee, copyType }) => (
    <div className="receipt-box">
      <div className="receipt-header">
        <div className="school-info">
          <h2>R.B.G. PUBLIC SCHOOL</h2>
          <p>Titra, Bihar | Contact: +91 98765 43210</p>
        </div>
        <div className="receipt-tag">
          <span>{copyType}</span>
        </div>
      </div>
      <div className="receipt-meta">
        <div>
          <strong>Receipt No:</strong> {fee.receiptNo}
        </div>
        <div>
          <strong>Date:</strong> {fee.paymentDate || "N/A"}
        </div>
        <div>
          <strong>Mode:</strong> {fee.paymentMode || "Cash"}
        </div>
      </div>
      <div className="receipt-student-info">
        <div>
          <strong>Student:</strong> {fee.studentName} ({fee.enrollment})
        </div>
        <div>
          <strong>Class:</strong> {fee.className} | <strong>Type:</strong>{" "}
          {fee.studentType || "Existing"}
        </div>
      </div>

      {fee.selectedMonths && fee.selectedMonths.length > 0 && (
        <div className="receipt-months-badge">
          <strong>Months Paid:</strong> {fee.selectedMonths.join(", ")}
        </div>
      )}

      <table className="receipt-table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {fee.selectedMonths?.length > 0 && (
            <>
              <tr>
                <td>Tuition Fee ({fee.selectedMonths.length} Month/s)</td>
                <td className="text-right">
                  {currency(fee.selectedMonths.length * fee.monthlyFee)}
                </td>
              </tr>
              {fee.isTransportOpted && Number(fee.transportFee) > 0 && (
                <tr>
                  <td>Transport Fee ({fee.selectedMonths.length} Month/s)</td>
                  <td className="text-right">
                    {currency(fee.selectedMonths.length * fee.transportFee)}
                  </td>
                </tr>
              )}
            </>
          )}
          {fee.includeAnnual && (
            <tr>
              <td>Annual Charges ({fee.studentType || "Existing"} Student)</td>
              <td className="text-right">{currency(fee.annualFee)}</td>
            </tr>
          )}
          {fee.includeExam && (
            <tr>
              <td>Exam Fee</td>
              <td className="text-right">{currency(fee.examFee)}</td>
            </tr>
          )}
          {Number(fee.previousDues) > 0 && (
            <tr className="previous-dues-row">
              <td>
                <strong>Previous Dues (Arrears)</strong>
              </td>
              <td className="text-right text-danger">
                <strong>{currency(fee.previousDues)}</strong>
              </td>
            </tr>
          )}
          {Number(fee.discount) > 0 && (
            <tr className="discount-row">
              <td>Discount Offered (-)</td>
              <td className="text-right">-{currency(fee.discount)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="receipt-summary">
        <div>
          Payable: <strong>{currency(fee.totalFee)}</strong>
        </div>
        <div>
          Paid:{" "}
          <strong className="text-success">{currency(fee.paidAmount)}</strong>
        </div>
        <div>
          Due:{" "}
          <strong className="text-danger">{currency(fee.dueAmount)}</strong>
        </div>
      </div>

      <div className="receipt-footer">
        <div>
          <small>
            Status: <b>{fee.status}</b>
          </small>
        </div>
        <div className="signature-space">
          <p>Authorized Signatory</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-dashboard-main">
        <Topbar />
        <div className="admin-dashboard-content">
          <div className="fees-page">
            <div className="fees-header">
              <h1>Fees Management</h1>
              <div className="fees-header-right">
                <div className="fees-search">
                  <FaSearch className="fees-search-icon" />
                  <input
                    type="text"
                    placeholder="Search Name, Receipt, ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="fees-filters">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {Object.keys(classFeeMaster).map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>

                  <input
                    type="date"
                    className="fees-date-filter"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    title="Filter by Payment Date"
                  />

                  <button
                    type="button"
                    className="fees-today-btn"
                    onClick={handleSetToday}
                    title="Set Date to Today"
                  >
                    Today
                  </button>

                  <button
                    className="fees-reset-btn"
                    onClick={handleReset}
                    title="Reset All Filters"
                  >
                    <FaRedoAlt />
                  </button>

                  <button
                    className="fees-export-btn"
                    onClick={handleExportCSV}
                    title="Export to CSV"
                  >
                    <FaDownload /> Export
                  </button>

                  <button
                    className="fee-setup-btn"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <FaCog /> Fee Setup
                  </button>

                  <button
                    className="add-fee-btn"
                    onClick={() => {
                      setEditingFee(null);
                      setFormData(initialForm);
                      setShowModal(true);
                    }}
                  >
                    <FaPlus /> Collect Fee
                  </button>
                </div>
              </div>
            </div>

            {/* Fees Table */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading Fee Records...
              </div>
            ) : (
              <div className="fees-table-container">
                <table className="fees-table">
                  <thead>
                    <tr>
                      <th>Receipt No</th>
                      <th>Enrollment</th>
                      <th>Student Name</th>
                      <th>Class</th>
                      <th>Type</th>
                      <th>Months Paid</th>
                      <th>Total Payable</th>
                      <th>Paid</th>
                      <th>Due</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFees.length > 0 ? (
                      currentFees.map((fee) => (
                        <tr key={fee._id}>
                          <td>
                            <strong>{fee.receiptNo}</strong>
                          </td>
                          <td>{fee.enrollment}</td>
                          <td>{fee.studentName}</td>
                          <td>{fee.className}</td>
                          <td>
                            <span
                              className={`student-type-pill ${
                                fee.studentType === "New" ? "new" : "existing"
                              }`}
                            >
                              {fee.studentType || "Existing"}
                            </span>
                          </td>
                          <td>
                            <span className="months-tag">
                              {fee.selectedMonths?.length
                                ? fee.selectedMonths.join(", ")
                                : "None"}
                            </span>
                          </td>
                          <td>{currency(fee.totalFee)}</td>
                          <td>{currency(fee.paidAmount)}</td>
                          <td>{currency(fee.dueAmount)}</td>
                          <td>
                            <span
                              className={`fees-status ${fee.status.toLowerCase()}`}
                            >
                              {fee.status}
                            </span>
                          </td>
                          <td>
                            <div className="fee-action-buttons">
                              <button
                                className="fee-view-btn"
                                onClick={() => setViewingFee(fee)}
                                title="View Receipt"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="fee-print-btn"
                                onClick={() => setPrintModalFee(fee)}
                                title="Print Receipt"
                              >
                                <FaPrint />
                              </button>
                              <button
                                className="fee-edit-btn"
                                onClick={() => handleEdit(fee)}
                                title="Edit Record"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="fee-delete-btn"
                                onClick={() => {
                                  setFeeToDelete(fee);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete Record"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="no-fees">
                          No Fee Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredFees.length > 0 && (
              <div className="fees-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active-page" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}

            {/* MODAL 1: MASTER SETUP */}
            {showSettingsModal && (
              <div className="fees-modal-overlay">
                <div className="fees-modal setup-modal">
                  <h2>
                    <FaCog /> Master Fee Setup
                  </h2>

                  <div className="setup-box margin-bottom-15">
                    <h3>
                      <FaUserCheck /> Default Annual Charge Rates
                    </h3>
                    <div className="setup-inline-form-row">
                      <div>
                        <label>New Student Annual Charge (₹)</label>
                        <input
                          type="number"
                          value={annualFeeMaster.newStudent}
                          onChange={(e) =>
                            handleAnnualFeeMasterChange(
                              "newStudent",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <label>Existing Student Annual Charge (₹)</label>
                        <input
                          type="number"
                          value={annualFeeMaster.existingStudent}
                          onChange={(e) =>
                            handleAnnualFeeMasterChange(
                              "existingStudent",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="setup-grid">
                    <div className="setup-box">
                      <h3>
                        <FaGraduationCap /> Class Monthly Fees
                      </h3>
                      <form
                        onSubmit={handleAddClassFee}
                        className="setup-inline-form"
                      >
                        <input
                          type="text"
                          placeholder="Class (e.g. 10-A)"
                          value={newClass}
                          onChange={(e) => setNewClass(e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          placeholder="Monthly Fee (₹)"
                          value={newClassFee}
                          onChange={(e) => setNewClassFee(e.target.value)}
                          required
                        />
                        <button type="submit" className="add-fee-btn">
                          Save
                        </button>
                      </form>

                      <div className="setup-list">
                        {Object.entries(classFeeMaster).map(([cls, fee]) => (
                          <div key={cls} className="setup-item">
                            <span>Class {cls}</span>
                            <strong>₹ {fee} / month</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="setup-box">
                      <h3>
                        <FaBus /> Transport Routes & Rates
                      </h3>
                      <form
                        onSubmit={handleAddRoute}
                        className="setup-inline-form"
                      >
                        <input
                          type="text"
                          placeholder="Route Name / Area"
                          value={newRouteName}
                          onChange={(e) => setNewRouteName(e.target.value)}
                          required
                        />
                        <input
                          type="number"
                          placeholder="Route Fee (₹)"
                          value={newRouteFee}
                          onChange={(e) => setNewRouteFee(e.target.value)}
                          required
                        />
                        <button type="submit" className="add-fee-btn">
                          Add Route
                        </button>
                      </form>

                      <div className="setup-list">
                        {transportRoutes.map((route) => (
                          <div key={route.id} className="setup-item">
                            <span>{route.routeName}</span>
                            <strong>₹ {route.fee} / month</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="fees-modal-buttons">
                    <button
                      className="fees-cancel-btn"
                      onClick={() => setShowSettingsModal(false)}
                    >
                      Close Setup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 2: COLLECT / EDIT FEE MODAL */}
            {showModal && (
              <div className="fees-modal-overlay">
                <div className="fees-modal month-module-modal">
                  <h2>
                    {editingFee
                      ? "Edit Fee Record"
                      : "Collect Fee (Apr to Mar Session)"}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div>
                        <label>Enrollment ID</label>
                        <input
                          type="text"
                          name="enrollment"
                          value={formData.enrollment}
                          onChange={handleEnrollmentChange}
                          placeholder="e.g. STU001"
                          required
                        />
                      </div>
                      <div>
                        <label>Student Name</label>
                        <input
                          type="text"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          placeholder="Student Name"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div>
                        <label>Class</label>
                        <select
                          name="className"
                          value={formData.className}
                          onChange={handleClassSelect}
                          required
                        >
                          <option value="">Select Class</option>
                          {Object.keys(classFeeMaster).map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label>Monthly Class Fee (Auto-Set)</label>
                        <input
                          type="number"
                          name="monthlyFee"
                          value={formData.monthlyFee}
                          onChange={handleChange}
                          className="auto-filled-input"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div>
                        <label>Student Type (Annual Charge Rate)</label>
                        <div className="type-toggle-group">
                          <button
                            type="button"
                            className={`type-btn ${
                              formData.studentType === "Existing"
                                ? "active"
                                : ""
                            }`}
                            onClick={() => handleStudentTypeChange("Existing")}
                          >
                            Existing (₹{annualFeeMaster.existingStudent})
                          </button>
                          <button
                            type="button"
                            className={`type-btn ${
                              formData.studentType === "New" ? "active" : ""
                            }`}
                            onClick={() => handleStudentTypeChange("New")}
                          >
                            New (₹{annualFeeMaster.newStudent})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Transport Auto-Fetched Section */}
                    <div className="transport-auto-box">
                      <div className="form-grid">
                        <div>
                          <label>
                            <FaBus /> Transport Route (Auto-Fetched)
                          </label>
                          <select
                            name="selectedRouteId"
                            value={
                              formData.isTransportOpted
                                ? formData.selectedRouteId
                                : "none"
                            }
                            onChange={handleRouteSelect}
                          >
                            <option value="none">
                              None (Not Opted / No Bus)
                            </option>
                            {transportRoutes.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.routeName} (₹{r.fee}/mo)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label>Transport Monthly Fee (₹)</label>
                          <input
                            type="number"
                            name="transportFee"
                            value={
                              formData.isTransportOpted
                                ? formData.transportFee
                                : 0
                            }
                            className="auto-filled-input"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    {/* Month Picker */}
                    <div className="month-picker-section">
                      <label className="section-label">
                        Select Fee Months (Apr - Mar):
                      </label>
                      <div className="months-grid">
                        {ACADEMIC_MONTHS.map((month) => {
                          const isPaid =
                            formData.paidMonthsHistory.includes(month);
                          const isSelected =
                            formData.selectedMonths.includes(month);

                          return (
                            <div
                              key={month}
                              className={`month-card ${
                                isPaid ? "paid" : isSelected ? "selected" : ""
                              }`}
                              onClick={() => handleMonthToggle(month)}
                            >
                              <span className="month-name">{month}</span>
                              {isPaid ? (
                                <span className="status-badge paid">
                                  <FaCheckCircle /> Paid
                                </span>
                              ) : isSelected ? (
                                <span className="status-badge selected">
                                  Selected
                                </span>
                              ) : (
                                <span className="status-badge unpaid">
                                  Unpaid
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fee Toggles */}
                    <div className="fee-toggles-container">
                      <div className="fee-toggle-box">
                        <label
                          className={`checkbox-label ${
                            formData.isAnnualPaidHistory ? "disabled" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="includeAnnual"
                            checked={formData.includeAnnual}
                            onChange={handleChange}
                            disabled={formData.isAnnualPaidHistory}
                          />
                          <span>
                            Include Annual Fee ({formData.studentType})
                          </span>
                          {formData.isAnnualPaidHistory && (
                            <span className="already-paid-tag">
                              <FaCheckCircle /> Already Paid
                            </span>
                          )}
                        </label>
                        {formData.includeAnnual &&
                          !formData.isAnnualPaidHistory && (
                            <input
                              type="number"
                              name="annualFee"
                              className="toggle-amount-input"
                              value={formData.annualFee}
                              onChange={handleChange}
                            />
                          )}
                      </div>

                      <div className="fee-toggle-box">
                        <label
                          className={`checkbox-label ${
                            formData.isExamPaidHistory ? "disabled" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="includeExam"
                            checked={formData.includeExam}
                            onChange={handleChange}
                            disabled={formData.isExamPaidHistory}
                          />
                          <span>Include Exam Fee</span>
                          {formData.isExamPaidHistory && (
                            <span className="already-paid-tag">
                              <FaCheckCircle /> Already Paid
                            </span>
                          )}
                        </label>
                        {formData.includeExam &&
                          !formData.isExamPaidHistory && (
                            <input
                              type="number"
                              name="examFee"
                              className="toggle-amount-input"
                              value={formData.examFee}
                              onChange={handleChange}
                            />
                          )}
                      </div>

                      <div className="discount-input-box">
                        <label>Discount Offered (₹):</label>
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          placeholder="e.g. 500"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div>
                        <label>Payment Mode</label>
                        <select
                          name="paymentMode"
                          value={formData.paymentMode}
                          onChange={handleChange}
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI / QR Code</option>
                          <option value="Card">Card</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      <div>
                        <label>Payment Date</label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div>
                        <label>Paid Amount Now (₹)</label>
                        <div className="paid-amount-wrapper">
                          <input
                            type="number"
                            name="paidAmount"
                            value={formData.paidAmount}
                            onChange={handleChange}
                            placeholder="Amount Paid"
                            min="0"
                            required
                          />
                          <button
                            type="button"
                            className="quick-pay-btn"
                            onClick={handleFillFullPay}
                          >
                            Full Pay
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="fee-preview">
                      <div>
                        <span>Selected Months</span>
                        <strong>{calculatedTotals.monthsCount} Month(s)</strong>
                      </div>
                      <div>
                        <span>Current Bill Gross</span>
                        <strong>{currency(calculatedTotals.grossTotal)}</strong>
                      </div>
                      {calculatedTotals.previousDues > 0 && (
                        <div>
                          <span className="text-danger">Previous Dues</span>
                          <strong className="text-danger">
                            +{currency(calculatedTotals.previousDues)}
                          </strong>
                        </div>
                      )}
                      <div>
                        <span>Discount</span>
                        <strong className="text-success">
                          -{currency(formData.discount)}
                        </strong>
                      </div>
                      <div>
                        <span>Net Payable Total</span>
                        <strong>{currency(calculatedTotals.netTotal)}</strong>
                      </div>
                    </div>

                    <div className="fees-modal-buttons">
                      <button
                        type="button"
                        className="fees-cancel-btn"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="fees-save-btn">
                        Collect Fee & Print
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* View Modal */}
            {viewingFee && (
              <div className="fee-view-overlay">
                <div className="receipt-modal">
                  <h2>View Fee Receipt</h2>
                  <ReceiptContent
                    fee={viewingFee}
                    copyType="OFFICIAL RECEIPT"
                  />
                  <div className="receipt-modal-footer no-print margin-top-10">
                    <button
                      className="fees-cancel-btn"
                      onClick={() => setViewingFee(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Print Modal */}
            {printModalFee && (
              <div className="fee-view-overlay">
                <div className="receipt-modal">
                  <div className="receipt-modal-header no-print">
                    <h2>Print Fee Receipt</h2>
                    <div className="mode-toggle-buttons">
                      <button
                        className={`mode-btn ${
                          printMode === "split" ? "active" : ""
                        }`}
                        onClick={() => setPrintMode("split")}
                      >
                        2 Copies (Split A5)
                      </button>
                      <button
                        className={`mode-btn ${
                          printMode === "full" ? "active" : ""
                        }`}
                        onClick={() => setPrintMode("full")}
                      >
                        Full A5 Copy
                      </button>
                    </div>
                  </div>

                  <div className="printable-receipt-container">
                    {printMode === "split" ? (
                      <div className="a5-split-wrapper">
                        <ReceiptContent
                          fee={printModalFee}
                          copyType="STUDENT COPY"
                        />
                        <div className="tear-line">
                          <span>
                            <FaCut /> CUT HERE
                          </span>
                        </div>
                        <ReceiptContent
                          fee={printModalFee}
                          copyType="OFFICE COPY"
                        />
                      </div>
                    ) : (
                      <ReceiptContent
                        fee={printModalFee}
                        copyType="OFFICIAL RECEIPT"
                      />
                    )}
                  </div>

                  <div className="receipt-modal-footer no-print">
                    <button
                      className="fees-cancel-btn"
                      onClick={() => setPrintModalFee(null)}
                    >
                      Close
                    </button>
                    <button
                      className="add-fee-btn"
                      onClick={() => window.print()}
                    >
                      <FaPrint /> Print Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
              <div className="delete-modal-overlay">
                <div className="delete-modal">
                  <h2>Delete Record?</h2>
                  <p>
                    Are you sure you want to delete fee record for{" "}
                    <strong>{feeToDelete?.studentName}</strong>?
                  </p>
                  <div className="delete-modal-actions">
                    <button
                      className="delete-cancel-btn"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="delete-confirm-btn"
                      onClick={confirmDeleteFee}
                    >
                      Delete
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

export default Fees;
