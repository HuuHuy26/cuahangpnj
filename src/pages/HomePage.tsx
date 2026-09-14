import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Quote } from 'lucide-react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { DiamondStandardsSection } from '../components/home/DiamondStandardsSection';
import { BrandCommitment } from '../components/home/BrandCommitment';
import { NewsSection } from '../components/home/NewsSection';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { RingSizeModal } from '../components/common/RingSizeModal';
import { Product, Review } from '../types';
import { apiService } from '../services/api';

export const HomePage: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [ringSizeModalOpen, setRingSizeModalOpen] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      const bestRes = await apiService.products.getAll({ sort: 'best_seller', limit: 8 });
      setBestSellers(bestRes.data);

      const newRes = await apiService.products.getAll({ sort: 'newest', limit: 4 });
      setNewArrivals(newRes.data);

      const revRes = await apiService.reviews.getAll();
      setReviews(revRes.data);
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner Slider */}
      <HeroBanner />

      {/* 2. Featured Categories Grid */}
      <CategoryGrid />

      {/* 3. Best Sellers Showcase */}
      <section className="py-16 bg-white border-b border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Tuyệt tác yêu thích</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#003366] mb-2">
                Sản Phẩm Bán Chạy Nhất
              </h2>
              <div className="h-1 w-20 bg-[#C5A059]"></div>
            </div>
            <Link
              to="/products?sort=best_seller"
              className="text-xs uppercase tracking-widest text-[#555] font-semibold border-b border-[#E5E2D9] pb-1 hover:text-[#C5A059] transition-colors"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Luxury Promotional Showcase Banner */}
      <section className="py-16 bg-[#FAF9F6] border-b border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden shadow-xl bg-[#003366] border-2 border-[#C5A059]">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

              {/* Text Side */}
              <div className="p-8 sm:p-12 lg:p-16 text-white space-y-6">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[#C5A059] italic">
                  Ưu Đãi Mùa Cưới & Tình Yêu 2026
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif leading-tight text-white">
                  Tặng Voucher Đến 5.000.000 VNĐ Khi Mua Nhẫn Cưới & Kim Cương
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                  Nhập mã <strong>3AE2026</strong> khi thanh toán để nhận ngay chiết khấu 5% cho mọi đơn hàng từ 20 triệu. Miễn phí khắc laser tên kỷ niệm và bảo hiểm vận chuyển toàn quốc.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to="/products?category=trang-suc-cuoi"
                    className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#9A7B39] text-white font-bold text-[11px] uppercase tracking-widest shadow-md transition-all"
                  >
                    Xem Trang Sức Cưới
                  </Link>
                  <Link
                    to="/products"
                    className="px-8 py-3.5 bg-transparent hover:bg-white hover:text-[#003366] text-white border border-white text-[11px] font-semibold uppercase tracking-widest transition-all"
                  >
                    Khám Phá Toàn Bộ
                  </Link>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[350px]">
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80"
                  alt="Trang sức cưới cao cấp"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#003366] via-transparent to-transparent" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className="py-16 bg-white border-b border-[#E5E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Vừa ra mắt</p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#003366] mb-2">
                Tuyệt Tác Mới Nhất
              </h2>
              <div className="h-1 w-20 bg-[#C5A059]"></div>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-xs uppercase tracking-widest text-[#555] font-semibold border-b border-[#E5E2D9] pb-1 hover:text-[#C5A059] transition-colors"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Diamond 4C Standards Section */}
      <DiamondStandardsSection />

      {/* 7. Brand Commitments */}
      <BrandCommitment />

      {/* 8. Customer Testimonials */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#997A15]">
              Cảm Nhận Khách Hàng
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C] mt-1">
              Khách Hàng Nói Về 3AE
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((review) => (
              <div
                key={review._id}
                className="p-6 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-2" />
                  <div className="flex text-amber-500 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-light italic mb-6">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0B192C]">{review.userName}</h4>
                    <span className="text-[11px] text-emerald-600 font-medium">✓ Đã mua hàng xác thực</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. News and Knowledge */}
      <NewsSection />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenRingSizeModal={() => {
          setRingSizeModalOpen(true);
        }}
      />

      {/* Ring Size Modal */}
      <RingSizeModal
        isOpen={ringSizeModalOpen}
        onClose={() => setRingSizeModalOpen(false)}
      />
    </div>
  );
};
