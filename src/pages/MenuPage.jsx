import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api'; // Pastikan path ini benar
import { useCart } from '../contexts/CartContext'; // Gunakan Context yang sudah dibuat sebelumnya

// --- FORMAT RUPIAH ---
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// --- KOMPONEN IKON (TIDAK DIUBAH) ---
const HomeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M9 17H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 9V13" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 13H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CoffeeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M8 12H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 8V12H14V8" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CartIcon = ({ count = 0, active = false }) => (
  <div className="relative">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
      <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white shadow-md">
        {count > 9 ? '9+' : count}
      </div>
    )}
  </div>
);

const ProfileIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="9" r="3" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <path d="M14 14L17 17" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="2" fill="none" />
    <line x1="6" y1="6" x2="14" y2="14" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="14" x2="14" y2="6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const StarIcon = ({ filled = true }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke={filled ? "#F59E0B" : "#E5E7EB"} strokeWidth="1" fill="none" />
    <path d="M8 3L9.5 6L13 6.5L10.5 9L11 13L8 11L5 13L5.5 9L3 6.5L6.5 6L8 3Z" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#E5E7EB"} strokeWidth="0.5" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#92400E" strokeWidth="1" fill="none" />
    <path d="M6 6L8 8L10 10" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 10L8 8L10 6" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// --- MAIN COMPONENT ---
