import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Diamond, ArrowRight } from 'lucide-react';
import { Banner } from '../../types';
import { apiService } from '../../services/api';

export const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await apiService.banners.getAll();
      setBanners(res.data);
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-[460px] bg-[#E8E4DB] flex items-center justify-center text-[#003366]">
        <div className="animate-pulse flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#C5A059]" />
          <span>Đang tải bộ sưu tập kim cương...</span>
        </div>
      </div>
    );
  }

  const activeBanner = banners[currentSlide] || banners[0];

  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[520px] bg-[#E8E4DB] border-b border-[#E5E2D9] overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row items-center">
        
        {/* Left Text Column */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center z-10">
          <div className="flex items-center gap-2 text-[#C5A059] uppercase tracking-[0.3em] text-xs font-semibold mb-3 italic">
            <Diamond className="w-3.5 h-3.5" />
            <span>Premium Collection 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight text-[#003366] mb-5">
            {activeBanner.title.includes('Kim Cương') ? (
              <>
                Vẻ Đẹp Vĩnh Cửu <br />
                <span className="text-[#C5A059] italic">Khởi Đầu Từ Tâm</span>
              </>
            ) : (
              activeBanner.title
            )}
          </h1>

          <p className="text-[#555] text-xs sm:text-sm max-w-lg leading-relaxed mb-8 font-normal">
            {activeBanner.subtitle || 'Khám phá bộ sưu tập kim cương tinh tuyển với tiêu chuẩn 4C nghiêm ngặt, minh chứng cho tình yêu và sự sang trọng vượt thời gian.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={activeBanner.link || '/products'}
              className="bg-[#003366] text-white px-8 py-3.5 text-[11px] uppercase tracking-widest font-semibold hover:bg-[#002244] transition-all flex items-center gap-2 shadow-sm"
            >
              <span>{activeBanner.buttonText || 'Mua Ngay'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/diamonds"
              className="border border-[#003366] text-[#003366] bg-transparent hover:bg-[#003366] hover:text-white px-8 py-3.5 text-[11px] uppercase tracking-widest font-semibold transition-all"
            >
              Xem Bảng Giá GIA
            </Link>
          </div>

          {/* Dots Indicator */}
          {banners.length > 1 && (
            <div className="flex gap-2 mt-8">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all duration-300 ${
                    index === currentSlide ? 'w-8 bg-[#C5A059]' : 'w-2 bg-[#003366]/30 hover:bg-[#003366]'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Visual Image Column */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex items-center justify-center relative">
          <div className="w-full max-w-[480px] h-[320px] sm:h-[380px] bg-[#FAF9F6] shadow-2xl rounded-tr-[80px] flex flex-col items-center justify-center border-4 border-white relative overflow-hidden group">
            <img
              src={activeBanner.image}
              alt={activeBanner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-center">
              <div className="text-[#C5A059] text-3xl sm:text-4xl mb-1">✧</div>
              <div className="font-serif italic text-lg sm:text-xl text-[#FAF9F6]">“The Eternal Spark”</div>
            </div>
          </div>

          {/* Luxury background concentric ring */}
          <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-[#C5A059]/30 pointer-events-none opacity-60" />
        </div>

      </div>
    </section>
  );
};
