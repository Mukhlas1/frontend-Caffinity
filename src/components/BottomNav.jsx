import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Import Context

// --- ICONS (Sama seperti sebelumnya) ---
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const MenuIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
);
const CartIcon = ({ active, count }) => (
  <div className="relative">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </div>
);
const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const BottomNav = () => {
  const location = useLocation();
  const { cartItems } = useCart(); // Ambil data langsung dari sumbernya!

  // Hitung total item (misal: 2 kopi + 1 roti = 3 item)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home', path: '/home', icon: HomeIcon },
    { id: 'menu', label: 'Menu', path: '/menu', icon: MenuIcon },
    { id: 'cart', label: 'Cart', path: '/cart', icon: CartIcon, badge: cartCount },
    { id: 'profile', label: 'Me', path: '/profile', icon: ProfileIcon }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] py-2 z-50 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.id} 
              to={item.path} 
              className={`flex flex-col items-center p-2 transition-all duration-200 ${isActive ? 'scale-105' : 'hover:opacity-70'}`}
            >
              <Icon active={isActive} count={item.badge} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-amber-800' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;