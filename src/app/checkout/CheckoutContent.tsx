'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCreditCard, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../lib/CartContext';
import { useOrders } from '../lib/OrdersContext';
import { useAuth } from '../lib/AuthContext';

export default function CheckoutContent() {
  const { cart, totalPrice, clearCart } = useCart();
  const { addOrder, addCartActivity } = useOrders();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: '',
    phone: user?.phone || '',
    country: '',
    city: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const countries = [
    { name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'Tanta', 'Asyut'] },
    { name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Buraydah', 'Khamis Mushait', 'Al Khobar'] },
    { name: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain', 'Khor Fakkan', 'Dibba Al-Fujairah'] },
    { name: 'Jordan', cities: ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Al Quwaysimah', 'Wadi Al Seer', 'Tafilah', 'Madaba', 'Sahab', 'Jerash'] },
    { name: 'Lebanon', cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Byblos', 'Jounieh', 'Zahle', 'Baalbek', 'Batroun', 'Aley'] },
  ];

  const selectedCountry = countries.find(c => c.name === formData.country);
  const cities = selectedCountry ? selectedCountry.cities : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {

      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProcessing(true);

    try {
     
      const orderData = {
        items: cart,
        totalPrice,
        status: 'pending' as const,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
        },
        paymentMethod,
      };

      addOrder(orderData);

      addCartActivity({
        productId: cart[0]?.id || 0,
        action: 'ordered',
        quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      });

     
      clearCart();

      setOrderPlaced(true);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-black mb-4">Your cart is empty</h1>
            <p className="text-black mb-8">Add some products before checking out!</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-black text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-black mb-4">Order Placed Successfully!</h1>
            <p className="text-black mb-8">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="space-x-4">
              <Link
                href="/profile"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-black hover:text-black mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-green-600">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
              
                {showCountryDropdown && (
                  <div className="mt-2 border border-gray-300 rounded-md bg-white shadow-lg max-h-40 overflow-y-auto">
                    {countries.map((country) => (
                      <div
                        key={country.name}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, country: country.name, city: '' }));
                          setShowCountryDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-black/70"
                      >
                        {country.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black mb-1">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-black mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-black mb-1">
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.country}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium text-black mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => {
                        setPaymentMethod('cash');
                        setShowCardDetails(false);
                      }}
                      className="mr-3"
                    />
                    <FontAwesomeIcon icon={faMoneyBill} className="text-green-600 mr-2" />
                    <span className="text-black">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="visa"
                      checked={paymentMethod === 'visa'}
                      onChange={() => {
                        setPaymentMethod('visa');
                        setShowCardDetails(true);
                      }}
                      className="mr-3"
                    />
                    <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 mr-2" />
                    <span className="text-black/70">Credit/Debit Card (Visa)</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'visa' && showCardDetails && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-md font-medium text-black mb-4">Card Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-black mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required={paymentMethod === 'visa'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-black mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required={paymentMethod === 'visa'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-black mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required={paymentMethod === 'visa'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-black/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Place Order - ${totalPrice.toFixed(0)} EGP`}

              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 text-black">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.imageCover}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-black/70">{item.title}</h3>
                    <p className="text-sm text-black/70">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-black/70">
                    {(item.price * item.quantity).toFixed(0)} EGP

                  </p>

                </div>
              ))}
            </div>
            {/* Payment Details */}
            {paymentMethod === 'visa' && formData.cardNumber && (
              <div className="border-t border-gray-300 mt-6 pt-4">
                <h3 className="text-lg font-medium text-black mb-4">Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Card Number:</span>
                    <span className="text-sm font-medium text-black">**** **** **** {formData.cardNumber.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Expiry Date:</span>
                    <span className="text-sm font-medium text-black">{formData.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-black">Payment Method:</span>
                    <span className="text-sm font-medium text-black">Credit/Debit Card (Visa)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-300 mt-6 pt-4">
              <div className="flex justify-between text-lg font-semibold text-black">
                <span>Total:</span>
                <span>{totalPrice.toFixed(0)} EGP</span>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
