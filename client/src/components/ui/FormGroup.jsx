import "../../styles/components/form.css";

export default function FormGroup({ label, children, required = false }) {
  return (
    <div className={`form-group${required ? " required" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
