import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/pages/landing.module.css";
import "../styles/utilities.css";

import Button from "../components/ui/Button";

export default function Landing() {
  const { token } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (token) {
      nav("/dashboard", { replace: true });
    }
  }, [token, nav]);

  return (
    <div className={styles.hero}>
      <div className={styles.overlay} />
      <header className={styles.header}>
        <h1 className={styles.title}>Trip Planner</h1>
        <p className={styles.subtitle}>
          Craft your perfect adventure in seconds
        </p>
      </header>
      <div className={styles.ctaGroup}>
        <Button
          variant="primary"
          onClick={() => nav("/login")}
          className={styles.ctaButton}
        >
          Log In
        </Button>
        <Button
          variant="secondary"
          onClick={() => nav("/register")}
          className={styles.ctaButton}
        >
          Register
        </Button>
      </div>
    </div>
  );
}