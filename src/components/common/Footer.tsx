import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Gem,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Cảm ơn bạn đã đăng ký nhận thông tin độc quyền từ 3AE!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#002244] text-gray-300 pt-14 pb-8 border-t-2 border-[#C5A059]">
      {/* Commitment Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-[#003366]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 bg-[#003366]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Chứng Nhận GIA & IGI</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                100% Kim cương thiên nhiên được cấp giấy kiểm định quốc tế độc lập.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 bg-[#003366]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Giao Hàng Toàn Quốc</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Miễn phí vận chuyển bảo hiểm toàn phần hỏa tốc từ 5.000.000đ.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 bg-[#003366]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bảo Hành Trọn Đời</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Miễn phí siêu âm làm sáng, kiểm tra chấu và xi mới trọn đời sản phẩm.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] shrink-0 bg-[#003366]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Thu Đổi Cạnh Tranh</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Cam kết thu mua và đổi sản phẩm theo biểu phí thị trường công khai.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Gem className="w-6 h-6 text-[#C5A059]" />
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">3AE</span>
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] -mt-2">
              Diamond & Fine Jewelry
            </p>
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              3AE là thương hiệu kim hoàn và kim cương cao cấp, kiến tạo những tuyệt tác trang sức vượt thời gian tôn vinh vẻ đẹp kiêu sa và giá trị vĩnh cửu của bạn.
            </p>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Showroom Flagship: Tòa nhà Diamond Tower, 47-48 TT16 , Khu Đô Thị Văn Phú, Hà Đông ,Hà Nội</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Showroom Hà Nội: LandMark72, Nam Từ Liêm, TP. Hà Nội</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Hotline VIP: 0868 895 658 (08:30 - 21:30 hàng ngày)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Email hỗ trợ: vietkhoi@diamond-jewelry.vn</span>
              </div>
            </div>
          </div>

          {/* Column 1: Về Chúng Tôi */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-[#003366] pb-2">
              Về DIAMOND
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-[#C5A059] transition-colors">Câu chuyện thương hiệu</Link></li>
              <li><Link to="/4c-standards" className="hover:text-[#C5A059] transition-colors">Tiêu chuẩn kim cương 4C</Link></li>
              <li><Link to="/diamonds" className="hover:text-[#C5A059] transition-colors">Chứng nhận GIA & IGI</Link></li>
              <li><Link to="/products" className="hover:text-[#C5A059] transition-colors">Bộ sưu tập độc quyền</Link></li>
              <li><Link to="/news" className="hover:text-[#C5A059] transition-colors">Tin tức & Sự kiện</Link></li>
              <li><Link to="/contact" className="hover:text-[#C5A059] transition-colors">Hệ thống showroom</Link></li>
            </ul>
          </div>

          {/* Column 2: Hỗ Trợ Khách Hàng */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-[#003366] pb-2">
              Dịch Vụ Khách Hàng
            </h5>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/4c-standards" className="hover:text-[#C5A059] transition-colors">Hướng dẫn đo size nhẫn</Link></li>
              <li><Link to="/account" className="hover:text-[#C5A059] transition-colors">Chính sách bảo hành & bảo dưỡng</Link></li>
              <li><Link to="/cart" className="hover:text-[#C5A059] transition-colors">Chính sách giao hàng & bảo hiểm</Link></li>
              <li><Link to="/checkout" className="hover:text-[#C5A059] transition-colors">Phương thức thanh toán VIP</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-[#C5A059] transition-colors">Tra cứu đơn hàng</Link></li>
              <li><Link to="/contact" className="hover:text-[#C5A059] transition-colors">Đặt hẹn tư vấn riêng tư</Link></li>
            </ul>
          </div>

          {/* Column 3: Đăng Ký Nhận Tin */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-[#003366] pb-2">
              Bản Tin Độc Quyền
            </h5>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Đăng ký để nhận thông tin bộ sưu tập kim cương giới hạn và ưu đãi đặc quyền VIP.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Nhập email của quý khách..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#003366] border border-[#004080] text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#003366] text-white border border-[#C5A059] hover:bg-[#C5A059] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Đăng ký ngay
              </button>
            </form>

            <div className="mt-5">
              <span className="text-xs text-gray-400 block mb-2 font-medium">Kết nối cùng chúng tôi</span>
              <div className="flex gap-3">
                <a href="#facebook" className="p-2 bg-[#003366] text-gray-300 hover:text-[#C5A059] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#instagram" className="p-2 bg-[#003366] text-gray-300 hover:text-[#C5A059] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#youtube" className="p-2 bg-[#003366] text-gray-300 hover:text-[#C5A059] transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#003366] text-center text-xs text-gray-500">
        <p>© 2026 3AE Diamond & Fine Jewelry. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-gray-600">
          Mọi thông tin sản phẩm và giấy kiểm định GIA/IGI được mô phỏng chuẩn xác phục vụ khách hàng.
        </p>
      </div>
    </footer >
  );
};
