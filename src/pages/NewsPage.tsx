import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const articles = [
    {
      id: 'news-1',
      title: 'Bí Quyết Chọn Kim Cương Cầu Hôn Chuẩn GIA Khiến Nàng Say Đắm',
      excerpt: 'Hướng dẫn chi tiết cách cân bằng giữa Carat, Nước màu (Color) và Giác cắt (Cut) để sở hữu viên kim cương lấp lánh nhất trong ngân sách.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      date: '20/02/2026',
      author: 'Chuyên gia Ngọc Học Lê Trí',
      category: 'Cẩm Nang Cưới',
      content: `Khi chuẩn bị cầu hôn, việc chọn nhẫn kim cương là một trong những quyết định thiêng liêng nhất. Hãy lưu ý 3 nguyên tắc vàng sau:
      1. Ưu tiên cấp giác cắt Triple Excellent trước tiên.
      2. Nước màu từ G đến F mang lại vẻ trắng sáng tự nhiên hoàn hảo.
      3. Độ sạch VVS2 hoặc VS1 hoàn toàn không có tì vết mắt thường nhìn thấy.`,
    },
    {
      id: 'news-2',
      title: 'Xu Hướng Nhẫn Cưới Platin & Kim Cương 2026: Tối Giản Mà Đẳng Cấp',
      excerpt: 'Khám phá vì sao chất liệu Bạch Kim Platin 950 kết hợp kim cương tự nhiên trở thành biểu tượng tình yêu vĩnh cửu của các cặp đôi hiện đại.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      date: '15/02/2026',
      author: 'Ban Biên Tập 3AE',
      category: 'Xu Hướng Trang Sức',
      content: `Bạch kim Platin 950 có tỷ trọng nặng hơn vàng và không bao giờ bị phai màu theo thời gian, đại diện cho lời hẹn ước bền vững suốt trăm năm.`,
    },
    {
      id: 'news-3',
      title: 'Cách Đọc & Tra Cứu Giấy Kiểm Định GIA Trực Tuyến Chính Xác Nhất',
      excerpt: 'Mọi thông số quan trọng cần lưu ý trên giấy chứng thư GIA và cách quét mã laser vi phẫu trên viên kim cương.',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
      date: '10/02/2026',
      author: 'Viện Giám Định 3AE',
      category: 'Kiến Thức Kim Cương',
      content: `Mỗi giấy chứng nhận GIA gồm số báo cáo định danh (GIA Report Number), tỷ lệ giác cắt, bản đồ tì vết (Clarity Plot) và mã QR xác thực trực tiếp trên máy chủ GIA.`,
    },
    {
      id: 'news-4',
      title: 'Hướng Dẫn Vệ Sinh & Bảo Quản Trang Sức Kim Cương Tại Nhà Chuẩn Spa',
      excerpt: 'Các bước đơn giản để giữ cho viên kim cương của bạn luôn sáng bóng lấp lánh như ngày đầu tiên.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      date: '05/02/2026',
      author: 'Chuyên gia Chăm Sóc Khách Hàng',
      category: 'Bảo Dưỡng Trang Sức',
      content: `Ngâm trang sức trong nước ấm pha chút xà phòng dịu nhẹ trong 15 phút, dùng bàn chải lông siêu mềm chải nhẹ phía sau chấu và lau khô bằng khăn vi sợi.`,
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#997A15]">
            <BookOpen className="w-3.5 h-3.5" />
            Tạp Chí Kim Hoàn
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#0B192C]">
            Tin Tức & Cẩm Nang Trang Sức
          </h1>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 overflow-hidden">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold px-3 py-1 rounded-full">
                  {art.category}
                </span>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {art.author}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold font-serif text-[#0B192C] leading-snug">
                    {art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mt-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#997A15]">
                  <span>Đọc tiếp cẩm nang</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
