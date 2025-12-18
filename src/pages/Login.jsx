import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { authAPI } from '../utils/api'; 
import toast from 'react-hot-toast'; // Kita pakai toast biar lebih cantik

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LOGIKA UTAMA DI SINI ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLoginMode) {
        // --- REGISTER FLOW ---
        const res = await authAPI.register({
            username: formData.name,
            email: formData.email,
            password: formData.password
        });
        
        if (res.data.success) {
          toast.success('Registrasi berhasil! Silakan login.');
          setIsLoginMode(true);
          setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        }
      } else {
        // --- LOGIN FLOW ---
        const res = await authAPI.login({
            email: formData.email,
            password: formData.password
        });

        if (res.data.success) {
            const { token, user } = res.data;
            
            // 1. Simpan data login ke Context
            login(user, token);
            
            toast.success(`Welcome back, ${user.username || user.name}!`);

            // 2. CEK ROLE UNTUK REDIRECT
            // Jika Admin -> ke Dashboard Admin
            // Jika User -> ke Home
            if (user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }

        } else {
            toast.error(res.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.error || error.response?.data?.message || 'Network error';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-100 mb-2">Caffinity ☕</h2>
          <p className="text-amber-200/80">
            {isLoginMode ? 'Welcome back! Please sign in.' : 'Join us for the best coffee in town.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Tab Switcher */}
          <div className="flex mb-8 border-b border-gray-200">
            <button onClick={() => setIsLoginMode(true)} className={`flex-1 py-3 font-bold text-lg transition-colors ${isLoginMode ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-400'}`}>Sign In</button>
            <button onClick={() => setIsLoginMode(false)} className={`flex-1 py-3 font-bold text-lg transition-colors ${!isLoginMode ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-400'}`}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-1 font-medium text-sm">Username</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-primary w-full p-3 border rounded-xl" placeholder="John Doe" required />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-primary w-full p-3 border rounded-xl" placeholder="your@email.com" required />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium text-sm">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="input-primary w-full p-3 border rounded-xl pr-10" placeholder="••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-1 font-medium text-sm">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="input-primary w-full p-3 border rounded-xl" placeholder="••••••" required />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 mt-4">
              {isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;