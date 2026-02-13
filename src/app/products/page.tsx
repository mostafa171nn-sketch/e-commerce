'use client';

import { Suspense, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductCategoryFilter from '../components/ProductCategoryFilter';
import { ProductProvider } from '../lib/ProductContext';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
ب
        <ProductProvider>
          <section>
            <Suspense fallback={<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
              <ProductCategoryFilter onCategoryChange={setSelectedCategory} />
            </Suspense>
          </section>

          <section>
            <Suspense fallback={<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
              <ProductGrid categoryId={selectedCategory} />
            </Suspense>
          </section>
        </ProductProvider>

      </main>
    </div>
  );
}
