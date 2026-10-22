// src/services/noticeService.js
import api from "./api";

const API_URL = "/notices";

// Fetch all notices
export const getAllNotices = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new notice
export const addNotice = async (noticeData) => {
  try {
    const response = await api.post(API_URL, noticeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update notice by ID
export const updateNotice = async (id, noticeData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, noticeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete notice by ID
export const deleteNotice = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const noticeService = {
  getAllNotices,
  addNotice,
  updateNotice,
  deleteNotice,
};

export default noticeService;
