import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const nav = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

    useEffect(() => {
    if (token && window.location.pathname === "/") {
      nav("/dashboard", { replace: true });
    }
  }, [token]);

  const login = (tkn, usr) => {
    localStorage.setItem("token", tkn);
    localStorage.setItem("user", JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
  };
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
