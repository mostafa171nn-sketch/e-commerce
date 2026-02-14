'use client';

import { useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../lib/ProductContext';

export default function BrandDetailPage() {
  const { id } = useParams();
  const { products, loading: productsLoading, error: productsError } = useProducts();

  const filteredProducts = products.filter(product => product.brand && product.brand._id === id);
  const brand = filteredProducts.length > 0 ? filteredProducts[0].brand : null;

  if (productsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {brand.name}
          </h1>
          <p className="text-xl text-gray-600">
            Products from {brand.name}
          </p>
        </section>

        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found for this brand.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
