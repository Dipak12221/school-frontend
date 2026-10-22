import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:5000/api", // Aapka backend port
  baseURL: "https://school-backend-1-hmhu.onrender.com/api", // Aapka backend port
});

// Har request ke sath JWT Token automatic bhejne ke liye Interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
