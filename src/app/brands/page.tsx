'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedBrands = useMemo(() => brands, [brands]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands');
        const data = await response.json();
        if (response.ok) {
          setBrands(data.data || []);
        } else {
          setError(data.message || `Failed to fetch brands: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center text-black mb-8">Brands</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">

        {memoizedBrands.map((brand) => (
          <Link key={brand._id} href={`/brands/${brand._id}`}>
            <div className="text-black/50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-32 object-contain mb-4"
              />
              <h2 className="text-lg font-semibold text-center">{brand.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
