import "../../styles/components/form.css";

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div className={`form-group${required ? " required" : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
