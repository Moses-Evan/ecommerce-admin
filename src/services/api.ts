import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/admin/api/v1",
  baseURL: "https://overfill-remedy-superman.ngrok-free.dev/admin/api/v1",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});


export default api;
