import React from 'react';
import './Modal.css';

const Modal = ({ content, onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div>{content}</div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
