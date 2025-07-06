// client/src/pages/Dashboard.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import "../styles/components/button.css";

import Button from "../components/ui/Button";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="container" style={{ maxWidth: "400px", padding: "2rem 0" }}>
      <h1 className="heading-xl mb-2">Hello {user?.name}</h1>

      <Button
        variant="primary"
        onClick={() => nav("/trips")}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        Trip History 
      </Button>

      <Button
        variant="secondary"
        onClick={() => nav("/planner")}
        style={{ width: "100%" }}
      >
        Create a New Trip 
      </Button>
    </div>
  );
}
