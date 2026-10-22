import React, { useState } from "react";
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

const Transport = () => {
  // Dummy Transport Routes Data
  const [routes, setRoutes] = useState([
    {
      id: 1,
      routeName: "Route 1 - City Center Express",
      busNumber: "BUS-01",
      vehicleNumber: "MH 12 AB 1234",
      driverName: "Ramesh Sharma",
      driverPhone: "+91 9876543210",
      stops: "Station Circle, Market Yard, Green Park, School Campus",
      fare: 1500,
      status: "Active",
    },
    {
      id: 2,
      routeName: "Route 2 - North Suburbs",
      busNumber: "BUS-02",
      vehicleNumber: "MH 12 CD 5678",
      driverName: "Suresh Kumar",
      driverPhone: "+91 9812345678",
      stops: "Hightech City, Royal Residency, Oakridge, School Campus",
      fare: 1800,
      status: "Active",
    },
    {
      id: 3,
      routeName: "Route 3 - South Hill Line",
      busNumber: "BUS-03",
      vehicleNumber: "MH 12 EF 9012",
      driverName: "Vikram Singh",
      driverPhone: "+91 9765432109",
      stops: "Valley View, Lake Chowk, Sun City, School Campus",
      fare: 1200,
      status: "Inactive",
    },
  ]);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal & Form State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    routeName: "",
    busNumber: "",
    vehicleNumber: "",
    driverName: "",
    driverPhone: "",
    stops: "",
    fare: "",
    status: "Active",
  });

  // Filter Logic
  const filteredRoutes = routes.filter((item) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      item.routeName.toLowerCase().includes(searchText) ||
      item.busNumber.toLowerCase().includes(searchText) ||
      item.driverName.toLowerCase().includes(searchText) ||
      item.stops.toLowerCase().includes(searchText);

    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    toast.info("Filters reset successfully");
  };

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      id: null,
      routeName: "",
      busNumber: "",
      vehicleNumber: "",
      driverName: "",
      driverPhone: "",
      stops: "",
      fare: "",
      status: "Active",
    });
    setIsAddEditOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setIsAddEditOpen(true);
  };

  const handleView = (item) => {
    setSelectedRoute(item);
    setIsViewOpen(true);
  };

  const handleDelete = (item) => {
    if (
      window.confirm(`Are you sure you want to delete "${item.routeName}"?`)
    ) {
      setRoutes(routes.filter((r) => r.id !== item.id));
      toast.error(`Route deleted: "${item.routeName}"`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formData.id) {
      setRoutes(
        routes.map((r) =>
          r.id === formData.id
            ? { ...formData, fare: Number(formData.fare) }
            : r,
        ),
      );
      toast.success("Transport route updated successfully!");
    } else {
      const newRoute = {
        id: Date.now(),
        ...formData,
        fare: Number(formData.fare),
      };
      setRoutes([newRoute, ...routes]);
      toast.success("New transport route added!");
    }

    setIsAddEditOpen(false);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-dashboard-main">
        <Topbar />

        <div className="admin-dashboard-content">
          <div className="transport-page">
            {/* Header Controls */}
            <div className="transport-header">
              <h1>
                <FaBus className="header-icon" /> Transport Management
              </h1>

              <div className="transport-header-right">
                <div className="transport-search">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search route, driver, bus no..."
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

            {/* Routes Table */}
            <div className="transport-table-container">
              <table className="transport-table">
                <thead>
                  <tr>
                    <th>Bus / Route</th>
                    <th>Vehicle No.</th>
                    <th>Driver & Contact</th>
                    <th>Stops</th>
                    <th>Monthly Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.length > 0 ? (
                    filteredRoutes.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="route-info">
                            <span className="bus-badge">{item.busNumber}</span>
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
                        <td className="stops-cell" title={item.stops}>
                          <FaMapMarkerAlt className="marker-icon" />{" "}
                          {item.stops}
                        </td>
                        <td>₹{item.fare} / mo</td>
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
                      <td colSpan="7" className="no-records">
                        No transport routes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <div className="transport-modal-overlay">
          <div className="transport-modal">
            <div className="transport-modal-header">
              <h2>
                {formData.id ? "Edit Transport Route" : "Add Transport Route"}
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

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Fee (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1500"
                    value={formData.fare}
                    onChange={(e) =>
                      setFormData({ ...formData, fare: e.target.value })
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
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Stops (Comma Separated)</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Stop 1, Stop 2, Stop 3, School Campus"
                  value={formData.stops}
                  onChange={(e) =>
                    setFormData({ ...formData, stops: e.target.value })
                  }
                ></textarea>
              </div>

              <button type="submit" className="save-transport-btn">
                {formData.id ? "Update Route" : "Create Route"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Route Modal */}
      {isViewOpen && selectedRoute && (
        <div className="transport-modal-overlay">
          <div className="transport-modal view-modal">
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
                <strong>Monthly Fee:</strong>{" "}
                <span>₹{selectedRoute.fare} / month</span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong>{" "}
                <span
                  className={`status-badge ${selectedRoute.status.toLowerCase()}`}
                >
                  {selectedRoute.status}
                </span>
              </div>
              <div className="detail-item full-width">
                <strong>Stops Covered:</strong>
                <p className="stops-list">{selectedRoute.stops}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transport;
