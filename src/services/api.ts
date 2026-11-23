import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ?? "https://api.niorra.eu";
// export const API_ORIGIN =import.meta.env.VITE_API_ORIGIN ?? "http://localhost:8080";

let authToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

const api = axios.create({
  baseURL: `${API_ORIGIN}/admin/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
