'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faBox, faTags, faHome } from '@fortawesome/free-solid-svg-icons';
import { useProducts } from '../lib/ProductContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'brand' | 'category' | 'page';
  href: string;
  image?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { products } = useProducts();

  const staticItems: SearchResult[] = [
    { id: 'home', title: 'Home', type: 'page', href: '/' },
    { id: 'products', title: 'Products', type: 'page', href: '/products' },
    { id: 'brands', title: 'Brands', type: 'page', href: '/brands' },
    { id: 'wishlist', title: 'Wishlist', type: 'page', href: '/wishlist' },
    { id: 'cart', title: 'Shopping Cart', type: 'page', href: '/cart' },
    { id: 'profile', title: 'Profile', type: 'page', href: '/profile' },
    { id: 'login', title: 'Login', type: 'page', href: '/login' },
    { id: 'signup', title: 'Sign Up', type: 'page', href: '/signup' },
    { id: 'brand-apple', title: 'Apple', type: 'brand', href: '/brands/apple' },
    { id: 'brand-samsung', title: 'Samsung', type: 'brand', href: '/brands/samsung' },
    { id: 'brand-nike', title: 'Nike', type: 'brand', href: '/brands/nike' },
    { id: 'brand-adidas', title: 'Adidas', type: 'brand', href: '/brands/adidas' },
    { id: 'brand-sony', title: 'Sony', type: 'brand', href: '/brands/sony' },
    { id: 'cat-electronics', title: 'Electronics', type: 'category', href: '/products?category=electronics' },
    { id: 'cat-fashion', title: 'Fashion', type: 'category', href: '/products?category=fashion' },
    { id: 'cat-music', title: 'Music', type: 'category', href: '/products?category=music' },
    { id: 'cat-mobiles', title: 'Mobiles', type: 'category', href: '/products?category=mobiles' },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const allResults: SearchResult[] = [];

    products.forEach((product) => {
      if (product.title.toLowerCase().includes(searchTerm)) {
        allResults.push({
          id: `product-${product.id}`,
          title: product.title,
          type: 'product',
          href: `/products/${product.id}`,
          image: product.imageCover,
        });
      }
    });

    staticItems.forEach((item) => {
      if (item.title.toLowerCase().includes(searchTerm)) {
        allResults.push(item);
      }
    });

    setResults(allResults.slice(0, 10));
  }, [query, products]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return faBox;
      case 'brand':
        return faTags;
      case 'category':
        return faTags;
      default:
        return faHome;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Product';
      case 'brand':
        return 'Brand';
      case 'category':
        return 'Category';
      case 'page':
        return 'Page';
      default:
        return 'Item';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b border-gray-200 p-4">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-lg mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, brands, categories..."
              className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={onClose}
              className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 && query.trim() && (
              <div className="p-8 text-center text-gray-500">
                <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3 text-gray-300" />
                <p>No results found for "{query}"</p>
              </div>
            )}

            {results.length === 0 && !query.trim() && (
              <div className="p-6 text-gray-500">
                <p className="text-sm font-medium mb-3 text-gray-400 uppercase tracking-wider">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['iPhone', 'Samsung', 'Nike', 'Laptop', 'Headphones'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.map((result, index) => (
              <Link
                key={result.id}
                href={result.href}
                onClick={onClose}
                className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
              >
                {result.image ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <FontAwesomeIcon
                      icon={getIcon(result.type)}
                      className="text-blue-500 text-lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{getTypeLabel(result.type)}</p>
                </div>
                <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-sm" />
              </Link>
            ))}
          </div>

          {results.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Press ESC to close • Click result to navigate
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
