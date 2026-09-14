import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scale,
  Eye,
  Award,
  ShieldCheck,
  Ruler,
  CheckCircle2,
  ArrowRight,
  Diamond
} from 'lucide-react';
import { RingSizeModal } from '../components/common/RingSizeModal';

export const Standards4CPage: React.FC = () => {
  const [ringModalOpen, setRingModalOpen] = useState(false);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-xs font-semibold text-[#997A15]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            CẨM NANG NGỌC HỌC QUỐC TẾ
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#0B192C]">
            Tiêu Chuẩn Kim Cương 4C & Giám Định GIA
          </h1>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
            Tìm hiểu trọn vẹn bộ quy chuẩn định giá kim cương toàn cầu được thiết lập bởi Viện Ngọc học Hoa Kỳ (GIA) để trở thành người mua sắm trang sức thông thái.
          </p>
        </div>

        {/* 1. Carat Weight */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D5] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D4AF37]/40 text-[#997A15]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B192C]">1. Carat (Trọng Lượng Kim Cương)</h2>
              <p className="text-xs text-gray-500">Đơn vị đo khối lượng tiêu chuẩn thế giới (1 ct = 0.20 gram)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-xs text-gray-700 leading-relaxed">
            <div className="space-y-3">
              <p>
                Carat phản ánh kích thước và độ quý hiếm của viên kim cương. Hai viên kim cương cùng trọng lượng carat có thể có kích thước nhìn thấy khác nhau tùy thuộc vào tỷ lệ giác cắt nông hay sâu.
              </p>
              <p>
                Tại 3AE, mọi viên kim cương tròn tiêu chuẩn đều có kích thước đường kính tương quan lý tưởng:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>0.30 ct: ~ 4.3 mm</li>
                <li>0.50 ct: ~ 5.1 mm</li>
                <li>0.70 ct: ~ 5.7 mm</li>
                <li>1.00 ct: ~ 6.5 mm (Kích thước hoàn hảo nhất cho nhẫn cầu hôn)</li>
                <li>2.00 ct: ~ 8.1 mm</li>
              </ul>
            </div>

            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E2D5] text-center space-y-4">
              <div className="font-bold text-sm text-[#0B192C]">Mô phỏng tỷ lệ đường kính tiêu chuẩn</div>
              <div className="flex items-end justify-center gap-4 h-32 pt-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/30 border border-[#D4AF37]" />
                  <span className="text-[10px]">0.5ct (5.1mm)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-[#D4AF37]/50 border-2 border-[#D4AF37]" />
                  <span className="text-[10px] font-bold text-[#997A15]">1.0ct (6.5mm)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/80 border-2 border-[#0B192C]" />
                  <span className="text-[10px]">2.0ct (8.1mm)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Color */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D5] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D4AF37]/40 text-[#997A15]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#0B192C]">2. Color (Nước Màu Sắc)</h2>
              <p className="text-xs text-gray-500">Thang đo màu sắc kim cương trắng từ D (Không màu) đến Z (Ngả vàng)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border-l-4 border-[#0B192C]">
              <h3 className="font-bold text-sm text-[#0B192C]">Nước D - E - F (Colorless)</h3>
              <p className="text-gray-600 mt-2">
                Hoàn toàn trong suốt và không có sắc vàng. Cực kỳ quý hiếm và có giá trị cao nhất trên thị trường.
              </p>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border-l-4 border-[#D4AF37]">
              <h3 className="font-bold text-sm text-[#997A15]">Nước G - H (Near Colorless)</h3>
              <p className="text-gray-600 mt-2">
                Gần như không màu. Bằng mắt thường rất khó phân biệt với nước D-F khi đã lên ổ chấu nhẫn.
              </p>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border-l-4 border-gray-400">
              <h3 className="font-bold text-sm text-gray-700">Nước I - J (Faint Yellow)</h3>
              <p className="text-gray-600 mt-2">
                Có ánh ấm nhẹ, rất thích hợp khi kết hợp cùng chất liệu Vàng Vàng 18K hoặc Vàng Hồng 18K.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Clarity & Cut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Clarity */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <Eye className="w-6 h-6 text-[#997A15]" />
              <h3 className="text-lg font-bold font-serif text-[#0B192C]">3. Clarity (Độ Tinh Khiết)</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Thước đo độ sạch dựa trên các tì vết tự nhiên dưới kính lúp ngọc học phóng đại 10x.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-[#FAF8F5] rounded-lg">
                <strong className="text-[#0B192C]">FL / IF:</strong> <span>Hoàn hảo, không tì vết</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF8F5] rounded-lg border border-[#D4AF37]/30">
                <strong className="text-[#997A15]">VVS1 - VVS2:</strong> <span>Tì vết siêu nhỏ, cực kỳ khó thấy</span>
              </div>
              <div className="flex justify-between p-2 bg-[#FAF8F5] rounded-lg">
                <strong className="text-gray-700">VS1 - VS2:</strong> <span>Mắt thường hoàn toàn không thấy</span>
              </div>
            </div>
          </div>

          {/* Cut */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E8E2D5] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <Award className="w-6 h-6 text-[#997A15]" />
              <h3 className="text-lg font-bold font-serif text-[#0B192C]">4. Cut (Cấp Giác Cắt)</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Trái tim tạo nên sự lấp lánh rực rỡ và độ tán sắc bảy sắc cầu vồng của viên kim cương.
            </p>
            <div className="p-4 bg-[#0B192C] text-[#F4E8C1] rounded-2xl text-xs space-y-2 border border-[#D4AF37]/50">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Chuẩn Triple Excellent (3X)
              </div>
              <p className="text-gray-300 font-light text-[11px]">
                3AE tuyển chọn 100% giác cắt Excellent cho: Giác Cắt (Cut) • Độ Đối Xứng (Symmetry) • Độ Bóng (Polish).
              </p>
            </div>
          </div>
        </div>

        {/* Ring Size CTA Box */}
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white rounded-3xl p-8 shadow-xl border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
              <Ruler className="w-4 h-4" />
              CÔNG CỤ HỖ TRỢ ĐO SIZE
            </div>
            <h3 className="text-xl font-bold font-serif">Chưa Biết Size Nhẫn Của Mình?</h3>
            <p className="text-xs text-gray-300">
              Tra cứu bảng đo size ngón tay chuẩn xác hoặc nhận hỗ trợ chỉnh size miễn phí trọn đời tại showroom.
            </p>
          </div>

          <button
            onClick={() => setRingModalOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 whitespace-nowrap"
          >
            Mở Bảng Đo Size Nhẫn
          </button>
        </div>

      </div>

      <RingSizeModal
        isOpen={ringModalOpen}
        onClose={() => setRingModalOpen(false)}
      />
    </div>
  );
};
