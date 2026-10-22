import api from "../api/axiosInstance";

// Backend API Endpoint
const API_URL = "/teachers";

// 1. Get All Teachers (From MongoDB)
export const getAllTeachers = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Add New Teacher (To MongoDB)
export const addTeacher = async (teacherData) => {
  try {
    const response = await api.post(API_URL, teacherData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. Update Teacher (In MongoDB)
export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, teacherData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 4. Delete Teacher (From MongoDB)
export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Default export object for Teachers.jsx
const teacherService = {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
};

export default teacherService;
