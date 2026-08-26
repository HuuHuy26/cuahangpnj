import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Heart, Star, Diamond, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRingSizeModal?: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenRingSizeModal
}) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const favorite = isFavorite(product._id);
  const discountPercent = calculateDiscountPercentage(product.price, product.salePrice);
  const availableSizes = product.availableSizes || (product.size ? [product.size] : ['9', '10', '11', '12', '13', '14']);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize || availableSizes[0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-black bg-white/80 rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto p-6 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E5DFD5]">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#D4AF37] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{product.categoryName}</span>
                <span className="font-mono">Mã: {product.sku}</span>
              </div>

              <h2 className="text-lg font-bold font-serif text-[#0B192C] leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviewCount} đánh giá)</span>
                <span className="text-gray-300">|</span>
                <span className="text-emerald-600 font-medium">Còn {product.stock} sản phẩm</span>
              </div>

              {/* Price */}
              <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5] flex items-baseline gap-3">
                <span className="text-2xl font-bold text-[#0B192C]">
                  {formatCurrency(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                      -{discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* 4C Specs */}
              {product.carat && (
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase">Carat</span>
                    <span className="font-bold text-[#0B192C]">{product.carat}ct</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase">Color</span>
                    <span className="font-bold text-[#0B192C]">{product.color}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase">Clarity</span>
                    <span className="font-bold text-[#0B192C]">{product.clarity}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase">Chứng nhận</span>
                    <span className="font-bold text-[#997A15]">{product.certificate}</span>
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-800">Chọn kích thước (Size):</span>
                    {onOpenRingSizeModal && (
                      <button
                        onClick={onOpenRingSizeModal}
                        className="text-[11px] text-[#997A15] hover:underline"
                      >
                        Hướng dẫn đo size
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                          (selectedSize || availableSizes[0]) === s
                            ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#D4AF37]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-800">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Thêm vào giỏ hàng
              </button>

              <button
                onClick={() => toggleFavorite(product)}
                className={`p-3 rounded-xl border transition-all ${
                  favorite
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              </button>

              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="px-4 py-3 bg-[#0B192C] text-white text-xs font-semibold rounded-xl hover:bg-[#1E3E62] transition-colors"
              >
                Chi tiết →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
