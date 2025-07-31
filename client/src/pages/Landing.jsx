import { useState } from "react";
import styles from "../styles/pages/landing.module.css";
import "../styles/utilities.css";

import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Login from "./Login";
import Register from "./Register";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
          onClick={() => setShowLogin(true)}
          className={styles.ctaButton}
        >
          Log In
        </Button>
        <Button
          variant="secondary"
          onClick={() => setShowRegister(true)}
          className={styles.ctaButton}
        >
          Register
        </Button>
      </div>

      {/* מודל התחברות */}
      {showLogin && (
        <Modal onClose={() => setShowLogin(false)}>
          <Login embedded onSuccess={() => setShowLogin(false)} />
        </Modal>
      )}

      {/* מודל הרשמה */}
      {showRegister && (
        <Modal onClose={() => setShowRegister(false)}>
          <Register
            embedded
            onSuccess={() => {
              setShowRegister(false);
              setShowLogin(true); // אוטומטית פותח התחברות אחרי הרשמה
            }}
          />
        </Modal>
      )}
    </div>
  );
}
