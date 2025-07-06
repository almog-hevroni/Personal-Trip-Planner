import React from "react";
import "../../styles/components/button.css";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}) {
  const base = "btn";
  const style = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button type={type} className={`${base} ${style}`} onClick={onClick}>
      {children}
    </button>
  );
}
