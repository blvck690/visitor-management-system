import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("vms_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("vms_token");
      localStorage.removeItem("vms_user");
      if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/approve")) {
        location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);