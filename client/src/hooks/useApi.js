import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function useApi() {
  const { token, logout } = useAuth();
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "/api",
  });
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) logout();
      return Promise.reject(err);
    }
  );
  return api;
}
