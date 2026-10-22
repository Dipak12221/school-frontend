// src/services/transportService.js
import api from "./api";

const API_URL = "/transport";

// Get assigned transport route details for a student
export const getStudentTransport = async (studentId) => {
  try {
    const response = await api.get(`${API_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all transport routes (Admin view)
export const getAllRoutes = async () => {
  try {
    const response = await api.get(`${API_URL}/routes`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add or update transport assignment (Admin view)
export const updateTransportInfo = async (transportData) => {
  try {
    const response = await api.post(API_URL, transportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const transportService = {
  getStudentTransport,
  getAllRoutes,
  updateTransportInfo,
};

export default transportService;
