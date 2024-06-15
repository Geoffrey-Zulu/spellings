import React from 'react';
import './Modal.css';

const Modal = ({ content, onClose, onCopy }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{content}</p>
        <button onClick={onClose} className="modal-close">Close</button>
        {onCopy && <button onClick={onCopy} className="modal-copy">Copy Text</button>}
      </div>
    </div>
  );
};

export default Modal;
