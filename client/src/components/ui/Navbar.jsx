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
    nav("/", { replace: true });
  };

  return (
    <nav className="navbar">
      {/* בצד שמאל */}
      <NavLink to="/" className="nav-link">
        Trip Planner
      </NavLink>

      {/* בצד ימין */}
      {token && (
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      )}
    </nav>
  );
}
