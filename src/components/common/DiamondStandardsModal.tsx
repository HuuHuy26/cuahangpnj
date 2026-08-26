import React, { useState } from 'react';
import { X, Sparkles, Award, Eye, Scale, ShieldCheck } from 'lucide-react';

interface DiamondStandardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiamondStandardsModal: React.FC<DiamondStandardsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'carat' | 'color' | 'clarity' | 'cut' | 'certificate'>('carat');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="text-lg font-bold font-serif text-[#F4E8C1]">Tiêu Chuẩn Kim Cương 4C Quốc Tế</h3>
              <p className="text-xs text-gray-300">Carat • Color • Clarity • Cut & Chứng nhận GIA/IGI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-[#FAF8F5] overflow-x-auto">
          {[
            { key: 'carat', label: '1. Carat (Trọng lượng)', icon: Scale },
            { key: 'color', label: '2. Color (Nước màu)', icon: Sparkles },
            { key: 'clarity', label: '3. Clarity (Độ sạch)', icon: Eye },
            { key: 'cut', label: '4. Cut (Giác cắt)', icon: Award },
            { key: 'certificate', label: '5. Chứng nhận GIA/IGI', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'border-[#D4AF37] text-[#0B192C] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'carat' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0B192C]">Carat (Trọng lượng & Kích thước)</h4>
              <p>
                Carat (viết tắt là <strong>ct</strong>) là đơn vị đo trọng lượng tiêu chuẩn của kim cương (1 carat = 200 miligam = 0.2 gram). 
                Kích thước đường kính của kim cương giác cắt tròn tiêu chuẩn tương ứng:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="w-6 h-6 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[10px] font-bold">0.5</div>
                  <div className="font-bold text-xs mt-2">0.50 Carat</div>
                  <div className="text-[11px] text-gray-500">~ 5.1 mm</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="w-8 h-8 mx-auto rounded-full bg-[#D4AF37]/30 border border-[#D4AF37] flex items-center justify-center text-[10px] font-bold">0.7</div>
                  <div className="font-bold text-xs mt-2">0.70 Carat</div>
                  <div className="text-[11px] text-gray-500">~ 5.7 mm</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#D4AF37] shadow-xs">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/40 border-2 border-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#0B192C]">1.0</div>
                  <div className="font-bold text-xs mt-2 text-[#997A15]">1.00 Carat</div>
                  <div className="text-[11px] text-gray-500">~ 6.5 mm</div>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/50 border-2 border-[#D4AF37] flex items-center justify-center text-xs font-bold text-[#0B192C]">2.0</div>
                  <div className="font-bold text-xs mt-2">2.00 Carat</div>
                  <div className="text-[11px] text-gray-500">~ 8.1 mm</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0B192C]">Color (Thang đo Nước màu D đến Z)</h4>
              <p>
                Kim cương trắng được xếp hạng từ <strong>D</strong> (hoàn toàn không màu, hiếm nhất và đắt nhất) đến <strong>Z</strong> (ngả vàng nhạt).
              </p>
              <div className="space-y-2.5">
                <div className="p-3 bg-white rounded-lg border-l-4 border-[#0B192C] shadow-xs">
                  <span className="font-bold text-[#0B192C]">Nước D - F (Colorless):</span> Hoàn toàn trong suốt và không màu, quý hiếm bậc nhất.
                </div>
                <div className="p-3 bg-white rounded-lg border-l-4 border-[#D4AF37] shadow-xs">
                  <span className="font-bold text-[#997A15]">Nước G - J (Near Colorless):</span> Gần như không màu, khi gắn lên ổ chấu vàng trắng hoặc vàng vàng vẫn lấp lánh rực rỡ và giá trị tối ưu.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clarity' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0B192C]">Clarity (Độ tinh khiết & Trong suốt)</h4>
              <p>
                Đánh giá mức độ tì vết bên trong (inclusions) và bên ngoài (blemishes) dưới độ phóng đại 10x:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 bg-[#FAF8F5] rounded border border-gray-200">
                  <div className="font-bold text-[#0B192C]">FL / IF (Flawless)</div>
                  <p className="text-gray-500 text-[11px] mt-0.5">Hoàn mỹ tuyệt đối, không tì vết.</p>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#D4AF37]">
                  <div className="font-bold text-[#997A15]">VVS1 / VVS2</div>
                  <p className="text-gray-500 text-[11px] mt-0.5">Tì vết siêu nhỏ, cực kỳ khó thấy.</p>
                </div>
                <div className="p-2.5 bg-[#FAF8F5] rounded border border-gray-200">
                  <div className="font-bold text-[#0B192C]">VS1 / VS2</div>
                  <p className="text-gray-500 text-[11px] mt-0.5">Tì vết rất nhỏ, mắt thường không thấy.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cut' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0B192C]">Cut (Giác cắt - Trái tim của sự lấp lánh)</h4>
              <p>
                Giác cắt là yếu tố quan trọng nhất quyết định độ khúc xạ ánh sáng (Brilliance, Fire & Scintillation) của viên kim cương.
                Tại 3AE, chúng tôi tuyển chọn 100% kim cương đạt chuẩn <strong>Triple Excellent (3X)</strong> hoặc <strong>Ideal Cut</strong>.
              </p>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-[#0B192C]">Chứng Nhận GIA & IGI Toàn Cầu</h4>
              <p>
                <strong>GIA (Gemological Institute of America)</strong> là viện ngọc học uy tín nhất thế giới.
                Mỗi viên kim cương tại 3AE đều có:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Mã số kiểm định độc nhất khắc laser vi phẫu trên cạnh gờ kim cương.</li>
                <li>Hồ sơ giấy chứng nhận gốc niêm phong bảo mật.</li>
                <li>Mã QR tra cứu trực tiếp trên hệ thống GIA Report Check toàn cầu.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B192C] text-white text-xs font-bold rounded-lg hover:bg-[#1E3E62] transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
