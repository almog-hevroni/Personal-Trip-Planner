import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

import styles from "../styles/pages/register.module.css";
import "../styles/utilities.css";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function Register({ embedded = false, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const nav = useNavigate();
// Handle form submit -> backend registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Registered successfully!");
      if (embedded && onSuccess) onSuccess();
      else nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className={embedded ? "" : styles.hero}>
      {!embedded && <div className={styles.overlay} />}
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Join us and start planning your next adventure
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Full Name"
            value={name}
            onChange={setName}
            required
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />
          <Button type="submit" variant="primary" className={styles.submit}>
            Register
          </Button>
        </form>
      </div>
    </div>
  );
}
