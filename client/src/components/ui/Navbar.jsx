import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import "../../styles/components/navbar.css";
import Button from "./Button";

export default function Navbar() {
  const { token, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/", { replace: true }); // 👈 שולח לדף הנחיתה
  };

  return (
    <nav className="navbar">
      {/* צד שמאל – לוגו/כותרת */}
      <NavLink to="/" className="nav-link">
        Trip Planner
      </NavLink>

      {/* צד ימין – כפתורי auth */}
      <div className="nav-actions">
        {token ? (
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
