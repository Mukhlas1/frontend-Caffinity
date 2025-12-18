import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api'; // Pastikan path ini benar sesuai struktur foldermu

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // PENTING: Default loading harus TRUE. 
  // Ini mencegah aplikasi langsung redirect ke login sebelum pengecekan selesai.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Coba ambil data profile terbaru dari server menggunakan token yg ada
          const res = await authAPI.getProfile();
          
          if (res.data.success) {
            // Token valid! Kembalikan user ke state
            setUser(res.data.user);
          } else {
            // Token tidak valid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error("Gagal memulihkan sesi:", error);
          // Jika server error atau token expired, hapus data lokal
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      // Selesai pengecekan, matikan loading
      setLoading(false);
    };

    initAuth();
  }, []);

  // Fungsi Login
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    // Kita simpan user juga untuk backup cepat
    localStorage.setItem('user', JSON.stringify(userData)); 
    setUser(userData);
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Optional: redirect ke login bisa dilakukan di komponen UI
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};