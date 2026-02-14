'use client';
import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../lib/ProductContext';

interface Product {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  category?: {
    _id: string;
    name?: string;
  } | string;
}


interface ProductGridProps {
  categoryId?: string;
}

const ProductGrid = React.memo(function ProductGrid({ categoryId }: ProductGridProps) {
  const { products, loading, error } = useProducts();

  const getCategoryId = (product: Product): string | undefined => {
    if (!product.category) return undefined;
    if (typeof product.category === 'string') return product.category;
    return product.category._id;
  };

  const filteredProducts = categoryId
    ? products.filter(product => getCategoryId(product) === categoryId)
    : products;





  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 auto-rows-fr">

        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );



});

export default ProductGrid;
