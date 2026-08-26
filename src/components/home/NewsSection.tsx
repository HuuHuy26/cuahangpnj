import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const news = [
    {
      id: 'news-1',
      title: 'Bí Quyết Chọn Kim Cương Cầu Hôn Chuẩn GIA Khiến Nàng Say Đắm',
      excerpt: 'Hướng dẫn chi tiết cách cân bằng giữa Carat, Nước màu (Color) và Giác cắt (Cut) để sở hữu viên kim cương lấp lánh nhất trong ngân sách.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      date: '20/02/2026',
      category: 'Cẩm Nang Cưới',
    },
    {
      id: 'news-2',
      title: 'Xu Hướng Nhẫn Cưới Platin & Kim Cương 2026: Tối Giản Mà Đẳng Cấp',
      excerpt: 'Khám phá vì sao chất liệu Bạch Kim Platin 950 kết hợp kim cương tự nhiên trở thành biểu tượng tình yêu vĩnh cửu của các cặp đôi hiện đại.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      date: '15/02/2026',
      category: 'Xu Hướng Trang Sức',
    },
    {
      id: 'news-3',
      title: 'Cách Đọc & Tra Cứu Giấy Kiểm Định GIA Trực Tuyến Chính Xác Nhất',
      excerpt: 'Mọi thông số quan trọng cần lưu ý trên giấy chứng thư GIA và cách quét mã laser vi phẫu trên viên kim cương.',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
      date: '10/02/2026',
      category: 'Kiến Thức Kim Cương',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#997A15] mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Kiến Thức & Cẩm Nang
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C]">
              Tin Tức & Cẩm Nang Kim Hoàn
            </h2>
          </div>
          <Link
            to="/news"
            className="text-xs font-bold text-[#997A15] hover:text-[#0B192C] flex items-center gap-1 group transition-colors"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="group bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#EAE5DC] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#0B192C] text-[#F4E8C1] text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold font-serif text-gray-900 group-hover:text-[#997A15] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 font-light leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center text-xs font-semibold text-[#997A15]">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
