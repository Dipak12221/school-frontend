// src/services/timetableService.js
import api from "./api";

const API_URL = "/timetable";

// Get class-wise or student timetable
export const getTimetable = async (className, section) => {
  try {
    const response = await api.get(API_URL, {
      params: { class: className, section },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add or update weekly timetable (Admin feature)
export const saveTimetable = async (timetableData) => {
  try {
    const response = await api.post(API_URL, timetableData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const timetableService = {
  getTimetable,
  saveTimetable,
};

export default timetableService;
