import React from 'react';
import './Modal.css';

const Modal = ({ content, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{content}</p>
        <button className="close-modal-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
