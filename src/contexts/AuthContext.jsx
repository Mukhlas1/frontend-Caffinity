import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Default loading HARUS true agar tidak langsung ditendang ke login
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Cek ke server apakah token masih valid & ambil data user terbaru
          const res = await authAPI.getProfile();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // Token tidak valid di mata server
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error("Gagal memulihkan sesi:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      // Apapun hasilnya (sukses/gagal), matikan loading
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login'; // Redirect paksa biar bersih
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
