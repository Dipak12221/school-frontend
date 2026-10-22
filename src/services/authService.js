import API from "./api";

// Student Login Call
export const studentLogin = async (data) => {
  const response = await API.post("/auth/login", data);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

// Admin Login Call
export const adminLogin = async (data) => {
  const response = await API.post("/auth/login", data);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

// Logout Helper
export const logout = () => {
  localStorage.removeItem("user");
};

export default API;
