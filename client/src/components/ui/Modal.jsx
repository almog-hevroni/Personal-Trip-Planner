import "../../styles/components/modal.css";

export default function Modal({ children, onClose }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // avoid closing when pressing inside
      >
        <button className="close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
