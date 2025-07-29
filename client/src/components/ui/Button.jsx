import React from "react";
import "../../styles/components/button.css";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "", // ✅ קלט חדש
}) {
  const base = "btn";
  const style = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button
      type={type}
      className={`${base} ${style} ${className}`} // ✅ הוספנו את className החיצוני
      onClick={onClick}
    >
      {children}
    </button>
  );
}
