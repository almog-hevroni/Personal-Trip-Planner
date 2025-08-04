import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const nav = useNavigate();
  // initialize from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  // If we get a token and are still on "/", redirect to dashboard
    useEffect(() => {
    if (token && window.location.pathname === "/") {
      nav("/dashboard", { replace: true });
    }
  }, [token]);

  // Log in: save to storage + state
  const login = (tkn, usr) => {
    localStorage.setItem("token", tkn);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
  };

  // Clear everything
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
