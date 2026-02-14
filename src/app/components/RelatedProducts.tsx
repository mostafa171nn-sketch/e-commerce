'use client';

import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../lib/ProductContext';

export default function RelatedProducts() {
  const { products, loading, error } = useProducts();

  const relatedProducts = useMemo(() => {
   
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    return shuffledProducts.slice(0, 10);
  }, [products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">

        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
