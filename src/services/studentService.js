// src/services/studentService.js
import api from "./api";

const API_URL = "/students";

// Get all students
export const getAllStudents = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add new student
export const addStudent = async (studentData) => {
  try {
    const response = await api.post(API_URL, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student by ID
export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete student by ID
export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const studentService = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};

export default studentService;
