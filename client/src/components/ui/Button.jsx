import "../../styles/components/button.css";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}) {
  const base = "btn";
  const style = variant === "primary" ? "btn-primary" : "btn-secondary";
  return (
    <button
      type={type}
      className={`${base} ${style} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
