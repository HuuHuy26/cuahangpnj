import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Diamond } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = calculateDiscountPercentage(product.price, product.salePrice);
  const favorite = isFavorite(product._id);

  return (
    <div
      id={`product-card-${product._id}`}
      className="group bg-white overflow-hidden border border-[#E5E2D9] hover:border-[#C5A059] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF9F6] border-b border-[#E5E2D9]">
        <Link to={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-red-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#C5A059] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              HOT
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#003366] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs">
              Mới
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          id={`btn-wishlist-${product._id}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product);
          }}
          className={`absolute top-3 right-3 p-2 backdrop-blur-md transition-all z-10 ${
            favorite
              ? 'bg-white text-red-600 shadow-md'
              : 'bg-white/80 text-[#003366] hover:text-[#C5A059] hover:bg-white shadow-xs'
          }`}
          title={favorite ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* GIA Certificate Badge */}
        {product.certificate && (
          <div className="absolute bottom-3 left-3 bg-[#003366]/90 backdrop-blur-md text-white border border-[#C5A059]/40 text-[9px] font-semibold px-2 py-0.5 flex items-center gap-1">
            <Diamond className="w-3 h-3 text-[#C5A059]" />
            <span>{product.certificate}</span>
            {product.carat && <span>• {product.carat}ct</span>}
          </div>
        )}

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 px-4">
            <button
              onClick={() => onQuickView(product)}
              className="w-full py-2 bg-[#003366] hover:bg-[#002244] text-white text-[11px] uppercase tracking-wider font-semibold shadow-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Xem nhanh
            </button>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Material and SKU */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            <span className="truncate">{product.material}</span>
            <span className="font-mono">{product.sku}</span>
          </div>

          {/* Product Name */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-[#003366] group-hover:text-[#C5A059] transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* 4C Diamond Spec Summary if applicable */}
          {product.carat && product.color && product.clarity && (
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[10px] text-gray-600 bg-[#FAF9F6] p-1.5 border border-[#E5E2D9]">
              <span className="font-bold text-[#003366]">{product.carat}ct</span>
              <span>•</span>
              <span>Nước {product.color}</span>
              <span>•</span>
              <span>Độ sạch {product.clarity}</span>
              {product.cut && (
                <>
                  <span>•</span>
                  <span>{product.cut}</span>
                </>
              )}
            </div>
          )}

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500">
            <div className="flex items-center text-[#C5A059]">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>Đã bán {product.sold}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#E5E2D9]">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-sm sm:text-base font-bold text-[#C5A059] tracking-wider">
                {formatCurrency(product.salePrice || product.price)}
              </div>
              {product.salePrice && product.salePrice < product.price && (
                <div className="text-[11px] text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </div>
              )}
            </div>

            {/* Quick Add To Cart Button */}
            <button
              id={`btn-add-cart-${product._id}`}
              onClick={(e) => {
                e.preventDefault();
                addItem(product, 1);
              }}
              disabled={product.stock <= 0}
              className={`p-2 transition-all ${
                product.stock <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#FAF9F6] border border-[#E5E2D9] text-[#003366] hover:bg-[#003366] hover:text-white'
              }`}
              title={product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
