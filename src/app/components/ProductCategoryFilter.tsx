'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '../lib/ProductContext';

interface Category {
  _id: string;
  name: string;
}

interface Product {
  category?: {
    _id: string;
    name?: string;
  } | string;
}

interface ProductCategoryFilterProps {
  onCategoryChange?: (categoryId: string) => void;
}

export default function ProductCategoryFilter({ onCategoryChange }: ProductCategoryFilterProps) {
  const { products } = useProducts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  const getCategoryId = (product: Product): string | undefined => {
    if (!product.category) return undefined;
    if (typeof product.category === 'string') return product.category;
    return product.category._id;
  };

  if (loading) {





    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-3xl font-semibold text-gray-900 mb-4 text-center">Filter <span className="text-green-600">by</span> Category</h3>
      
      <div className="flex md:hidden justify-center mb-8">
        <div className="relative min-w-[220px]">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="w-full appearance-none px-5 py-3 rounded-xl text-sm font-semibold bg-white text-gray-800 border-2 border-gray-200 focus:outline-none focus:border-green-300 focus:ring-4 focus:ring-blue-500/10 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"

          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>


      <div className="hidden md:flex flex-wrap gap-2 justify-center mb-8">

        <button
          onClick={() => handleCategoryClick('')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (

          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category._id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}


      </div>
    </div>
  );
}
