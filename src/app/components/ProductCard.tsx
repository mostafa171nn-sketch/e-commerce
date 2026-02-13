import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useCart } from '../lib/CartContext';
import { useOrders } from '../lib/OrdersContext';
import { useCartDrawer } from '../lib/CartDrawerContext';
import { useWishlist } from '../lib/WishlistContext';

interface Product {
  id: number;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = React.memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { addCartActivity } = useOrders();
  const { openCart } = useCartDrawer();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, (max-width: 1535px) 25vw, 20vw"
            unoptimized
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FontAwesomeIcon
              icon={isInWishlist(product.id) ? faHeartSolid : faHeartRegular}
              className={`text-lg ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm mr-1" />
              <span className="text-sm text-gray-600">{product.ratingsAverage.toFixed(1)}</span>
            </div>
            <span className="text-lg font-bold text-green-600">${product.price}</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-4 rounded-full font-semibold text-white relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
              isInCart(product.id)
                ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 shadow-lg shadow-green-500/50 hover:shadow-green-500/70'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
            } before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent after:skew-x-[-20deg] hover:after:left-[100%] after:transition-all after:duration-500`}
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
