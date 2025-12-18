import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Pakai Context

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const CartPage = () => {
  const navigate = useNavigate();
  // Ambil data dan fungsi dari Context (terhubung ke API)
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Hitung-hitungan duit
  const subtotal = getCartTotal(); // Hitung dari items yang ada
  const tax = subtotal * 0.11;     // PPN 11%
  const deliveryFee = 10000;       // Ongkir tetap

  // Logika Promo Sederhana
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'HEMAT50') {
      setAppliedPromo({
        code: 'HEMAT50',
        discountType: 'fixed',
        discountValue: 50000
      });
      setPromoError('');
    } else if (promoCode.toUpperCase() === 'DISKON10') {
      setAppliedPromo({
        code: 'DISKON10',
        discountType: 'percentage',
        discountValue: 10, // 10%
        maxDiscount: 20000
      });
      setPromoError('');
    } else {
      setPromoError('Kode promo tidak valid');
      setAppliedPromo(null);
    }
  };

  // Hitung Diskon
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'fixed') {
      promoDiscount = appliedPromo.discountValue;
    } else if (appliedPromo.discountType === 'percentage') {
      const discount = (subtotal * appliedPromo.discountValue) / 100;
      promoDiscount = appliedPromo.maxDiscount ? Math.min(discount, appliedPromo.maxDiscount) : discount;
    }
  }

  const total = subtotal + tax + deliveryFee - promoDiscount;

  // Handler Checkout
  const handleCheckout = () => {
    // Kirim data cart & promo ke halaman checkout
    navigate('/checkout', { 
      state: { 
        cartItems, 
        appliedPromo,
        orderSummary: {
          subtotal,
          tax,
          deliveryFee,
          promoDiscount,
          total
        }
      } 
    });
  };

  // --- TAMPILAN JIKA CART KOSONG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
           <h1 className="text-2xl md:text-3xl font-bold text-amber-900">My Cart</h1>
        </header>
        <main className="px-6 mt-12 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-8">Sepertinya Anda belum memesan kopi hari ini.</p>
          <Link to="/menu" className="bg-amber-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-800 transition shadow-lg">
            Mulai Pesan
          </Link>
        </main>
        {/* Navigasi Bawah Tetap Ada */}
        <BottomNav active="cart" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-32">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900">My Cart</h1>
        <span className="text-gray-500 text-sm">{cartItems.length} items</span>
      </header>

      <main className="px-6 mt-6">
        {/* List Item Cart */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex gap-4 transition-all hover:shadow-md">
              {/* Gambar Produk */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Detail Produk */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} // Hapus via API
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-amber-800">{formatRupiah(item.price)}</span>
                  
                  {/* Kontrol Kuantitas */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} // API Update -
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow-sm text-amber-700 disabled:opacity-50 hover:bg-amber-50"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} // API Update +
                      className="w-7 h-7 flex items-center justify-center bg-amber-700 text-white rounded-md shadow-sm hover:bg-amber-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Promo Code (ex: HEMAT50)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 bg-white"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button 
              onClick={handleApplyPromo}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-red-500 text-sm mt-2">{promoError}</p>}
          {appliedPromo && <p className="text-green-600 text-sm mt-2">Kode promo applied! {appliedPromo.code}</p>}
        </div>

        {/* Ringkasan Biaya */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-amber-100">
          <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>PPN (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(deliveryFee)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Diskon</span>
                <span>-{formatRupiah(promoDiscount)}</span>
              </div>
            )}
            <div className="border-t border-gray-100 my-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="font-bold text-xl text-amber-800">{formatRupiah(total)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full mt-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex justify-between px-6 items-center"
          >
            <span>Checkout</span>
            <span>{formatRupiah(total)} &rarr;</span>
          </button>
        </div>
      </main>

      <BottomNav active="cart" />
    </div>
  );
};

// Komponen Navigasi Bawah (Supaya Rapi & Reusable)
const BottomNav = ({ active }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3 z-40">
    <div className="flex justify-center">
      <div className="flex justify-between w-full max-w-md px-6">
        <Link to="/home" className={`flex flex-col items-center flex-1 group ${active === 'home' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-700'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === 'home' ? 2 : 1.5}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 17H15" strokeLinecap="round" />
            <path d="M12 9V13" strokeLinecap="round" />
            <path d="M9 13H15" strokeLinecap="round" />
          </svg>
          <span className={`text-xs mt-1 ${active === 'home' ? 'font-bold' : 'font-medium'}`}>Home</span>
        </Link>
        
        <Link to="/menu" className={`flex flex-col items-center flex-1 group ${active === 'menu' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-700'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === 'menu' ? 2 : 1.5}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12H16" strokeLinecap="round" />
            <path d="M10 8V12H14V8" strokeLinecap="round" />
            <path d="M8 16H16" strokeLinecap="round" />
          </svg>
          <span className={`text-xs mt-1 ${active === 'menu' ? 'font-bold' : 'font-medium'}`}>Menu</span>
        </Link>
        
        <Link to="/cart" className={`flex flex-col items-center flex-1 group ${active === 'cart' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-700'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === 'cart' ? 2 : 1.5}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 16H16" strokeLinecap="round" />
            <path d="M10 10V12" strokeLinecap="round" />
            <path d="M14 10V12" strokeLinecap="round" />
            <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" strokeLinejoin="round" />
          </svg>
          <span className={`text-xs mt-1 ${active === 'cart' ? 'font-bold' : 'font-medium'}`}>Cart</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center flex-1 group ${active === 'profile' ? 'text-amber-700' : 'text-gray-500 hover:text-amber-700'}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active === 'profile' ? 2 : 1.5}>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="9" r="3" />
            <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" strokeLinecap="round" />
          </svg>
          <span className={`text-xs mt-1 ${active === 'profile' ? 'font-bold' : 'font-medium'}`}>Me</span>
        </Link>
      </div>
    </div>
  </nav>
);

export default CartPage;