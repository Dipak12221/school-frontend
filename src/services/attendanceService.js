// src/services/attendanceService.js
import api from "./api";

const API_URL = "/attendance";

// Get student attendance summary
export const getAttendanceStats = async (studentId) => {
  try {
    const response = await api.get(`${API_URL}/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark daily attendance
export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post(`${API_URL}/mark`, attendanceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const attendanceService = {
  getAttendanceStats,
  markAttendance,
};

export default attendanceService;
