import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Diamond,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Search,
  Scale,
  Award,
  RotateCcw,
  Check
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { DiamondStandardsModal } from '../components/common/DiamondStandardsModal';
import { Product } from '../types';
import { apiService } from '../services/api';

export const DiamondsPage: React.FC = () => {
  const [diamonds, setDiamonds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [standardsModalOpen, setStandardsModalOpen] = useState(false);

  // Filters
  const [selectedShape, setSelectedShape] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedClarity, setSelectedClarity] = useState<string>('');
  const [caratRange, setCaratRange] = useState<string>('all');

  useEffect(() => {
    const fetchDiamonds = async () => {
      setLoading(true);
      let caratMin: number | undefined;
      let caratMax: number | undefined;
      if (caratRange === '<0.5') caratMax = 0.49;
      else if (caratRange === '0.5-1.0') { caratMin = 0.5; caratMax = 0.99; }
      else if (caratRange === '1.0-2.0') { caratMin = 1.0; caratMax = 1.99; }
      else if (caratRange === '>2.0') caratMin = 2.0;

      const res = await apiService.products.getAll({
        category: 'kim-cuong-vien',
        shape: selectedShape || undefined,
        color: selectedColor || undefined,
        clarity: selectedClarity || undefined,
        caratMin,
        caratMax,
      });

      // If category empty, fallback to all with carat
      if (res.data.length === 0) {
        const allRes = await apiService.products.getAll({
          shape: selectedShape || undefined,
          color: selectedColor || undefined,
          clarity: selectedClarity || undefined,
          caratMin,
          caratMax,
        });
        setDiamonds(allRes.data.filter((p) => !!p.carat));
      } else {
        setDiamonds(res.data);
      }
      setLoading(false);
    };

    fetchDiamonds();
  }, [selectedShape, selectedColor, selectedClarity, caratRange]);

  const shapes = ['Round', 'Princess', 'Emerald', 'Cushion', 'Oval', 'Heart'];
  const colors = ['D', 'E', 'F', 'G', 'H'];
  const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2'];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Hero Header */}
        <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-xs font-semibold text-[#F4E8C1]">
              <Diamond className="w-3.5 h-3.5 text-[#D4AF37]" />
              KHO KIM CƯƠNG VIÊN GIA TOÀN CẦU
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
              Tra Cứu Bảng Giá Kim Cương Viên GIA
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
              Tuyển tập những viên kim cương thiên nhiên tuyển chọn giác cắt Triple Excellent (3X), có đầy đủ chứng thư kiểm định GIA gốc và mã laser cạnh gờ.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setStandardsModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg"
              >
                Cẩm Nang Chọn Kim Cương 4C
              </button>
            </div>
          </div>
        </div>

        {/* 4C Interactive Filter Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-sm font-bold font-serif text-[#0B192C] uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              Bộ Lọc Kim Cương Viên Theo Chuẩn 4C
            </h2>
            <button
              onClick={() => {
                setSelectedShape('');
                setSelectedColor('');
                setSelectedClarity('');
                setCaratRange('all');
              }}
              className="text-xs text-[#997A15] hover:underline"
            >
              Đặt lại bộ lọc
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            {/* Shape */}
            <div>
              <span className="font-bold text-gray-700 block mb-2">1. Hình Dạng (Shape):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedShape(selectedShape === s ? '' : s)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${selectedShape === s
                      ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                      : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:border-[#D4AF37]'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Carat */}
            <div>
              <span className="font-bold text-gray-700 block mb-2">2. Trọng Lượng (Carat):</span>
              <select
                value={caratRange}
                onChange={(e) => setCaratRange(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs"
              >
                <option value="all">Tất cả trọng lượng</option>
                <option value="<0.5">Dưới 0.50 Carat</option>
                <option value="0.5-1.0">0.50ct - 0.99ct</option>
                <option value="1.0-2.0">1.00ct - 1.99ct</option>
                <option value=">2.0">Từ 2.00 Carat trở lên</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <span className="font-bold text-gray-700 block mb-2">3. Nước Màu (Color):</span>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(selectedColor === c ? '' : c)}
                    className={`w-9 h-8 rounded-lg border text-xs font-bold transition-all ${selectedColor === c
                      ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                      : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:border-[#D4AF37]'
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity */}
            <div>
              <span className="font-bold text-gray-700 block mb-2">4. Độ Sạch (Clarity):</span>
              <div className="grid grid-cols-3 gap-1.5">
                {clarities.map((cl) => (
                  <button
                    key={cl}
                    onClick={() => setSelectedClarity(selectedClarity === cl ? '' : cl)}
                    className={`py-1.5 text-[11px] rounded-lg border text-center font-semibold transition-all ${selectedClarity === cl
                      ? 'bg-[#0B192C] text-[#F4E8C1] border-[#0B192C]'
                      : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:border-[#D4AF37]'
                      }`}
                  >
                    {cl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Tìm thấy <strong>{diamonds.length}</strong> viên kim cương phù hợp</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : diamonds.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {diamonds.map((diamond) => (
                <ProductCard key={diamond._id} product={diamond} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-[#E8E2D5] text-center space-y-3">
              <Diamond className="w-10 h-10 text-[#D4AF37] mx-auto" />
              <h3 className="text-base font-bold text-[#0B192C]">Không có viên kim cương nào theo tiêu chí này</h3>
              <p className="text-xs text-gray-500">Quý khách vui lòng mở rộng tiêu chí bộ lọc để tìm được viên ưng ý.</p>
            </div>
          )}
        </div>

      </div>

      <DiamondStandardsModal
        isOpen={standardsModalOpen}
        onClose={() => setStandardsModalOpen(false)}
      />
    </div>
  );
};
