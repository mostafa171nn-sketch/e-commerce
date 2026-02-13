'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../lib/CartContext';
import { useCartDrawer } from '../lib/CartDrawerContext';

export default function SideCartDrawer() {
  const { isCartOpen, closeCart, openCart } = useCartDrawer();
  const { cart, totalItems, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const drawerClasses = `fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
    isCartOpen ? 'translate-x-0' : 'translate-x-full'
  }`;

  return (
    <>

      {!isCartOpen && (
        <button
          onClick={openCart}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-70 transition-colors "
        >
          <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      )}

      <div className={drawerClasses}>
        <div className="flex flex-col h-full">
          
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Shopping Cart ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
            </button>
          </div>

          
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                    <img
                      src={item.imageCover}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">${item.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faMinus} className="text-xs text-red-600" />
                        </button>
                        <span className="text-sm font-medium text-black">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-xs text-green-600" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors block text-center"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors block text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
