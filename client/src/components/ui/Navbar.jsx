import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";

import "../../styles/components/navbar.css";
import Button from "./Button";

export default function Navbar() {
  const { token, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/", { replace: true }); // Navigate to the landing page
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="nav-link">
        Trip Planner
      </NavLink>
      <div className="nav-actions">
        {token ? (
          <Button variant="secondary" onClick={handleLogout}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <FiLogOut style={{ fontSize: "1.2rem", verticalAlign: "-2px" }} />
              <span>Logout</span>
            </span>
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
