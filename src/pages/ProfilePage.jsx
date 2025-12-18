import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Tambah useNavigate
import { useAuth } from '../contexts/AuthContext';
import { orderAPI } from '../utils/api'; 

// Format tanggal
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // Hook untuk pindah halaman
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Order History dari Database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getUserOrders();
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil riwayat order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header Profile */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm border-b border-amber-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center text-3xl overflow-hidden border-4 border-white shadow-md">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-amber-700 font-bold text-3xl">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{user?.username || 'Guest User'}</h1>
            <p className="text-gray-500 text-sm">{user?.email || 'No email'}</p>
            
            {/* Badge Role */}
            <div className="mt-2 inline-flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
              <span className="text-amber-800 text-xs font-bold uppercase tracking-wider">
                {user?.role === 'admin' ? '👑 Owner / Admin' : '☕ Coffee Lover'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* TOMBOL KHUSUS ADMIN (Hanya muncul jika role = admin) */}
          {user?.role === 'admin' ? (
            <button 
              onClick={() => navigate('/admin')}
              className="bg-amber-900 p-3 rounded-xl border border-amber-800 text-left hover:bg-amber-800 transition shadow-lg relative overflow-hidden group"
            >
              <div className="absolute right-0 top-0 p-2 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z"/></svg>
              </div>
              <span className="block text-amber-200 text-xs mb-1 font-medium">Management</span>
              <span className="block text-lg font-bold text-white group-hover:translate-x-1 transition-transform">Admin Panel &rarr;</span>
            </button>
          ) : (
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
              <span className="block text-gray-400 text-xs mb-1">Total Orders</span>
              <span className="block text-xl font-bold text-amber-800">{orders.length}</span>
            </div>
          )}

          <button onClick={handleLogout} className="bg-red-50 p-3 rounded-xl border border-red-100 text-left hover:bg-red-100 transition group">
            <span className="block text-red-400 text-xs mb-1 group-hover:text-red-500">Session</span>
            <span className="block text-xl font-bold text-red-600">Logout</span>
          </button>
        </div>
      </div>

      {/* Order History Section */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
             <div className="animate-spin h-8 w-8 border-4 border-amber-600 rounded-full border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Belum ada pesanan</p>
            <Link to="/menu" className="text-amber-700 font-bold hover:underline">Pesan Kopi Sekarang</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      #{order.id.toString().slice(0, 8)}...
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                {/* List item ringkas */}
                <div className="border-t border-gray-50 my-3 pt-3">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700 mb-1">
                      <span><span className="font-bold">{item.qty}x</span> {item.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total Bill</span>
                  <span className="text-lg font-bold text-amber-800">{formatRupiah(order.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catatan: BottomNav tidak perlu dipanggil di sini karena sudah ada di App.jsx secara global */}
    </div>
  );
};

export default ProfilePage;