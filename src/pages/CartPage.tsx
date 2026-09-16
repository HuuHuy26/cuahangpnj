import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    vatAmount,
    vatRate,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const freeShippingThreshold = 10000000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      await applyCoupon(couponCodeInput.trim().toUpperCase());
      setCouponCodeInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#E8E2D5] text-center max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-[#FAF8F5] border-2 border-[#D4AF37]/50 rounded-full flex items-center justify-center mx-auto text-[#997A15]">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#0B192C]">Giỏ Hàng Đang Trống</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              Quý khách chưa chọn tuyệt tác trang sức nào. Khám phá các bộ sưu tập kim cương tinh xảo của 3AE ngay hôm nay.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#0B192C] hover:bg-[#1E3E62] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            Khám Phá Bộ Sưu Tập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C]">
              Giỏ Hàng Của Quý Khách
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Đang có {items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm được chọn
            </p>
          </div>
          <button
            id="btn-clear-cart"
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Free Shipping Tracker Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#E8E2D5] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {amountToFreeShipping > 0 ? (
                <>
                  Mua thêm <strong className="text-[#0B192C]">{formatCurrency(amountToFreeShipping)}</strong> để được <strong>Miễn Phí Giao Hàng Bảo Hiểm</strong>!
                </>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Chúc mừng! Đơn hàng của quý khách được Miễn Phí Giao Hàng Bảo Hiểm Toàn Quốc
                </span>
              )}
            </span>
            <span className="font-mono text-gray-500 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B38728] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Layout Grid (Items List + Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Table / Items (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-xs border border-[#E8E2D5] divide-y divide-gray-100">
            {items.map((item) => {
              const currentPrice = item.product.salePrice || item.product.price;
              return (
                <div key={item.product._id + (item.size || '')} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <Link to={`/products/${item.product.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF8F5] border border-gray-200 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-mono text-gray-400">Mã: {item.product.sku}</span>
                    <Link to={`/products/${item.product.slug}`} className="block">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#997A15] transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>Chất liệu: <strong>{item.product.material}</strong></span>
                      {(item.selectedSize || item.size) && (
                        <>
                          <span>•</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-800">
                            Size: {item.selectedSize || item.size}
                          </span>
                        </>
                      )}
                      {item.product.certificate && (
                        <>
                          <span>•</span>
                          <span className="text-[#997A15] font-semibold">{item.product.certificate}</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm font-bold text-[#0B192C] pt-1">
                      {formatCurrency(currentPrice)}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.selectedSize || item.size)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.selectedSize || item.size)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0B192C] hidden sm:block">
                        {formatCurrency(currentPrice * item.quantity)}
                      </div>
                      <button
                        id={`btn-remove-item-${item.product._id}`}
                        onClick={() => removeItem(item.product._id, item.selectedSize || item.size)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D5] space-y-6">
              <h3 className="text-sm font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                Tóm Tắt Đơn Hàng
              </h3>

              {/* Coupon Form */}
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-2">Mã Ưu Đãi / Voucher:</span>
                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        {appliedCoupon.code}
                      </div>
                      <div className="text-[11px] text-emerald-600">
                        {appliedCoupon.discountType === 'percentage'
                          ? `Giảm ${appliedCoupon.discountValue}%`
                          : `Giảm ${formatCurrency(appliedCoupon.discountValue)}`}
                      </div>
                    </div>
                    <button
                      id="btn-remove-coupon"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Hủy mã ưu đãi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập 3AE2026 hoặc VIP..."
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs uppercase focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0B192C] text-white text-xs font-bold rounded-xl hover:bg-[#1E3E62] transition-colors"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}
                <div className="mt-2 text-[11px] text-gray-400">
                  Gợi ý: Dùng mã <strong>3AE2026</strong> giảm 5%
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Chiết khấu Voucher:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 font-medium">
                  <span className="flex items-center gap-1">
                    Thuế GTGT (VAT 10%):
                    <span className="text-[10px] text-gray-400 font-normal">Luật thuế VN</span>
                  </span>
                  <span className="font-semibold text-gray-900">+{formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng bảo hiểm:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm sm:text-base font-bold text-[#0B192C]">
                    <span>Tổng thanh toán:</span>
                    <span className="text-[#997A15]">{formatCurrency(total)}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 italic text-right mt-0.5">
                    Đã bao gồm thuế GTGT (VAT 10%)
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="btn-proceed-to-checkout"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-110 text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-gray-500 text-center">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Bảo mật thanh toán
                </span>
                <span>•</span>
                <span>Giao hàng bọc thép</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
