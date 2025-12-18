import axios from 'axios';

// KONFIGURASI API
// Kita arahkan langsung ke Backend Vercel agar bisa diakses online
const api = axios.create({
  baseURL: 'https://backend-caffinity.vercel.app/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Sisipkan Token JWT otomatis ke setiap request
// (Supaya user tidak perlu login berulang-ulang)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle jika Token Expired (401)
// (Jika sesi habis, otomatis logout dan kembali ke login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- DEFINISI API ---

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  
  // --- ADMIN: PRODUK ---
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (product_id, quantity) => api.post('/cart', { product_id, quantity }),
  removeFromCart: (id) => api.delete(`/cart/${id}`), 
  clearCart: () => api.delete('/cart'),
};

export const orderAPI = {
  // --- USER: ORDER ---
  createOrder: (orderData) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders'),
  
  // --- ADMIN: ORDER (PENTING UNTUK DASHBOARD ADMIN) ---
  getAllOrders: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
};

// --- ADMIN: DASHBOARD STATS (PENTING) ---
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
