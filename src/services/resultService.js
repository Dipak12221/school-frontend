import axios from "axios";

const API_URL = "http://localhost:5000/api/results";

export const fetchResults = async () => axios.get(API_URL);
export const createResult = async (data) => axios.post(API_URL, data);
export const updateResult = async (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteResult = async (id) => axios.delete(`${API_URL}/${id}`);
