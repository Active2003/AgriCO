import React, { useContext } from 'react';
import {useState} from 'react';
import { Link } from 'react-router-dom';
import logo from './Logo/Logo.png';
import { AuthContext } from './AuthContext';
import Modal from './Modal'; // Import the Modal component

function Header() {
  const { isLoggedIn, logout, user } = useContext(AuthContext); // Include 'user' from context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    console.log('Modal opened');
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    console.log('Modal closed');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-md bg-body-tertiary " data-bs-theme="dark">
        <div className="container justify-content-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src={logo} alt="Logo" className="navbar-logo" /> AgriCO
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav container justify-content-center">
              <li className="nav-item">
                <Link className="nav-link px-4 py-2" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-4 py-2" to="/AboutUs">
                  AboutUs
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-4 py-2" to="/Products">
                  Products
                </Link>
              </li>
              {/* ... (existing navigation items) */}
              {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link className="nav-link px-4 py-2" onClick={openModal}>
                Account
              </Link>
              {isModalOpen && <Modal closeModal={closeModal} user={user} />}
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link px-4 py-2" onClick={logout}>
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link px-4 py-2" to="/BuyerLogin" aria-disabled="true">
                Buyer Section
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-4 py-2" to="/FarmerLogin" aria-disabled="true">
                Farmer Section
              </Link>
            </li>
          </>
        )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Add other header content, like a logo or navigation */}
    </header>
  );
}

export default Header;
