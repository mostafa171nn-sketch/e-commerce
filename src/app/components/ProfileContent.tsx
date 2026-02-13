'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useOrders } from '../lib/OrdersContext';
import LoadingSpinner from './LoadingSpinner';


export default function ProfileContent() {
  const { user, logout, token, loading, isAuthenticated } = useAuth();
  const { orders } = useOrders();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!isAuthenticated || !user) {
    return <div className="text-center py-8">Redirecting to login...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium text-lg ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 font-medium text-lg ${
            activeTab === 'activity'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Activity
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{user.name || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <p className="mt-1 text-gray-900">{user.id ? user.id.slice(0,8) : 'Not available'}</p>
          </div>
         
          <div className="flex gap-4 mt-6">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold">Order #{order.id}</h4>
                    <span className={`px-2 py-1 text-sm rounded ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mb-2">
                    <h5 className="font-medium mb-1">Items:</h5>
                    <ul className="list-disc list-inside text-sm">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.title} - Quantity: {item.quantity} - Price: ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-semibold">Total: ${order.totalPrice}</p>
                  {order.shippingAddress && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Shipping to: {order.shippingAddress.name}</p>
                      <p>Address: {order.shippingAddress.address}</p>
                      <p>Phone: {order.shippingAddress.phone}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
