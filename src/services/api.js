import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  // Vercel/Local env variable pehle lega; agar nahi mila to default live Render backend lega
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://school-backend-1-hmhu.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Auth Token attach karne ke liye
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Har Backend Error ko intercept karke Toast dikhane ke liye
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message || "Server error! Please try again later.";

    toast.error(errorMessage); // Automatic failure notification
    return Promise.reject(error);
  },
);

export default API;
