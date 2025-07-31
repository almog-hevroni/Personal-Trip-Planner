import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function useApi() {
  const { token, logout } = useAuth();
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL || "/api",
    });

    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );

    return instance;
  }, [token, logout]); // Re-create only when token or logout changes

  return api;
}