const MenuPage = () => {
  // Ambil data/fungsi dari Context
  const { cartItems, addToCart } = useCart();
  
  // State Lokal
  const [menuItems, setMenuItems] = useState([]); // Data produk dari API
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // State Toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kategori
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'tea', name: 'Tea' },
    { id: 'pastries', name: 'Pastries' },
    { id: 'special', name: 'Special' }
  ];

  // --- FETCH DATA DARI BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        
        if (response.data.success) {
          // Mapping data backend ke format UI
          const mappedProducts = response.data.products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price),
            image: p.image_url,
            description: p.description,
            // Field di bawah ini mungkin belum ada di DB, kita beri default biar UI tidak rusak
            rating: 4.8, 
            detailedDescription: p.description, 
            ingredients: ["Premium Ingredients", "Love"], 
            calories: 200, 
            size: "Regular"
          }));
          setMenuItems(mappedProducts);
        }
      } catch (error) {
        console.error("Gagal mengambil menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hitung total item cart untuk badge (menggunakan cartItems dari Context)
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fungsi Pencarian
  const searchItems = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return menuItems;
    
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter Logic
  const getFilteredItems = () => {
    let items = searchQuery ? searchItems(searchQuery) : menuItems;
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  // Modal Logic
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Cleanup effect untuk body scroll
  useEffect(() => {
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => { if (quantity > 1) setQuantity(prev => prev - 1); };

  // --- FUNGSI ADD TO CART (TERHUBUNG KE BACKEND) ---
  const handleAddToCart = async (product, qty) => {
    try {
      // Panggil fungsi dari CartContext (yang akan memanggil API)
      await addToCart(product, qty);

      // Tampilkan Toast Sukses
      setSuccessMessage(`${qty} ${product.name} ditambahkan! - ${formatRupiah(product.price * qty)}`);
      setShowSuccessToast(true);
      
      // Tutup modal jika terbuka
      if (isModalOpen) closeProductDetail();

      // Hilangkan toast setelah 3 detik
      setTimeout(() => setShowSuccessToast(false), 3000);

    } catch (error) {
      console.error("Gagal tambah ke cart", error);
      alert("Gagal menambahkan ke keranjang. Pastikan Anda sudah login.");
    }
  };

  // Modal Component
  const ProductDetailModal = () => {
    if (!selectedProduct || !isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeProductDetail} />
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto relative z-10" onClick={(e) => e.stopPropagation()}>
            {/* Header Image */}
            <div className="relative h-64 overflow-hidden">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <button onClick={closeProductDetail} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg">
                <CloseIcon />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <StarIcon filled={true} />
                <span className="font-bold text-base">{selectedProduct.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                    <span className="px-4 py-2 bg-amber-100 text-amber-800 font-medium rounded-full text-sm">
                      {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-amber-800">{formatRupiah(selectedProduct.price)}</span>
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-6">{selectedProduct.detailedDescription}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Quantity</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={decreaseQuantity} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quantity <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`} disabled={quantity <= 1}>
                      <span className="text-2xl font-bold">-</span>
                    </button>
                    <span className="text-4xl font-bold text-gray-900 min-w-[50px] inline-block text-center">{quantity}</span>
                    <button onClick={increaseQuantity} className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200">
                      <span className="text-2xl font-bold">+</span>
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-amber-800">{formatRupiah(selectedProduct.price * quantity)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button 
                onClick={() => handleAddToCart(selectedProduct, quantity)}
                className="w-full bg-amber-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-800 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <span className="text-xl">+</span>
                <span>Add to Cart - {formatRupiah(selectedProduct.price * quantity)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessToast = () => {
    if (!showSuccessToast) return null;
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[60] animate-fadeIn flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" fill="none" />
          <path d="M7 10L10 13L13 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-medium">{successMessage}</span>
      </div>
    );
  };

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-amber-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-600"></div>
        <p className="mt-4 text-amber-800 font-medium">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      <ProductDetailModal />
      <SuccessToast />

      {/* HEADER */}
      <header className="px-6 pt-8 pb-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4 md:mb-0">Menu</h1>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">{totalCartItems} items in cart</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2"><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search your favorite coffee..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:outline-none text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-6">
        {/* CATEGORIES */}
        <section className="mt-4">
          <div className="flex justify-center overflow-x-auto gap-2 pb-3 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  activeCategory === cat.id ? 'bg-amber-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-amber-50'
                }`}
              >
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT LIST */}
        <section className="mt-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : "Featured Drinks"}
            </h2>
            <span className={`font-medium ${filteredItems.length === 0 ? 'text-red-500' : 'text-amber-600'}`}>
              {filteredItems.length} found
            </span>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
               <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
               <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="bg-amber-700 text-white px-6 py-3 rounded-xl mt-4">
                 View All Items
               </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-amber-100">
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <StarIcon filled={true} />
                        <span className="font-bold text-sm">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="mb-4">
                        <span className="px-4 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-800">{formatRupiah(item.price)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openProductDetail(item)} className="text-amber-700 text-sm font-medium hover:text-amber-800 px-3 py-2 rounded-lg hover:bg-amber-50 flex items-center gap-2">
                            <span>Details</span><ChevronIcon />
                          </button>
                          <button onClick={() => handleAddToCart(item, 1)} className="bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-amber-800 active:scale-95 transition-all flex items-center gap-2">
                            <span className="text-lg">+</span><span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3 z-40">
        <div className="flex justify-center">
          <div className="flex justify-between w-full max-w-md px-6">
            <Link to="/home" className="flex flex-col items-center text-gray-500 hover:text-amber-700 flex-1 group">
              <div className="group-hover:scale-110 transition-transform"><HomeIcon /></div>
              <span className="text-xs font-medium mt-1">Home</span>
            </Link>
            
            <Link to="/menu" className="flex flex-col items-center text-amber-700 flex-1 group">
              <div className="group-hover:scale-110 transition-transform"><CoffeeIcon active={true} /></div>
              <span className="text-xs font-bold mt-1">Menu</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-amber-700 flex-1 group relative">
              <div className="group-hover:scale-110 transition-transform"><CartIcon active={false} count={totalCartItems} /></div>
              <span className="text-xs font-medium mt-1">Cart</span>
            </Link>
            
            <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-amber-700 flex-1 group">
              <div className="group-hover:scale-110 transition-transform"><ProfileIcon /></div>
              <span className="text-xs font-medium mt-1">Me</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

// --- STYLES HELPER ---
const styles = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
`;

export default function MenuPageWithStyles(props) {
  return (
    <>
      <style>{styles}</style>
      <MenuPage {...props} />
    </>
  );
}