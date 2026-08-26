import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Sparkles, Eye, Award, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { DiamondStandardsModal } from '../common/DiamondStandardsModal';

export const DiamondStandardsSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const standards = [
    {
      icon: Scale,
      title: 'Carat (Trọng Lượng)',
      description: 'Đơn vị đo lường trọng lượng kim cương. 1 Carat tương đương 200mg. Độ chính xác được cân đo đến phần nghìn carat.',
      detail: 'Từ 0.30ct đến 5.00ct+',
    },
    {
      icon: Sparkles,
      title: 'Color (Nước Màu)',
      description: 'Phân cấp từ D (hoàn toàn không màu, tinh khiết nhất) đến Z. 3AE ưu tiên tuyển chọn nước D, E, F cao cấp.',
      detail: 'Chuẩn Nước D - F',
    },
    {
      icon: Eye,
      title: 'Clarity (Độ Tinh Khiết)',
      description: 'Đo lường độ trong suốt và không tì vết dưới kính hiển vi 10x. Tuyển chọn cấp độ hoàn hảo FL, IF, VVS1, VVS2.',
      detail: 'Cấp độ VVS - VS',
    },
    {
      icon: Award,
      title: 'Cut (Giác Cắt)',
      description: 'Yếu tố quyết định độ bắt sáng và tán sắc rực rỡ. 100% kim cương đạt chuẩn giác cắt Triple Excellent & Ideal Cut.',
      detail: 'Chuẩn 3X Excellent',
    },
  ];

  return (
    <section className="py-20 bg-[#002244] text-white relative overflow-hidden border-t-2 border-b-2 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#003366] border border-[#C5A059]/40 text-xs font-semibold text-[#C5A059] mb-3 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Chứng Nhận GIA Quốc Tế</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white">
            Chuẩn Mực Kim Cương 4C Quốc Tế
          </h2>
          <div className="w-20 h-1 bg-[#C5A059] mx-auto mt-4" />
          <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed font-normal">
            Mỗi viên kim cương tại DIAMOND đều được thẩm định nghiêm ngặt theo bộ tiêu chuẩn 4C của Viện Ngọc học Hoa Kỳ (GIA), kèm khắc mã số cạnh gờ bằng laser độc nhất.
          </p>
        </div>

        {/* 4C Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#003366] border border-[#C5A059]/30 hover:border-[#C5A059] p-6 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] mb-4 bg-[#002244]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#004080] flex items-center justify-between text-xs font-semibold text-[#C5A059]">
                  <span>{item.detail}</span>
                  <Check className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to actions */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
          <button
            id="btn-open-4c-guide"
            onClick={() => setModalOpen(true)}
            className="px-8 py-3.5 bg-[#C5A059] hover:bg-[#9A7B39] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md"
          >
            Mở Cẩm Nang 4C Chi Tiết
          </button>

          <Link
            to="/diamonds"
            className="px-8 py-3.5 bg-transparent border border-white text-white hover:bg-white hover:text-[#003366] font-semibold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
          >
            <span>Tra cứu bảng giá kim cương GIA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <DiamondStandardsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
