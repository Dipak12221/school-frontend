import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaRedoAlt,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImages,
  FaVideo,
  FaPlay,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";

import "./Gallery.css";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import galleryService from "../../services/galleryService"; // API Service Import

const getTodayDateString = () => new Date().toISOString().split("T")[0];

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const initialFormState = {
    title: "",
    category: "Events",
    mediaType: "image",
    mediaUrl: "",
    date: getTodayDateString(),
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // 1. Fetch Data from Backend
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAllGalleryItems();
      setGalleryItems(data || []);
    } catch (error) {
      toast.error("Failed to fetch gallery items from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Memoized Dynamic Filtering
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const searchText = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        (item.description &&
          item.description.toLowerCase().includes(searchText)) ||
        item.category.toLowerCase().includes(searchText);

      const matchesCategory =
        categoryFilter === "" || item.category === categoryFilter;
      const matchesType = typeFilter === "" || item.mediaType === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [galleryItems, search, categoryFilter, typeFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("");
    setTypeFilter("");
    setCurrentPage(1);
    toast.info("Filters reset successfully!");
  };

  // CSV Metadata Export
  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      toast.warning("No media records available to export!");
      return;
    }

    const headers = ["ID,Title,Category,Media Type,Date,Media URL,Description"];
    const csvRows = filteredItems.map((item) =>
      [
        item._id,
        `"${item.title.replace(/"/g, '""')}"`,
        item.category,
        item.mediaType,
        item.date,
        `"${item.mediaUrl}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
      ].join(","),
    );

    const blob = new Blob([[headers, ...csvRows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Gallery_Metadata_Report_${getTodayDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Gallery metadata exported to CSV!");
  };

  // Modal Handlers
  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddEditOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setIsAddEditOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const promptDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // 2. Delete Action via API
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await galleryService.deleteGalleryItem(itemToDelete._id);
      setGalleryItems((prev) => prev.filter((g) => g._id !== itemToDelete._id));
      toast.success(`Deleted "${itemToDelete.title}" successfully!`);
      setItemToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete media.");
    }
  };

  // 3. Save / Update via API
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      toast.error("Please enter a valid title and media URL.");
      return;
    }

    try {
      if (formData._id) {
        const updated = await galleryService.updateGalleryItem(
          formData._id,
          formData,
        );
        setGalleryItems((prev) =>
          prev.map((g) => (g._id === formData._id ? updated : g)),
        );
        toast.success("Gallery item updated successfully!");
      } else {
        const added = await galleryService.addGalleryItem(formData);
        setGalleryItems((prev) => [added, ...prev]);
        toast.success("New media added to gallery!");
      }
      setIsAddEditOpen(false);
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          <div className="gallery-page">
            <div className="gallery-header">
              <h1>
                <FaImages className="header-icon" /> Gallery Management
              </h1>

              <div className="gallery-header-right">
                <div className="gallery-search">
                  <FaSearch className="gallery-search-icon" />
                  <input
                    type="text"
                    placeholder="Search gallery..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="gallery-filters">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Categories</option>
                    <option value="Events">Events</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Campus">Campus</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                  </select>

                  <button
                    className="gallery-reset-btn"
                    onClick={handleReset}
                    title="Reset Filters"
                  >
                    <FaRedoAlt />
                  </button>

                  <button
                    className="fees-export-btn"
                    onClick={handleExportCSV}
                    title="Export Metadata to CSV"
                  >
                    <FaDownload /> Export
                  </button>

                  <button className="add-gallery-btn" onClick={handleOpenAdd}>
                    <FaPlus /> Add Media
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading gallery...
              </div>
            ) : (
              <div className="gallery-grid">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <div className="gallery-card" key={item._id}>
                      <div className="gallery-card-img-wrapper">
                        {item.mediaType === "video" ? (
                          <div className="video-thumbnail-container">
                            <video src={item.mediaUrl} preload="metadata" />
                            <div className="video-play-badge">
                              <FaPlay />
                            </div>
                          </div>
                        ) : (
                          <img src={item.mediaUrl} alt={item.title} />
                        )}

                        <span className="gallery-type-badge">
                          {item.mediaType === "video" ? (
                            <FaVideo />
                          ) : (
                            <FaImages />
                          )}{" "}
                          {item.category}
                        </span>

                        <div className="gallery-card-overlay">
                          <button
                            onClick={() => handleView(item)}
                            title="View / Play"
                          >
                            <FaEye />
                          </button>
                          <button onClick={() => handleEdit(item)} title="Edit">
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => promptDelete(item)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <div className="gallery-card-content">
                        <span className="gallery-date">{item.date}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="gallery-empty-state">
                    No images or videos found.
                  </div>
                )}
              </div>
            )}

            {!loading && filteredItems.length > 0 && (
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

      {isAddEditOpen && (
        <div className="gallery-modal-overlay">
          <div className="gallery-modal">
            <div className="gallery-modal-header">
              <h2>{formData._id ? "Edit Media" : "Add New Media"}</h2>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="gallery-modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports Day Highlights"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Media Type</label>
                  <select
                    value={formData.mediaType}
                    onChange={(e) =>
                      setFormData({ ...formData, mediaType: e.target.value })
                    }
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="Events">Events</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="Campus">Campus</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Media URL / URI (ImageKit / Cloudinary)</label>
                <input
                  type="url"
                  required
                  placeholder={
                    formData.mediaType === "video"
                      ? "https://ik.imagekit.io/.../video.mp4"
                      : "https://ik.imagekit.io/.../photo.jpg"
                  }
                  value={formData.mediaUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, mediaUrl: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Short details about the media..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className="save-gallery-btn">
                {formData._id ? "Update Media" : "Save Media"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isViewOpen && selectedItem && (
        <div className="gallery-modal-overlay">
          <div className="gallery-modal view-gallery-modal">
            <div className="gallery-modal-header">
              <h2>{selectedItem.title}</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="gallery-preview-body">
              {selectedItem.mediaType === "video" ? (
                <video
                  src={selectedItem.mediaUrl}
                  controls
                  autoPlay
                  className="gallery-preview-video"
                />
              ) : (
                <img src={selectedItem.mediaUrl} alt={selectedItem.title} />
              )}

              <div className="gallery-preview-details">
                <span className="gallery-type-badge">
                  {selectedItem.mediaType.toUpperCase()} -{" "}
                  {selectedItem.category}
                </span>
                <span className="gallery-date">{selectedItem.date}</span>
                <p>{selectedItem.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && itemToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h2>Delete Media Item?</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>"{itemToDelete.title}"</strong>? This action cannot be
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

export default Gallery;
