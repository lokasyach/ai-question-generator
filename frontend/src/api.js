import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const registerUser = (username, email, password) =>
  api.post("/auth/register", { username, email, password });

export const loginUser = (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  return api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

// --- Upload ---
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- Questions ---
export const generateQuestions = (fileId, maxQuestions = 5) =>
  api.post("/questions/generate", { file_id: fileId, max_questions: maxQuestions });

export default api;