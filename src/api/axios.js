import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("access");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;
