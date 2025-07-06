import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/pages/login.module.css";
import "../styles/utilities.css";

import LoginForm from "../components/ui/LoginForm";

export default function Login() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const api = useApi();

  // Redirect if already logged in
  useEffect(() => {
    if (token) nav("/dashboard", { replace: true });
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
      window.alert(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Please log in to continue</p>
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