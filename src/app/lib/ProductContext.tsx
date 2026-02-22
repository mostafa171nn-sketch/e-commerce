'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  brand?: {
    _id: string;
    name?: string;
  };
  category?: {
    _id: string;
    name?: string;
  } | string;
}



interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

const localProductsData = [
  {
    id: 1,
    title: 'Wireless Headphones',
    price: 199.99,
    imageCover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    ratingsAverage: 4.5,
    brand: { _id: 'brand1' },
    categoryName: 'Music'
  },
  {
    id: 4,
    title: 'Portable Speaker',
    price: 149.99,
    imageCover: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    ratingsAverage: 4.4,
    brand: { _id: 'brand2' },
    categoryName: 'Music'
  },
  {
    id: 5,
    title: 'Digital Piano',
    price: 599.99,
    imageCover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500',
    ratingsAverage: 4.7,
    categoryName: 'Music'
  },
  {
    id: 6,
    title: 'Guitar Amplifier',
    price: 249.99,
    imageCover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
    ratingsAverage: 4.4,
    categoryName: 'Music'
  },
  {
    id: 8,
    title: 'Studio Microphone',
    price: 149.99,
    imageCover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
    ratingsAverage: 4.6,
    brand: { _id: 'brand5' },
    categoryName: 'Music'
  },
  {
    id: 9,
    title: 'Smartphone',
    price: 699.99,
    imageCover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    ratingsAverage: 4.8,
    brand: { _id: 'brand6' },
    categoryName: 'Mobiles'
  },

  {
    id: 10,
    title: 'Laptop',
    price: 1299.99,
    imageCover: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
    ratingsAverage: 4.6,
    brand: { _id: 'brand7' },
    categoryName: 'Electronics'
  },
  {
    id: 17,
    title: 'iPhone 14',
    price: 999.99,
    imageCover: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    ratingsAverage: 4.9,
    categoryName: 'Mobiles'
  },

  {
    id: 18,
    title: 'Samsung Galaxy S23',
    price: 899.99,
    imageCover: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    ratingsAverage: 4.7,
    categoryName: 'Mobiles'
  },

  {
    id: 11,
    title: 'Programming Book',
    price: 49.99,
    imageCover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
    ratingsAverage: 4.5,
    categoryName: 'Books'
  },
  {
    id: 12,
    title: 'Fiction Novel',
    price: 19.99,
    imageCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    ratingsAverage: 4.3,
    categoryName: 'Books'
  }
];



export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let categoryMap: Record<string, string> = {};
      try {
        const categoriesResponse = await fetch('https://ecommerce.routemisr.com/api/v1/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categories = categoriesData.data || [];
          categories.forEach((cat: any) => {
            categoryMap[cat.name] = cat._id;
            categoryMap[cat.name.toLowerCase()] = cat._id;
          });
          console.log('Category map:', categoryMap);
        }
      } catch (catErr) {
        console.warn('Categories fetch failed:', catErr);
      }

      let apiProducts: Product[] = [];
      try {
        const productResponse = await fetch('https://ecommerce.routemisr.com/api/v1/products');
        if (productResponse.ok) {
          const productData = await productResponse.json();
          apiProducts = (productData.data || []).map((p: any) => ({
            ...p,
            category: typeof p.category === 'string' 
              ? { _id: p.category, name: '' }
              : p.category
          }));
        }
      } catch (prodErr) {
        console.warn('Product fetch failed, using local only:', prodErr);
      }

      const mappedLocalProducts: Product[] = localProductsData.map(p => ({
        ...p,
        category: p.categoryName && categoryMap[p.categoryName] 
          ? { _id: categoryMap[p.categoryName], name: p.categoryName }
          : undefined
      }));

      const allProducts = [...apiProducts, ...mappedLocalProducts];
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {

      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    refetch,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
