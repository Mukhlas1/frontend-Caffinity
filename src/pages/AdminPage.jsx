import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productAPI, orderAPI, dashboardAPI } from '../utils/api';
import toast from 'react-hot-toast'; 

// Format Rupiah
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- STATE DASHBOARD ---
  const [stats, setStats] = useState({ income: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  
  // --- STATE PRODUCTS ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'coffee', price: '', description: '', image_url: '' });
  
  // Control Form Visibility
  const [showAddForm, setShowAddForm] = useState(false);

  // --- STATE ORDERS ---
  const [orders, setOrders] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchDashboardStats();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const res = await dashboardAPI.getStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      }
    } catch (error) {
      console.error("Gagal load stats", error);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await productAPI.getAll();
      if (res.data.success) setProducts(res.data.products);
    } catch (err) { toast.error("Gagal load produk"); } 
    finally { setLoadingProducts(false); }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAllOrders();
      if (res.data.success) setOrders(res.data.data);
    } catch (err) { toast.error("Gagal load order"); } 
  };

  // --- HANDLERS ---
  const handleLogout = () => {
    if (window.confirm("Keluar dari Admin Dashboard?")) {
      logout();
      navigate('/login');
      toast.success("Berhasil logout!");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) { 
        await productAPI.update(editId, formData); 
        toast.success("Produk diupdate!"); 
      } else { 
        await productAPI.create(formData); 
        toast.success("Produk ditambah!"); 
      }
      setFormData({ name: '', category: 'coffee', price: '', description: '', image_url: '' });
      setIsEditing(false);
      setShowAddForm(false);
      fetchProducts(); 
      fetchDashboardStats();
    } catch (error) { toast.error("Gagal simpan"); }
  };
  
  const handleEditProduct = (p) => { 
    setIsEditing(true); 
    setEditId(p.id); 
    setFormData({...p}); 
    setShowAddForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => { 
    if(window.confirm("Hapus produk ini?")) { 
      await productAPI.delete(id); 
      fetchProducts(); 
      fetchDashboardStats(); 
      toast.success("Produk dihapus");
    }
  };

  const handleUpdateStatus = async (id, status) => { 
    await orderAPI.updateStatus(id, status); 
    fetchOrders(); 
    fetchDashboardStats(); 
    toast.success("Status update"); 
  };

  const handleCancelForm = () => {
    setIsEditing(false);
    setFormData({ name: '', category: 'coffee', price: '', description: '', image_url: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-amber-900 text-white p-6 shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Admin Dashboard 🛠️
            </h1>
            <p className="text-amber-200 text-sm">Welcome back, Boss!</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* TAB SWITCHER */}
            <div className="flex bg-amber-800 rounded-lg p-1 gap-1">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'dashboard' ? 'bg-white text-amber-900 shadow' : 'text-amber-200 hover:bg-amber-700'}`}>📊 Stats</button>
              <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'products' ? 'bg-white text-amber-900 shadow' : 'text-amber-200 hover:bg-amber-700'}`}>☕ Products</button>
              <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'orders' ? 'bg-white text-amber-900 shadow' : 'text-amber-200 hover:bg-amber-700'}`}>📦 Orders</button>
            </div>

            {/* TOMBOL LOGOUT */}
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition shadow-md flex items-center gap-2 px-4 font-bold text-sm"
              title="Logout"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* ================= TAB DASHBOARD STATS ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Income */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">💰</div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(stats.income)}</h3>
                </div>
              </div>
              {/* Orders */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">📦</div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
                </div>
              </div>
              {/* Users */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">👥</div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Customers</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
                </div>
              </div>
               {/* Products */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl">☕</div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Menu</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
                </div>
              </div>
            </div>

            {/* TABEL 5 ORDER TERBARU */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-800">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        {/* PERBAIKAN: Tambah .toString() */}
                        <td className="px-6 py-4 font-mono font-medium">#{order.id.toString().slice(0,6)}</td>
                        <td className="px-6 py-4 font-medium">{order.username}</td>
                        <td className="px-6 py-4 text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 font-bold text-amber-800">{formatRupiah(order.total_amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB PRODUCTS ================= */}
        {activeTab === 'products' && (
           <div className="space-y-6">
             {/* Header & Add Button */}
             <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                <h2 className="text-lg font-bold text-gray-800">
                  {showAddForm 
                    ? (isEditing ? 'Edit Menu' : 'Tambah Menu Baru') 
                    : 'Daftar Menu'
                  }
                </h2>
                
                <button 
                  onClick={() => {
                    if(showAddForm) {
                      handleCancelForm();
                    } else {
                      setShowAddForm(true);
                      setIsEditing(false);
                      setFormData({ name: '', category: 'coffee', price: '', description: '', image_url: '' });
                    }
                  }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${
                    showAddForm 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-amber-700 text-white hover:bg-amber-800 shadow-md'
                  }`}
                >
                  {showAddForm ? '❌ Batal / Kembali' : '➕ Tambah Produk'}
                </button>
             </div>

             {/* Logic Form vs Grid */}
             {showAddForm ? (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Nama Produk</label>
                        <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Contoh: Caramel Macchiato" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required/>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Kategori</label>
                        <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                          <option value="coffee">Coffee</option>
                          <option value="tea">Tea</option>
                          <option value="pastries">Pastries</option>
                          <option value="special">Special</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-bold text-gray-700 block mb-1">Harga (IDR)</label>
                            <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" type="number" placeholder="25000" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required/>
                          </div>
                          <div>
                              <label className="text-sm font-bold text-gray-700 block mb-1">Gambar URL</label>
                              <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" placeholder="https://..." value={formData.image_url} onChange={e=>setFormData({...formData, image_url: e.target.value})}/>
                          </div>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Deskripsi</label>
                        <textarea className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" rows="3" placeholder="Deskripsi singkat produk..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}/>
                      </div>
                      <button type="submit" className="w-full bg-amber-700 text-white py-3 rounded-xl font-bold hover:bg-amber-800 shadow-lg transition transform active:scale-95">
                        {isEditing ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
                      </button>
                    </form>
                  </div>
                </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {loadingProducts ? (
                    <div className="col-span-full text-center py-10 text-gray-500">Loading menu items...</div>
                  ) : (
                    <>
                      <button 
                         onClick={() => { setShowAddForm(true); setIsEditing(false); setFormData({ name: '', category: 'coffee', price: '', description: '', image_url: '' }); }}
                         className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 transition min-h-[220px] group"
                      >
                         <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-amber-100 transition">
                            <span className="text-2xl font-light">+</span>
                         </div>
                         <span className="text-sm font-bold">Tambah Baru</span>
                      </button>

                      {products.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col group relative">
                          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                             {p.image_url ? (
                               <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">No Image</div>
                             )}
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition gap-2 backdrop-blur-[1px]">
                                <button onClick={() => handleEditProduct(p)} className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm transform hover:scale-110 transition" title="Edit">✏️</button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50 shadow-sm transform hover:scale-110 transition" title="Hapus">🗑️</button>
                             </div>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-800 text-sm line-clamp-1" title={p.name}>{p.name}</h3>
                            <p className="text-[10px] text-gray-500 capitalize mb-1 bg-gray-100 w-fit px-1.5 rounded">{p.category}</p>
                            <p className="font-bold text-amber-700 text-sm mt-auto">{formatRupiah(p.price)}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
             )}
           </div>
        )}

        {/* ================= TAB ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
             <div className="p-6 flex justify-between items-center border-b border-gray-100">
               <h2 className="text-xl font-bold text-gray-800">Orders List</h2>
               <button onClick={fetchOrders} className="text-sm font-bold text-amber-600 hover:underline">Refresh ⟳</button>
             </div>
             <div className="divide-y divide-gray-100">
               {orders.length === 0 ? (
                 <div className="p-8 text-center text-gray-500">No orders found.</div>
               ) : orders.map(order => (
                 <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                   <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                     <div>
                       <div className="flex items-center gap-2">
                         {/* PERBAIKAN: Tambah .toString() */}
                         <span className="font-mono font-bold text-gray-600">#{order.id.toString().slice(0,8)}</span> 
                         <span className="text-xs text-gray-400">• {formatDate(order.created_at)}</span>
                       </div>
                       <h3 className="font-bold text-lg text-gray-900 mt-1">{order.customer_name}</h3>
                       <p className="text-xs text-gray-500">{order.customer_email}</p>
                     </div>
                     <div>
                       <select 
                        value={order.status} 
                        onChange={(e)=>handleUpdateStatus(order.id, e.target.value)} 
                        className={`border p-2 rounded-lg text-sm font-bold outline-none cursor-pointer ${
                          order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                       >
                         <option value="pending">⏳ Pending</option>
                         <option value="processing">⚙️ Processing</option>
                         <option value="completed">✅ Completed</option>
                         <option value="cancelled">❌ Cancelled</option>
                       </select>
                     </div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="space-y-2 mb-3">
                       {order.items && order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-sm">
                           <span><span className="font-bold">{item.qty}x</span> {item.name}</span>
                           <span className="text-gray-600">{formatRupiah(item.price*item.qty)}</span>
                         </div>
                       ))}
                     </div>
                     <div className="border-t border-gray-200 mt-2 pt-3 flex justify-between items-center">
                       <span className="text-sm font-bold text-gray-500">Total Amount</span>
                       <span className="text-lg font-bold text-amber-800">{formatRupiah(order.total_amount)}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
