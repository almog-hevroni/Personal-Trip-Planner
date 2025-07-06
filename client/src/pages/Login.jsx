import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";
import styles from "../styles/pages/login.module.css"; // CSS Module

import LoginForm from "../components/ui/LoginForm";

export default function Login() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const api = useApi();

  // אם כבר מחובר, מפנים אוטומטית לדאשבורד
  useEffect(() => {
    if (token) {
      nav("/dashboard", { replace: true });
    }
  }, [token, nav]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      nav("/dashboard");
    } catch (err) {
      window.alert(err.response?.data?.message || "שגיאת התחברות");
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* כותרת קטנה יותר עם מרווח למעלה */}
      <h1 className={styles.heading}>התחברות</h1>

      {/* עוטף את הטופס כדי לדחוף אותו למטה */}
      <div className={styles.formWrapper}>
        <LoginForm
          email={email}
          onEmailChange={setEmail}
          password={password}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
