import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import AboutUs from './AboutUs';
import Products from './Products';
import FLogin from './FarmerLogin';
import BLogin from './BuyerLogin';
import { AuthProvider } from './AuthContext';

function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes available for both authenticated and unauthenticated users */}
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/FarmerLogin" element={<FLogin />} />

        {/* Route for BuyerLogin: shown only if not logged in */}
        <Route path="/BuyerLogin" element={<BLogin />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRouter;
