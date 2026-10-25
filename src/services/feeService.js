import api from "../api/axiosInstance";

export const feeService = {
  getAllFees: async () => {
    const response = await api.get("/fees");
    return response.data;
  },
  addFee: async (data) => {
    const response = await api.post("/fees", data);
    return response.data;
  },
  updateFee: async (id, data) => {
    const response = await api.put(`/fees/${id}`, data);
    return response.data;
  },
  deleteFee: async (id) => {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
  },
};

export default feeService;
