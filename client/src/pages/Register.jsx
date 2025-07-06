// client/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/utilities.css";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const api = useApi();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      window.alert("נרשמת בהצלחה!");
      nav("/login");
    } catch (err) {
      window.alert(err.response?.data?.message || "שגיאה ברישום");
    }
  };

  return (
    <div className="container mt-2" style={{ maxWidth: "400px" }}>
      <h1 className="heading-xl text-center mb-2">הרשמה</h1>
      <form onSubmit={handleSubmit}>
        <InputField label="שם מלא" value={name} onChange={setName} required />
        <InputField
          label="אימייל"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <InputField
          label="סיסמה"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <Button
          type="submit"
          variant="primary"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          הרשם
        </Button>
      </form>
    </div>
  );
}
