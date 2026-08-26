import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types';
import { apiService } from '../../services/api';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await apiService.categories.getAll();
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] mb-2 italic">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Danh Mục Đẳng Cấp</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#003366]">
            Kiệt Tác Trang Sức & Kim Cương
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-3" />
          <p className="text-xs sm:text-sm text-gray-600 mt-3 font-normal">
            Tuyển chọn những thiết kế trang sức kim hoàn tinh tế nhất, tôn vinh khí chất quý phái của chủ nhân.
          </p>
        </div>

        {/* Grid Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug}`}
              className="group relative h-80 overflow-hidden shadow-md border border-[#E5E2D9] hover:border-[#C5A059] hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/90 via-[#003366]/30 to-transparent group-hover:from-[#002244]/95 transition-all duration-300" />

              {/* Text Card */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-semibold text-[#C5A059] tracking-widest uppercase mb-1">
                  Bộ Sưu Tập
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-semibold group-hover:text-[#FAF9F6] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 mt-1 font-normal opacity-90">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                  <span>Khám phá bộ sưu tập</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
