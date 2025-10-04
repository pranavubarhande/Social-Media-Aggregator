import axios from "axios";

// Centralized Axios instance for client-side API calls
// Uses Next.js API routes under /api as the base URL
const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optionally add interceptors for logging or error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can extend this to map server errors to a unified shape
    return Promise.reject(error);
  }
);

export default axiosInstance;
