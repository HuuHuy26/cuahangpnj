import React from 'react';
import { X, HelpCircle, Ruler, CheckCircle2 } from 'lucide-react';

interface RingSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export const RingSizeModal: React.FC<RingSizeModalProps> = ({ isOpen, onClose, onSelectSize }) => {
  if (!isOpen) return null;

  const sizeChart = [
    { size: '8', diameter: '15.3 mm', perimeter: '48.0 mm' },
    { size: '9', diameter: '15.6 mm', perimeter: '49.0 mm' },
    { size: '10', diameter: '16.0 mm', perimeter: '50.0 mm' },
    { size: '11', diameter: '16.3 mm', perimeter: '51.2 mm' },
    { size: '12', diameter: '16.6 mm', perimeter: '52.2 mm' },
    { size: '13', diameter: '17.0 mm', perimeter: '53.4 mm' },
    { size: '14', diameter: '17.3 mm', perimeter: '54.4 mm' },
    { size: '15', diameter: '17.6 mm', perimeter: '55.5 mm' },
    { size: '16', diameter: '18.0 mm', perimeter: '56.5 mm' },
    { size: '17', diameter: '18.3 mm', perimeter: '57.6 mm' },
    { size: '18', diameter: '18.6 mm', perimeter: '58.6 mm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="text-lg font-bold font-serif text-[#F4E8C1]">Bảng Đo Size Nhẫn Chuẩn Việt Nam</h3>
              <p className="text-xs text-gray-300">Hướng dẫn đo kích thước ngón tay chuẩn xác tại nhà</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-700">
          {/* Guide Steps */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE6DD]">
            <h4 className="font-bold text-[#0B192C] text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
              Cách đo nhanh bằng sợi chỉ hoặc dải giấy
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-600">
              <li>Dùng một đoạn giấy nhỏ quấn quanh khớp ngón tay muốn đeo nhẫn.</li>
              <li>Đánh dấu điểm giao nhau và dùng thước kẻ đo chiều dài đoạn giấy (Chu vi).</li>
              <li>Đối chiếu số đo chu vi với bảng chuẩn bên dưới để chọn Size nhẫn phù hợp.</li>
            </ol>
          </div>

          {/* Size Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B192C] text-[#F4E8C1] uppercase font-bold">
                <tr>
                  <th className="py-3 px-4">Size Nhẫn</th>
                  <th className="py-3 px-4">Đường Kính Trong</th>
                  <th className="py-3 px-4">Chu Vi Ngón Tay</th>
                  {onSelectSize && <th className="py-3 px-4 text-center">Chọn</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#0B192C]">Size {row.size}</td>
                    <td className="py-2.5 px-4 text-gray-600">{row.diameter}</td>
                    <td className="py-2.5 px-4 text-gray-600">{row.perimeter}</td>
                    {onSelectSize && (
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => {
                            onSelectSize(row.size);
                            onClose();
                          }}
                          className="px-3 py-1 bg-[#FAF8F5] border border-[#D4AF37] text-[#997A15] hover:bg-[#D4AF37] hover:text-[#0B192C] font-semibold rounded text-[11px] transition-colors"
                        >
                          Chọn
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-gray-500 italic text-center">
            * 3AE hỗ trợ chỉnh size nhẫn miễn phí trọn đời cho mọi đơn hàng.
          </p>
        </div>
      </div>
    </div>
  );
};
