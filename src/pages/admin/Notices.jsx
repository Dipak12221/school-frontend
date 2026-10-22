import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBullhorn,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";

import "./Notices.css";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const INITIAL_NOTICES_DATA = [
  {
    id: 1,
    title: "Annual Sports Day 2026",
    category: "Event",
    audience: "All",
    date: "2026-08-25",
    status: "Active",
    content:
      "The annual sports day will be held on August 25th in the main playground. Registration starts tomorrow.",
  },
  {
    id: 2,
    title: "Mid-Term Examination Schedule",
    category: "Exam",
    audience: "Students",
    date: "2026-09-01",
    status: "Active",
    content:
      "Mid-term exams for classes 6 to 12 will begin from September 1st. Detailed datesheet attached.",
  },
  {
    id: 3,
    title: "Staff Meeting Notice",
    category: "Academic",
    audience: "Teachers",
    date: "2026-08-20",
    status: "Draft",
    content:
      "Emergency staff meeting to discuss curriculum updates in Conference Hall A at 3 PM.",
  },
  {
    id: 4,
    title: "Summer Vacation Announcement",
    category: "General",
    audience: "All",
    date: "2026-05-10",
    status: "Expired",
    content:
      "School will remain closed for summer vacation from May 15 to June 15.",
  },
];

