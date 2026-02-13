'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import RelatedProducts from '../../components/RelatedProducts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  description: string;
  brand: {
    name: string;
  };
  images: string[];
}

const localProducts: { [key: string]: Product } = {
  '1': {
    id: 1,
    title: 'Wireless Headphones',
    price: 199.99,
    imageCover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    ratingsAverage: 4.5,
    description: 'High-quality wireless headphones with noise cancellation technology. Perfect for music lovers who want immersive audio experience. Features include Bluetooth 5.0 connectivity, 30-hour battery life, and comfortable over-ear design.',
    brand: { name: 'AudioTech' },
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']
  },
  '4': {
    id: 4,
    title: 'Portable Speaker',
    price: 149.99,
    imageCover: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    ratingsAverage: 4.4,
    description: 'Compact and powerful portable speaker with excellent sound quality. Waterproof design makes it perfect for outdoor activities. Features 360-degree sound, 12-hour battery life, and wireless connectivity.',
    brand: { name: 'SoundWave' },
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500']
  },
  '5': {
    id: 5,
    title: 'Digital Piano',
    price: 599.99,
    imageCover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500',
    ratingsAverage: 4.7,
    description: 'Professional digital piano with weighted keys and multiple sound options. Perfect for beginners and intermediate players. Includes built-in speakers, headphone jack, and USB connectivity for recording.',
    brand: { name: 'PianoMaster' },
    images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500']
  },
  '6': {
    id: 6,
    title: 'Guitar Amplifier',
    price: 249.99,
    imageCover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
    ratingsAverage: 4.4,
    description: 'Versatile guitar amplifier with multiple channels and effects. Ideal for electric guitar players of all skill levels. Features include reverb, delay, distortion, and clean channels with 50 watts of power.',
    brand: { name: 'AmpPro' },
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500']
  },
  '8': {
    id: 8,
    title: 'Studio Microphone',
    price: 149.99,
    imageCover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
    ratingsAverage: 4.6,
    description: 'Professional condenser microphone perfect for recording vocals, instruments, and podcasts. Includes shock mount, pop filter, and XLR cable. Features cardioid polar pattern and high sensitivity for clear audio capture.',
    brand: { name: 'StudioPro' },
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500']
  }
};

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Check if it's a local product first
        if (localProducts[id]) {
          setProduct(localProducts[id]);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Error: {error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left side: Large product image */}
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={product.imageCover}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side: Product details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-lg mr-1" />
                  <span className="text-lg text-gray-600">{product.ratingsAverage.toFixed(1)}</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Brand</h3>
                <p className="text-gray-600">{product.brand.name}</p>
              </div>

              <button className="w-full py-3 px-6 rounded-full font-semibold text-white relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:skew-x-[-20deg] hover:after:left-[100%] after:transition-all after:duration-500">
                <span className="relative z-10 drop-shadow-md">
                  Add to Cart
                </span>
              </button>

            </div>
          </div>
        </div>
      </main>

      <RelatedProducts />
    </div>
  );
}
