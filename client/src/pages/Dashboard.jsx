import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

import styles from "../styles/pages/dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome, {user?.name}!</h1>
      <div className={styles.card}>
        <div className={styles.buttons}>
          <Button
            variant="primary"
            onClick={() => nav("/trips")}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            View Trip History
          </Button>
          <Button
            variant="secondary"
            onClick={() => nav("/planner")}
            style={{ width: "100%" }}
          >
            Create New Trip
          </Button>
        </div>
      </div>
    </div>
  );
}