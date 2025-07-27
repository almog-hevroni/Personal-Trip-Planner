import React from "react";
import "../../styles/components/modal.css"; // רק side effect

export default function Modal({ children, onClose }) {
  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // למנוע סגירה בלחיצה פנימית
      >
        <button className="close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
