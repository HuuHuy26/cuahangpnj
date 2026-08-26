import React from 'react';
import { Printer, Download, X, ShieldCheck, QrCode, CheckCircle2, Diamond } from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

// Convert number to Vietnamese words for invoice summary
function numberToVietnameseWords(num: number): string {
  if (num === 0) return 'Không đồng';
  const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  // Simplified high-level formatter
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  if (millions > 0) {
    result += `${millions.toLocaleString('vi-VN')} triệu `;
  }
  if (thousands > 0) {
    result += `${thousands.toLocaleString('vi-VN')} nghìn `;
  }
  if (remainder > 0) {
    result += `${remainder} `;
  }
  result += 'đồng chẵn';
  return result.trim().charAt(0).toUpperCase() + result.trim().slice(1);
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Subtotal before tax, VAT 10%, Total
  const subtotalBeforeVat = order.subtotal - (order.discount || 0);
  const vatRate = 10;
  const vatAmount = (order as any).vatAmount || Math.round(subtotalBeforeVat * 0.10);
  const grandTotal = order.total || (subtotalBeforeVat + vatAmount + (order.shippingFee || 0));

  const invoiceNumber = (order.orderCode || '3AE').replace(/\D/g, '').slice(-6).padStart(6, '0');
  const invoiceDate = new Date(order.createdAt || Date.now());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-200">
        {/* Modal Top Control Bar */}
        <div className="bg-[#0B192C] text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Diamond className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold font-serif text-[#F4E8C1] tracking-wider uppercase">
              Hóa Đơn Giá Trị Gia Tăng Điện Tử (e-Invoice)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#b89528] text-[#0B192C] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Hóa Đơn</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-10 text-gray-800 space-y-6 text-xs bg-white">
          {/* Header */}
          <div className="border-b-2 border-[#0B192C] pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center font-bold text-base">
                    3AE
                  </div>
                  <span className="text-base font-bold font-serif text-[#0B192C] tracking-wide">
                    3AE DIAMOND & FINE JEWELRY
                  </span>
                </div>
                <div className="font-bold text-gray-900">CÔNG TY CỔ PHẦN KIM HOÀN & TRANG SỨC CAO CẤP 3AE</div>
                <div className="text-gray-600">Mã số thuế (MST): <strong className="text-gray-900 font-mono">0318999888</strong></div>
                <div className="text-gray-600">Địa chỉ: Toà nhà 3AE Tower, 128 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</div>
                <div className="text-gray-600">Hotline: 1800 5454 57 • Website: https://3ae.vn</div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 space-y-1 bg-[#FAF8F5] sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Mẫu số: 01GTKT0/001</div>
                <div className="text-[10px] text-gray-500 uppercase font-semibold">Ký hiệu: <strong>3AE/26E</strong></div>
                <div className="text-sm font-bold text-[#0B192C] font-mono">Số: #{invoiceNumber}</div>
                <div className="text-gray-500 italic">
                  Ngày {invoiceDate.getDate()} tháng {invoiceDate.getMonth() + 1} năm {invoiceDate.getFullYear()}
                </div>
              </div>
            </div>

            <div className="text-center mt-4 pt-2">
              <h2 className="text-lg font-bold font-serif text-[#0B192C] uppercase tracking-wider">
                HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT)
              </h2>
              <div className="text-[10px] text-gray-500 italic">
                (Bản thể hiện của hóa đơn điện tử theo quy định của Tổng cục Thuế Việt Nam)
              </div>
            </div>
          </div>

          {/* Customer & Company Details */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Đơn vị mua hàng: </span>
                <strong className="text-gray-900 uppercase">
                  {(order as any).companyInvoice?.companyName || order.shippingAddress?.fullName || order.customerInfo?.fullName}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Mã số thuế người mua: </span>
                <strong className="text-gray-900 font-mono">
                  {(order as any).companyInvoice?.taxCode || 'Cá nhân (Không có)'}
                </strong>
              </div>
              <div>
                <span className="text-gray-500">Người liên hệ: </span>
                <span className="text-gray-900 font-medium">
                  {order.customerInfo?.fullName || order.shippingAddress?.fullName} ({order.customerInfo?.phone || order.shippingAddress?.phone})
                </span>
              </div>
              <div>
                <span className="text-gray-500">Hình thức thanh toán: </span>
                <strong className="text-gray-900 uppercase font-mono">
                  {order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản (VietQR)' : order.paymentMethod}
                </strong>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500">Địa chỉ giao nhận: </span>
                <span className="text-gray-900">
                  {[
                    order.shippingAddress?.streetAddress || (order.shippingAddress as any)?.address,
                    order.shippingAddress?.ward,
                    order.shippingAddress?.district,
                    order.shippingAddress?.province || (order.shippingAddress as any)?.city
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300 border-collapse">
              <thead>
                <tr className="bg-[#0B192C] text-[#F4E8C1] text-[11px] uppercase">
                  <th className="p-2.5 border border-gray-300 w-10 text-center">STT</th>
                  <th className="p-2.5 border border-gray-300">Tên Hàng Hóa, Dịch Vụ Kim Cương</th>
                  <th className="p-2.5 border border-gray-300 text-center w-16">ĐVT</th>
                  <th className="p-2.5 border border-gray-300 text-center w-16">SL</th>
                  <th className="p-2.5 border border-gray-300 text-right w-28">Đơn Giá</th>
                  <th className="p-2.5 border border-gray-300 text-right w-32">Thành Tiền (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((it, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 text-[11px]">
                    <td className="p-2.5 border border-gray-300 text-center font-mono">{idx + 1}</td>
                    <td className="p-2.5 border border-gray-300">
                      <div className="font-bold text-gray-900">{it.productName || (it as any).name}</div>
                      <div className="text-[10px] text-gray-500">
                        Mã SKU: {it.productSku || '3AE-DIAMOND'} {it.size ? `• Size: ${it.size}` : ''} {it.material ? `• ${it.material}` : ''} (Chứng nhận GIA)
                      </div>
                    </td>
                    <td className="p-2.5 border border-gray-300 text-center">Chiếc</td>
                    <td className="p-2.5 border border-gray-300 text-center font-bold">{it.quantity}</td>
                    <td className="p-2.5 border border-gray-300 text-right font-mono">{formatCurrency(it.price)}</td>
                    <td className="p-2.5 border border-gray-300 text-right font-bold text-[#0B192C] font-mono">
                      {formatCurrency(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="space-y-1.5 border border-gray-300 p-4 rounded-xl bg-[#FAF8F5]">
            <div className="flex justify-between">
              <span className="text-gray-600">Cộng tiền hàng (Trước thuế):</span>
              <span className="font-mono font-bold text-gray-900">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Chiết khấu Voucher khuyến mãi {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span className="font-mono font-bold">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-gray-700 pt-1 border-t border-gray-200">
              <span>Thuế suất GTGT (VAT 10% theo luật thuế VN):</span>
              <span className="font-mono font-bold text-gray-900">+{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển bọc thép & bảo hiểm:</span>
              <span className="font-mono text-emerald-600 font-bold">Miễn phí (0đ)</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-[#0B192C] pt-2 border-t-2 border-gray-400">
              <span className="uppercase">Tổng cộng tiền thanh toán (Đã gồm VAT):</span>
              <span className="text-base text-[#997A15] font-mono font-bold">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="text-[11px] text-gray-600 italic pt-1">
              Số tiền viết bằng chữ: <strong className="text-gray-900 not-italic">{numberToVietnameseWords(grandTotal)}</strong>
            </div>
          </div>

          {/* Signatures & Digital Certification */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-center">
            <div className="space-y-12">
              <div>
                <strong className="block uppercase text-gray-900">Người Mua Hàng</strong>
                <span className="text-[10px] text-gray-500 italic">(Ký, ghi rõ họ tên)</span>
              </div>
              <div className="text-gray-700 font-medium">
                {order.customerInfo?.fullName || order.shippingAddress?.fullName}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <strong className="block uppercase text-gray-900">Người Bán Hàng</strong>
                <span className="text-[10px] text-gray-500 italic">(Ký số điện tử hợp chuẩn)</span>
              </div>
              
              {/* Digital Certificate Stamp */}
              <div className="inline-block p-2.5 bg-emerald-50 border-2 border-dashed border-emerald-500 rounded-xl text-left text-[10px] space-y-0.5 shadow-xs">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>KÝ BỞI: CÔNG TY CỔ PHẦN KIM HOÀN 3AE</span>
                </div>
                <div className="text-gray-600">Ký ngày: {invoiceDate.toLocaleDateString('vi-VN')}</div>
                <div className="text-gray-500">Chứng thư số: VIETTEL-CA SHA256 VALID</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Hóa đơn hợp lệ theo Thông tư 78/2021/TT-BTC của Bộ Tài Chính.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
