// Modal.js

import React from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ closeModal, user, logout }) => {
  const modalContentStyle = {
    width: '30%', // Adjust the width as needed
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff', // Background color for the modal
    zIndex: '1000', // Ensure the modal appears on top
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    color: '#000', // Text color
  };

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={modalContentStyle}>
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Account Details</h2>
        <div>
          {Object.keys(user).map((key) => (
            <p key={key}>
              {key}: {user[key]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
