import React, { useState, useEffect } from "react";
import {
  FaBus,
  FaSearch,
  FaRedoAlt,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaTimes,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

import "./Transport.css";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Topbar from "../../components/admin/Topbar/Topbar";
import transportService from "../../services/transportService";
import Loader from "../../components/common/Loader/Loader"; // <-- LOADER IMPORT KIYA GAYA

const Transport = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const initialFormState = {
    _id: null,
    routeName: "",
    busNumber: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    status: "Active",
    stops: [{ stopName: "" }], // Array of objects bina price ke
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await transportService.getAllRoutes();
      setRoutes(data || []);
    } catch (error) {
      toast.error("Failed to fetch transport routes from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter((item) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      item.routeName?.toLowerCase().includes(searchText) ||
      item.busNumber?.toLowerCase().includes(searchText) ||
      item.driverName?.toLowerCase().includes(searchText) ||
      (Array.isArray(item.stops) &&
        item.stops.some((s) => s.stopName?.toLowerCase().includes(searchText)));

    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    toast.info("Filters reset successfully");
  };

  // Dynamic Stop Fields Handlers
  const handleStopChange = (index, value) => {
    const updatedStops = [...formData.stops];
    updatedStops[index].stopName = value;
    setFormData({ ...formData, stops: updatedStops });
  };

  const handleAddStopField = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { stopName: "" }],
    });
  };

  const handleRemoveStopField = (index) => {
    if (formData.stops.length === 1) {
      toast.warning("At least one stop is required.");
      return;
    }
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: updatedStops });
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddEditOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      routeName: item.routeName,
      busNumber: item.busNumber,
      vehicleNumber: item.vehicleNumber,
      driverName: item.driverName,
      driverPhone: item.driverPhone,
      status: item.status || "Active",
      stops:
        Array.isArray(item.stops) && item.stops.length > 0
          ? item.stops.map((s) => ({ stopName: s.stopName }))
          : [{ stopName: "" }],
    });
    setIsAddEditOpen(true);
  };

  const handleView = (item) => {
    setSelectedRoute(item);
    setIsViewOpen(true);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(`Are you sure you want to delete "${item.routeName}"?`)
    ) {
      try {
        await transportService.deleteRoute(item._id);
        setRoutes(routes.filter((r) => r._id !== item._id));
        toast.success(`Route deleted: "${item.routeName}"`);
      } catch (error) {
        toast.error("Failed to delete the route.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Remove empty stops before sending
    const payload = {
      ...formData,
      stops: formData.stops
        .filter((s) => s.stopName.trim() !== "")
        .map((s) => ({
          stopName: s.stopName.trim(),
        })),
    };

    if (payload.stops.length === 0) {
      toast.error("Please add at least one valid stop.");
      return;
    }

    try {
      if (formData._id) {
        const updated = await transportService.updateRoute(
          formData._id,
          payload,
        );
        setRoutes(routes.map((r) => (r._id === formData._id ? updated : r)));
        toast.success("Transport route updated successfully!");
      } else {
        const newRoute = await transportService.addRoute(payload);
        setRoutes([newRoute, ...routes]);
        toast.success("New transport route added!");
      }
      setIsAddEditOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save transport route.",
      );
    }
  };
  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          <div className="transport-page">
            <div className="transport-header">
              <h1>
                <FaBus className="header-icon" /> Transport Management
              </h1>

              <div className="transport-header-right">
                <div className="transport-search">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search route, driver, bus no, stop..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="transport-filters">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  <button
                    className="transport-reset-btn"
                    onClick={handleReset}
                    title="Reset Filters"
                  >
                    <FaRedoAlt />
                  </button>

                  <button className="add-transport-btn" onClick={handleOpenAdd}>
                    <FaPlus /> Add New Route
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="transport-table-container">
                <table className="transport-table">
                  <thead>
                    <tr>
                      <th>Bus / Route</th>
                      <th>Vehicle No.</th>
                      <th>Driver & Contact</th>
                      <th>Stops</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoutes.length > 0 ? (
                      filteredRoutes.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="route-info">
                              <span className="bus-badge">
                                {item.busNumber}
                              </span>
                              <strong>{item.routeName}</strong>
                            </div>
                          </td>
                          <td>{item.vehicleNumber}</td>
                          <td>
                            <div className="driver-info">
                              <span>{item.driverName}</span>
                              <small>
                                <FaPhoneAlt /> {item.driverPhone}
                              </small>
                            </div>
                          </td>
                          <td className="stops-cell">
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "6px",
                              }}
                            >
                              {Array.isArray(item.stops) &&
                                item.stops.map((stop, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      backgroundColor: "#f1f5f9",
                                      padding: "3px 8px",
                                      borderRadius: "12px",
                                      fontSize: "12px",
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <FaMapMarkerAlt size={10} color="#64748b" />
                                    {stop.stopName}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                item.status === "Active" ? "active" : "inactive"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="action-btn view"
                                onClick={() => handleView(item)}
                                title="View Route Details"
                              >
                                <FaEye />
                              </button>
                              <button
                                className="action-btn edit"
                                onClick={() => handleEdit(item)}
                                title="Edit Route"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDelete(item)}
                                title="Delete Route"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-records">
                          No transport routes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddEditOpen && (
        <div className="transport-modal-overlay">
          <div
            className="transport-modal"
            style={{ maxWidth: "650px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="transport-modal-header">
              <h2>
                {formData._id ? "Edit Transport Route" : "Add Transport Route"}
              </h2>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="transport-modal-form">
              <div className="form-group">
                <label>Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 4 - West City Avenue"
                  value={formData.routeName}
                  onChange={(e) =>
                    setFormData({ ...formData, routeName: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bus Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BUS-04"
                    value={formData.busNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, busNumber: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Vehicle Reg Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 12 GH 3456"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vehicleNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Driver Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Patil"
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({ ...formData, driverName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Driver Contact Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.driverPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, driverPhone: e.target.value })
                    }
                  />
                </div>
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
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Dynamic Stops Section */}
              <div
                className="stops-management-section"
                style={{ marginTop: "10px", marginBottom: "15px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <label style={{ fontWeight: "600", color: "#334155" }}>
                    Stops Added
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStopField}
                    style={{
                      background: "#e0f2fe",
                      color: "#0284c7",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <FaPlus size={10} /> Add Stop
                  </button>
                </div>

                {formData.stops.map((stop, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      required
                      placeholder={`Stop ${index + 1} Name`}
                      value={stop.stopName}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {formData.stops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStopField(index)}
                        style={{
                          background: "#fee2e2",
                          color: "#ef4444",
                          border: "none",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                        title="Remove Stop"
                      >
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" className="save-transport-btn">
                {formData._id ? "Update Route" : "Create Route"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Route Modal */}
      {isViewOpen && selectedRoute && (
        <div className="transport-modal-overlay">
          <div
            className="transport-modal view-modal"
            style={{ maxWidth: "600px" }}
          >
            <div className="transport-modal-header">
              <h2>{selectedRoute.routeName}</h2>
              <button
                onClick={() => setIsViewOpen(false)}
                className="close-modal-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="view-route-details">
              <div className="detail-item">
                <strong>Bus Number:</strong>{" "}
                <span>{selectedRoute.busNumber}</span>
              </div>
              <div className="detail-item">
                <strong>Vehicle Registration:</strong>{" "}
                <span>{selectedRoute.vehicleNumber}</span>
              </div>
              <div className="detail-item">
                <strong>Driver Name:</strong>{" "}
                <span>{selectedRoute.driverName}</span>
              </div>
              <div className="detail-item">
                <strong>Driver Contact:</strong>{" "}
                <span>{selectedRoute.driverPhone}</span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${selectedRoute.status?.toLowerCase()}`}
                >
                  {selectedRoute.status}
                </span>
              </div>

              <div
                className="detail-item full-width"
                style={{ marginTop: "10px" }}
              >
                <strong>Stops Covered:</strong>
                <div style={{ marginTop: "8px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                        <th
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          #
                        </th>
                        <th
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          Stop Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedRoute.stops) &&
                        selectedRoute.stops.map((stop, i) => (
                          <tr key={i}>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #f1f5f9",
                              }}
                            >
                              {i + 1}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                borderBottom: "1px solid #f1f5f9",
                              }}
                            >
                              {stop.stopName}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transport;
