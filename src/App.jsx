import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Import Components
import BottomNav from './components/BottomNav';

// Import Pages
import Login from './pages/Login'; 
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import FlashSalePage from './pages/FlashSalePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage'; // <-- PENTING: Import halaman Admin

import './App.css';

// Komponen Layout Khusus untuk halaman yang butuh Login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>
    );
  }

  // Jika tidak ada user, tendang ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {children}
      {/* BottomNav disembunyikan di halaman checkout, success, admin, dan flash-sale agar fokus */}
      {!window.location.pathname.includes('/checkout') && 
       !window.location.pathname.includes('/order-success') && 
       !window.location.pathname.includes('/admin') && ( // Hide nav di admin
        <BottomNav />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Toaster untuk notifikasi popup */}
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes (User Login) */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
            <Route path="/flash-sale" element={<ProtectedRoute><FlashSalePage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            {/* --- ROUTE ADMIN (BARU DIGABUNGKAN) --- */}
            {/* Bisa diakses lewat http://localhost:5173/admin */}
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            
            {/* Catch all - redirect ke home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;