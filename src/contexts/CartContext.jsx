import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Ambil status login user
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Cart dari Database saat User Login
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]); // Kosongkan jika logout
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      if (res.data.success) {
        // Format data dari DB agar sesuai dengan UI frontend
        // Backend return: { id, product_id, quantity, name, price, image_url }
        const formattedCart = res.data.data.map(item => ({
          id: item.id, // ID item di tabel cart (penting untuk delete)
          product_id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          image: item.image_url, // Pastikan nama field sesuai backend
          quantity: item.quantity,
          category: item.category
        }));
        setCartItems(formattedCart);
      }
    } catch (error) {
      console.error("Gagal mengambil keranjang:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Tambah Item ke Database
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      alert("Silakan login untuk berbelanja");
      return;
    }

    try {
      // Optimistic UI Update (Update tampilan dulu biar cepat)
      const existingItem = cartItems.find(item => item.product_id === product.id);
      if (existingItem) {
        setCartItems(prev => prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        ));
      } else {
        // Note: ID item cart belum ada karena belum response server, ini sementara
        setCartItems(prev => [...prev, { ...product, product_id: product.id, quantity }]);
      }

      // Kirim ke Backend
      await cartAPI.addToCart(product.id, quantity);
      
      // Refresh data asli dari server untuk memastikan sinkronisasi ID & Stok
      await fetchCart(); 
      
    } catch (error) {
      console.error("Gagal menambah ke cart:", error);
      alert("Gagal menambahkan item. Coba lagi.");
      fetchCart(); // Revert jika gagal
    }
  };

  // 3. Hapus Item dari Database
  const removeFromCart = async (cartItemId) => {
    try {
      // Optimistic Update
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      await cartAPI.removeFromCart(cartItemId);
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      fetchCart();
    }
  };

  // 4. Update Quantity (Opsional: Jika Anda membuat endpoint update qty terpisah)
  // Untuk sekarang, kita bisa gunakan logika: Add lagi = update qty
  const updateQuantity = async (cartItemId, newQuantity) => {
    // Fitur ini butuh endpoint khusus (PUT /cart/:id) di backend.
    // Jika belum ada, skip dulu atau gunakan logika remove + add
    console.log("Fitur update quantity spesifik belum diimplementasi di backend");
  };

  // 5. Kosongkan Cart (misal setelah checkout)
  const clearCart = async () => {
    setCartItems([]);
    try {
      await cartAPI.clearCart();
    } catch (error) {
      console.error("Gagal clear cart:", error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity, 
      getCartTotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};