import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function useApi() {
  const { token, logout } = useAuth();

  // Memoize axios instance so we only recreate when token/logout changes
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL || "/api",
    });

    // Attach token header to each request if present
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // If any 401 comes back, automatically logout
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) logout();
        return Promise.reject(err);
      }
    );

    return instance;
  }, [token, logout]);

  return api;
}