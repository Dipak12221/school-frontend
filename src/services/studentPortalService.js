// src/services/studentPortalService.js
import api from "./api";

const API_URL = "/student/dashboard";

// Get logged-in student profile & summary data
export const getStudentDashboardData = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student personal details (e.g. mobile/email/address update request)
export const updateStudentProfile = async (profileData) => {
  try {
    const response = await api.put(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const studentPortalService = {
  getStudentDashboardData,
  updateStudentProfile,
};

export default studentPortalService;
