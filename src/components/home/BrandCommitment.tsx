import React from 'react';
import { ShieldCheck, Award, Sparkles, Truck, RefreshCw, Lock } from 'lucide-react';

export const BrandCommitment: React.FC = () => {
  const commitments = [
    {
      icon: Award,
      title: '100% Kim Cương Tự Nhiên',
      desc: 'Tuyển chọn nghiêm ngặt từ các mỏ khai thác kim cương thiên nhiên hợp pháp quốc tế (Kimberley Process).',
    },
    {
      icon: ShieldCheck,
      title: 'Giấy Kiểm Định GIA/IGI Gốc',
      desc: 'Mỗi viên kim cương chủ từ 0.30 Carat đều có chứng thư giám định gốc và mã khắc laser cạnh gờ sắc nét.',
    },
    {
      icon: Sparkles,
      title: 'Bảo Hành & Xi Mới Trọn Đời',
      desc: 'Dịch vụ làm sạch siêu âm, chỉnh size nhẫn và đánh bóng hoàn toàn miễn phí trọn đời tại hệ thống showroom.',
    },
    {
      icon: Truck,
      title: 'Vận Chuyển Bọc Thép Bảo Hiểm',
      desc: 'Giao hàng hỏa tốc toàn quốc với gói bảo hiểm 100% giá trị đơn hàng, niêm phong bảo mật tối cao.',
    },
    {
      icon: RefreshCw,
      title: 'Thu Đổi Minh Bạch Lên Đến 98%',
      desc: 'Chính sách thu đổi và nâng cấp kim cương viên rõ ràng, biểu phí minh bạch bảo toàn giá trị đầu tư.',
    },
    {
      icon: Lock,
      title: 'Bảo Mật Thông Tin Khách Hàng',
      desc: 'Quy trình phục vụ VIP riêng tư, thông tin giao dịch được bảo mật theo tiêu chuẩn ngân hàng.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F6] border-y border-[#E5E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A059] italic">
            Đặc Quyền Khách Hàng
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#003366] mt-2">
            Cam Kết Vàng Từ DIAMOND
          </h2>
          <div className="w-16 h-1 bg-[#C5A059] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white border border-[#E5E2D9] hover:border-[#C5A059] hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-[#C5A059] bg-[#FAF9F6] flex items-center justify-center text-[#C5A059] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#003366] mb-2">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
