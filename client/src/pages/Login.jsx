import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

import styles from "../styles/pages/login.module.css";
import "../styles/utilities.css";

import LoginForm from "../components/ui/LoginForm";

export default function Login({ embedded = false, onSuccess }) {
  const { login } = useAuth();
  const nav = useNavigate();
  const api = useApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // On submit, authenticate and store token/user in context + localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      if (embedded && onSuccess) onSuccess();
      else nav("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className={embedded ? "" : styles.hero}>
      {!embedded && <div className={styles.overlay} />}
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