const Notices = () => {
  // 1. Persistent State Management
  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem("admin_notices_data");
    return saved ? JSON.parse(saved) : INITIAL_NOTICES_DATA;
  });

  useEffect(() => {
    localStorage.setItem("admin_notices_data", JSON.stringify(notices));
  }, [notices]);

  // 2. Filters & Pagination State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 3. Modals & Form State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const initialFormState = {
    id: null,
    title: "",
    category: "General",
    audience: "All",
    date: getTodayDateString(),
    status: "Active",
    content: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // 4. Memoized Dynamic Filtering
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        notice.title.toLowerCase().includes(searchText) ||
        notice.content.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "" || notice.category === categoryFilter;
      const matchesAudience =
        audienceFilter === "" || notice.audience === audienceFilter;
      const matchesStatus =
        statusFilter === "" || notice.status === statusFilter;

      return (
        matchesSearch && matchesCategory && matchesAudience && matchesStatus
      );
    });
  }, [notices, search, categoryFilter, audienceFilter, statusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotices = filteredNotices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("");
    setAudienceFilter("");
    setStatusFilter("");
    setCurrentPage(1);
    toast.info("Filters reset successfully");
  };

  // 5. CSV Export Feature
  const handleExportCSV = () => {
    if (filteredNotices.length === 0) {
      toast.warning("No notice records available to export!");
      return;
    }

    const headers = ["ID,Title,Category,Audience,Publish Date,Status,Content"];
    const csvRows = filteredNotices.map((notice) =>
      [
        notice.id,
        `"${notice.title.replace(/"/g, '""')}"`,
        notice.category,
        notice.audience,
        notice.date,
        notice.status,
        `"${(notice.content || "").replace(/"/g, '""')}"`,
      ].join(","),
    );

    const blob = new Blob([[headers, ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `School_Notices_Report_${getTodayDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Notices data exported to CSV!");
  };

  // Handlers
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddEditOpen(true);
  };

  const handleEdit = (notice) => {
    setFormData({ ...notice });
    setIsAddEditOpen(true);
  };

  const handleView = (notice) => {
    setSelectedNotice(notice);
    setIsViewOpen(true);
  };

  const promptDelete = (notice) => {
    setNoticeToDelete(notice);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!noticeToDelete) return;
    setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
    toast.success(`Deleted notice "${noticeToDelete.title}" successfully!`);
    setNoticeToDelete(null);
    setShowDeleteModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please fill in both notice title and content.");
      return;
    }

    if (formData.id) {
      setNotices((prev) =>
        prev.map((n) => (n.id === formData.id ? { ...formData } : n)),
      );
      toast.success("Notice updated successfully!");
    } else {
      const newNotice = {
        ...formData,
        id: Date.now(),
      };
      setNotices((prev) => [newNotice, ...prev]);
      toast.success("New notice published successfully!");
    }

    setIsAddEditOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          <div className="notices-page">
            {/* Header & Controls */}
            <div className="notices-header">
              <h1>
                <FaBullhorn className="header-icon" /> Notice Board Management
              </h1>

              <div className="notices-header-right">
                <div className="notices-search">
                  <FaSearch className="notices-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Title or Content..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="notices-filters">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Categories</option>
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                  </select>

                  <select
                    value={audienceFilter}
                    onChange={(e) => {
                      setAudienceFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Audience</option>
                    <option value="All">All</option>
                    <option value="Students">Students</option>
                    <option value="Teachers">Teachers</option>
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
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>

                  <button
                    className="notices-reset-btn"
                    onClick={handleReset}
                    title="Reset Filters"
                  >
                    <FaRedoAlt />
                  </button>

                  <button
                    className="fees-export-btn"
                    onClick={handleExportCSV}
                    title="Export Notices to CSV"
                  >
                    <FaDownload /> Export
                  </button>

                  <button className="add-notice-btn" onClick={handleOpenAdd}>
                    <FaPlus /> Add Notice
                  </button>
                </div>
              </div>
            </div>

            {/* Notice Table */}
            <div className="notices-table-container">
              <table className="notices-table">
                <thead>
                  <tr>
                    <th>Publish Date</th>
                    <th>Notice Title</th>
                    <th>Category</th>
                    <th>Audience</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentNotices.length > 0 ? (
                    currentNotices.map((notice) => (
                      <tr key={notice.id}>
                        <td className="notice-date">{notice.date}</td>
                        <td className="notice-title-cell">
                          <strong>{notice.title}</strong>
                        </td>
                        <td>
                          <span
                            className={`category-badge category-${notice.category.toLowerCase()}`}
                          >
                            {notice.category}
                          </span>
                        </td>
                        <td>
                          <span className="audience-badge">
                            {notice.audience}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${notice.status.toLowerCase()}`}
                          >
                            {notice.status}
                          </span>
                        </td>
                        <td>
                          <div className="notice-action-buttons">
                            <button
                              className="notice-view-btn"
                              onClick={() => handleView(notice)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="notice-edit-btn"
                              onClick={() => handleEdit(notice)}
                              title="Edit Notice"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="notice-delete-btn"
                              onClick={() => promptDelete(notice)}
                              title="Delete Notice"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="notices-empty-state">
                        No notices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredNotices.length > 0 && (
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
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <div className="notice-modal-overlay">
          <div className="notice-modal">
            <div className="notice-modal-header">
              <h2>{formData.id ? "Edit Notice" : "Create New Notice"}</h2>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="notice-modal-form">
              <div className="form-group">
                <label>Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter notice headline"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Audience</label>
                  <select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({ ...formData, audience: e.target.value })
                    }
                  >
                    <option value="All">All</option>
                    <option value="Students">Students</option>
                    <option value="Teachers">Teachers</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publish Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notice Details / Content</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write notice message content here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className="save-notice-btn">
                {formData.id ? "Update Notice" : "Publish Notice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedNotice && (
        <div className="notice-modal-overlay">
          <div className="notice-modal view-modal">
            <div className="notice-modal-header">
              <h2>Notice Preview</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>
            <div className="notice-details-card">
              <span
                className={`status-badge status-${selectedNotice.status.toLowerCase()}`}
              >
                {selectedNotice.status}
              </span>
              <h3>{selectedNotice.title}</h3>

              <div className="notice-meta-info">
                <span>
                  <strong>Category:</strong> {selectedNotice.category}
                </span>
                <span>
                  <strong>Target:</strong> {selectedNotice.audience}
                </span>
                <span>
                  <strong>Date:</strong> {selectedNotice.date}
                </span>
              </div>
              <hr />
              <div className="notice-content-body">
                <p>{selectedNotice.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && noticeToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Delete Notice?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{noticeToDelete.title}"</strong>? This action cannot be
              undone.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button className="delete-confirm-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
