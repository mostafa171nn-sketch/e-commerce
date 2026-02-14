import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../lib/CartContext';
import { useOrders } from '../lib/OrdersContext';
import { useWishlist } from '../lib/WishlistContext';


interface Product {
  id: number;
  title: string;
  price: number;
  priceBefore?: number;
  discount?: number;
  imageCover: string;
  ratingsAverage: number;
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
}

// Helper function to generate mock data for demo purposes
const getProductWithMockData = (product: Product): Product => {
  // Generate deterministic mock data based on product id
  const hasDiscount = product.id % 3 === 0; // Every 3rd product has discount
  const discountPercent = hasDiscount ? Math.floor((product.id % 5) + 10) * 5 : 0; // 10-30% discount
  
  const mockColors = [
    '#1a1a1a', // Black
    '#8B4513', // Brown
    '#D2691E', // Chocolate
    '#A52A2A', // Brown-red
    '#2F4F4F', // Dark slate
  ];
  
  // Select 2-4 colors based on product id
  const colorCount = 2 + (product.id % 3);
  const selectedColors = mockColors.slice(0, colorCount);
  
  return {
    ...product,
    priceBefore: hasDiscount ? Math.round(product.price * (1 + discountPercent / 100)) : undefined,
    discount: hasDiscount ? discountPercent : undefined,
    colors: selectedColors,
  };
};

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addCartActivity } = useOrders();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();


  // Enhance product with mock discount data for demonstration
  const enhancedProduct = getProductWithMockData(product);
  const { priceBefore, discount } = enhancedProduct;


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageCover: product.imageCover,
    });

    addCartActivity({
      productId: product.id,
      action: 'added',
    });
  };


  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        imageCover: product.imageCover,
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.id}`} className="block flex flex-col h-full">
        {/* Image Container - 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge - Top Left */}
          {discount && discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
              -{discount}%
            </div>
          )}
          
          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-sm"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon
              icon={isInWishlist(product.id) ? faHeartSolid : faHeartRegular}
              className={`text-sm sm:text-base ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-2 sm:p-3 flex flex-col flex-1">
          {/* Product Title - Fixed height with line-clamp */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] leading-tight mb-1.5 sm:mb-2">
            {product.title}
          </h3>

          {/* Price Section with Rating */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5">
              {priceBefore && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  {priceBefore.toFixed(0)} EGP
                </span>

              )}
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {product.price.toFixed(0)} EGP
              </span>


            </div>
            {/* Rating - Right side */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-[10px] sm:text-xs mr-1" />
              <span className="text-[10px] sm:text-xs text-gray-600">{product.ratingsAverage.toFixed(1)}</span>
            </div>
          </div>


          {/* Add to Cart Button */}

          <button
            onClick={handleAddToCart}
            className={`w-full mt-auto py-1.5 sm:py-2 px-2 sm:px-4 rounded-full font-semibold text-white text-[10px] sm:text-xs relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
              isInCart(product.id)
                ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 shadow-md shadow-green-500/50 hover:shadow-green-500/70'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 shadow-md shadow-blue-500/50 hover:shadow-blue-500/70'
            }`}
          >
            <span className="relative z-10 drop-shadow-md">
              {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
            </span>
          </button>

        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
