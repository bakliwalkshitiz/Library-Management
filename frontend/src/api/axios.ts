import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const loginTimestamp = localStorage.getItem("loginTimestamp");

  if (loginTimestamp) {
    const elapsed = Date.now() - Number(loginTimestamp);
    if (elapsed > TWENTY_FOUR_HOURS) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");
      if (!window.location.pathname.startsWith("/login")) {
        toast.error("JWT expired, please login again");
        window.location.href = "/login";
      }
      return Promise.reject(new Error("JWT expired"));
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem("token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTimestamp");
      if (hadToken && !window.location.pathname.startsWith("/login")) {
        toast.error("JWT expired, please login again");
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
