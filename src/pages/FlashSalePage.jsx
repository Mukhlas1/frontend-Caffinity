// src/pages/FlashSalePage.jsx
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const FlashSalePage = ({ openChat }) => {
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 23,
    seconds: 45
  });

  const flashSaleItems = [
    { id: 1, name: 'Caramel Macchiato', originalPrice: 5.99, salePrice: 2.99, stock: 15, sold: 85 },
    { id: 2, name: 'Espresso Double', originalPrice: 4.99, salePrice: 2.49, stock: 8, sold: 92 },
    { id: 3, name: 'Cappuccino Large', originalPrice: 6.49, salePrice: 3.25, stock: 12, sold: 88 },
    { id: 4, name: 'Croissant Combo', originalPrice: 8.99, salePrice: 4.49, stock: 5, sold: 95 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Link to="/home" className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Flash Sale</h1>
          <button onClick={openChat} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none"/>
              <path d="M8 10H16M8 14H12M8 18H14" stroke="#92400E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Timer */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-4 text-white text-center mb-6">
          <p className="text-sm mb-2">Sale ends in:</p>
          <div className="flex justify-center gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs mt-1">Hours</span>
            </div>
            <span className="text-2xl font-bold self-center">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs mt-1">Minutes</span>
            </div>
            <span className="text-2xl font-bold self-center">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xs mt-1">Seconds</span>
            </div>
          </div>
        </div>
      </header>

      {/* Flash Sale Items */}
      <main className="px-6">
        <div className="grid grid-cols-1 gap-4">
          {flashSaleItems.map(item => {
            const percentageSold = Math.round((item.sold / (item.sold + item.stock)) * 100);
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg border border-red-100">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center flex-shrink-0 relative">
                    <span className="text-4xl">🔥</span>
                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round((1 - item.salePrice/item.originalPrice) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl font-bold text-red-600">${item.salePrice.toFixed(2)}</span>
                          <span className="text-gray-400 line-through text-sm">${item.originalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Sold: {item.sold}</span>
                        <span>Stock: {item.stock} left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                          style={{ width: `${percentageSold}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {percentageSold}% sold out
                      </p>
                    </div>
                    
                    <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FlashSalePage;