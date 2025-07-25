// client/src/components/ui/LoginForm.jsx
import React from "react";
import FormGroup from "./FormGroup";
import Button from "./Button";

export default function LoginForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit}>
      <FormGroup label="Email" required>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup label="Password" required>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </FormGroup>

      <Button type="submit" variant="primary" style={{ width: "100%" }}>
        Log In
      </Button>
    </form>
  );
}
