import api from "./api";

const API_URL = "/transport";

// --- Aapke Pehle Wale Functions (Safe Rakhe Gaye Hain) ---
export const getStudentTransport = async (studentId) => {
  try {
    const response = await api.get(`${API_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransportInfo = async (transportData) => {
  try {
    const response = await api.post(API_URL, transportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Naye CRUD Functions (Transport.jsx ke liye) ---
export const getAllRoutes = async () => {
  try {
    // Note: Backend endpoint match karne ke liye '/routes' hata diya hai
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRoute = async (routeData) => {
  try {
    const response = await api.post(API_URL, routeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRoute = async (id, routeData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, routeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const transportService = {
  getStudentTransport,
  updateTransportInfo,
  getAllRoutes,
  addRoute,
  updateRoute,
  deleteRoute,
};

export default transportService;
