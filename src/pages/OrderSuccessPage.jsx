import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  // Proteksi: Jika user langsung buka URL ini tanpa checkout, kembalikan ke home
  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {/* Animasi Centang Sukses */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Success!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your order. We are preparing your coffee now.
      </p>

      {/* Kartu Detail Order */}
      <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm border border-gray-100 shadow-sm mb-8 text-left">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono font-bold text-gray-900">{orderData.orderNumber}</span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estimated Delivery</span>
            <span className="font-medium text-amber-800">{orderData.estimatedDelivery}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-bold text-gray-900">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(orderData.orderSummary.total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="w-full max-w-sm space-y-3">
        <Link 
          to="/profile" 
          className="block w-full bg-amber-700 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-amber-800 transition"
        >
          Track My Order
        </Link>
        <Link 
          to="/home" 
          className="block w-full bg-white text-gray-600 py-3.5 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;