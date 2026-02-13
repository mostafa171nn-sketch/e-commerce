'use client';

import React, { useEffect, useState } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Shop by Category</h2>
      <div className="relative overflow-hidden py-4">
        <div className="flex animate-marquee space-x-6">
          {[...categories, ...categories].map((category, index) => (
            <div
              key={`${category._id}-${index}`}
              className="flex-shrink-0 overflow-hidden group  w-48 hover:scale-110 hover:shadow-xl hover:z-10 transition-all duration-300"
            >

                <div className="relative h-32 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/404.png'; 
                    }}
                  />
                </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Categories;
