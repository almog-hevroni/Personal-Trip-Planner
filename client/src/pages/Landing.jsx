import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import styles from "../styles/pages/landing.module.css";

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
    <div className={styles.landingPage}>
      {/* כותרת באמצע אופקית, מתחת ל־Navbar */}
      <div className={styles.headingWrapper}>
        <h1 className="heading-xl">Trip Planner</h1>
      </div>

      {/* כפתורים מתחת לכותרת */}
      <div className={styles.buttonsWrapper}>
        <Button
          variant="primary"
          onClick={() => nav("/login")}
          style={{ maxWidth: "300px", width: "100%" }}
        >
          התחברות
        </Button>

        <Button
          variant="primary"
          onClick={() => nav("/register")}
          style={{
            maxWidth: "300px",
            width: "100%",
            background: "transparent",
            color: "var(--clr-primary)",
            border: "1px solid var(--clr-primary)",
          }}
        >
          יצירת משתמש
        </Button>

        <Button
          variant="secondary"
          onClick={() => nav("/planner")}
          style={{ maxWidth: "300px", width: "100%" }}
        >
          צור מסלול ללא התחברות
        </Button>
      </div>
    </div>
  );
}
