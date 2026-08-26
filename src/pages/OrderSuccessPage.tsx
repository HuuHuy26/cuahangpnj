import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  QrCode, 
  Copy, 
  ShieldCheck, 
  ArrowRight, 
  Diamond, 
  Phone, 
  FileCheck, 
  Printer, 
  Wallet, 
  CreditCard, 
  Receipt,
  Check
} from 'lucide-react';
import { Order } from '../types';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/common/InvoiceModal';

export const OrderSuccessPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const location = useLocation();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && orderCode) {
        try {
          const res = await apiService.orders.getById(orderCode);
          setOrder(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [order, orderCode]);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Đã sao chép ${label}!`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Đang tải thông tin xác nhận đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#0B192C]">Không tìm thấy thông tin đơn hàng</h2>
        <Link to="/products" className="px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl">
          Về Trang Mua Sắm
        </Link>
      </div>
    );
  }

  // VietQR Napas 24/7 endpoint (MB Bank)
  const vietQrUrl = `https://img.vietqr.io/image/mbbank-0901234567-compact2.png?amount=${order.total}&addInfo=${order.orderCode}&accountName=CTY%20CP%20KIM%20HOAN%203AE`;
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=2|99|0901234567|CTY%20CP%20KIM%20HOAN%203AE|admin@3ae.vn|0|0|${order.total}|${order.orderCode}|transfer_myqr`;
  const zalopayQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=zalopay://pay?amount=${order.total}&desc=${order.orderCode}`;
  const vnpayQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226580010A000000727012600069704220112${order.orderCode}53037045408${order.total}5802VN62150811${order.orderCode}6304`;

  const subtotalBeforeVat = order.subtotal - (order.discount || 0);
  const vatAmount = (order as any).vatAmount || Math.round(subtotalBeforeVat * 0.10);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Success Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-[#E8E2D5] text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#997A15]">
              Đặt Hàng Thành Công
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0B192C] mt-1">
              Cảm Ơn Quý Khách Đã Lựa Chọn 3AE!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
              Mã đơn hàng của quý khách là <strong className="font-mono text-[#0B192C] text-base">{order.orderCode}</strong>.
              Hóa đơn điện tử VAT 10% đã được khởi tạo thành công trên hệ thống.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>In Hóa Đơn Điện Tử Đỏ (VAT)</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo hiểm 100% kim cương GIA</span>
            </div>
          </div>
        </div>

        {/* 1. Payment QR Box: BANK_TRANSFER (VietQR) */}
        {(order.paymentMethod === 'BANK_TRANSFER' || (order.paymentMethod as any) === 'bank_transfer') && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-[#D4AF37] space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-2xl bg-[#0B192C] text-[#D4AF37]">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-[#0B192C]">
                  Thanh Toán Tức Thì Qua Mã VietQR (Napas 24/7)
                </h3>
                <p className="text-xs text-gray-500">Mở ứng dụng Mobile Banking của bất kỳ ngân hàng nào để quét mã QR</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Image */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5]">
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR 3AE"
                  className="w-56 h-auto rounded-xl shadow-md border border-white"
                />
                <span className="text-[11px] text-gray-500 mt-2 font-medium">
                  Quét bằng App Ngân Hàng bất kỳ
                </span>
              </div>

              {/* Bank Details Table */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Ngân hàng thụ hưởng:</span>
                  <div className="font-bold text-gray-900">MBBank (Ngân Hàng Quân Đội)</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[11px]">Số tài khoản VIP:</span>
                    <div className="font-mono font-bold text-base text-[#0B192C]">0901234567</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('0901234567', 'Số tài khoản')}
                    className="p-1.5 text-[#997A15] hover:bg-white rounded-lg border border-[#D4AF37]/40 cursor-pointer"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Tên chủ tài khoản:</span>
                  <div className="font-bold text-gray-900">CTY CP KIM HOAN 3AE</div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[11px]">Số tiền cần chuyển (Đã gồm VAT 10%):</span>
                    <div className="font-bold text-base text-[#997A15] font-mono">{formatCurrency(order.total)}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.total.toString(), 'Số tiền')}
                    className="p-1.5 text-[#997A15] hover:bg-white rounded-lg border border-[#D4AF37]/40 cursor-pointer"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[11px]">Nội dung chuyển khoản:</span>
                    <div className="font-mono font-bold text-sm text-[#0B192C]">{order.orderCode}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.orderCode, 'Nội dung chuyển tiền')}
                    className="p-1.5 text-[#997A15] hover:bg-white rounded-lg border border-[#D4AF37]/40 cursor-pointer"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Payment QR Box: MOMO */}
        {order.paymentMethod === 'MOMO' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-pink-400 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-2xl bg-pink-600 text-white">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-[#0B192C]">
                  Thanh Toán Bằng Ví MoMo Pay
                </h3>
                <p className="text-xs text-gray-500">Mở ứng dụng MoMo và quét mã QR bên dưới để thanh toán đơn hàng</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-4 bg-pink-50/50 rounded-2xl border border-pink-200">
                <img
                  src={momoQrUrl}
                  alt="Mã MoMo QR 3AE"
                  className="w-56 h-auto rounded-xl shadow-md border border-white"
                />
                <span className="text-[11px] text-pink-700 mt-2 font-bold">
                  Quét bằng App MoMo
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200">
                  <span className="text-gray-500 text-[11px]">Tài khoản nhận MoMo:</span>
                  <div className="font-bold text-gray-900">0901234567 (CTY CP KIM HOÀN 3AE)</div>
                </div>
                <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200">
                  <span className="text-gray-500 text-[11px]">Số tiền:</span>
                  <div className="font-bold text-base text-pink-600 font-mono">{formatCurrency(order.total)}</div>
                </div>
                <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[11px]">Nội dung lời nhắn:</span>
                    <div className="font-mono font-bold text-gray-900">{order.orderCode}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.orderCode, 'Nội dung')}
                    className="p-1.5 text-pink-600 hover:bg-white rounded-lg border border-pink-300 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Payment QR Box: ZALOPAY */}
        {order.paymentMethod === 'ZALOPAY' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-blue-400 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-[#0B192C]">
                  Thanh Toán Bằng Ví ZaloPay
                </h3>
                <p className="text-xs text-gray-500">Mở ứng dụng Zalo / ZaloPay quét mã QR để xác nhận thanh toán</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50/50 rounded-2xl border border-blue-200">
                <img
                  src={zalopayQrUrl}
                  alt="Mã ZaloPay QR 3AE"
                  className="w-56 h-auto rounded-xl shadow-md border border-white"
                />
                <span className="text-[11px] text-blue-700 mt-2 font-bold">
                  Quét bằng App Zalo / ZaloPay
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <span className="text-gray-500 text-[11px]">Đơn vị thụ hưởng:</span>
                  <div className="font-bold text-gray-900">3AE DIAMOND JEWELRY</div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <span className="text-gray-500 text-[11px]">Tổng số tiền:</span>
                  <div className="font-bold text-base text-blue-600 font-mono">{formatCurrency(order.total)}</div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-[11px]">Mã đơn ZaloPay:</span>
                    <div className="font-mono font-bold text-gray-900">{order.orderCode}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.orderCode, 'Mã đơn')}
                    className="p-1.5 text-blue-600 hover:bg-white rounded-lg border border-blue-300 cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Payment QR Box: VNPAY */}
        {order.paymentMethod === 'VNPAY' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-blue-700 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 rounded-2xl bg-blue-800 text-white">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-[#0B192C]">
                  Thanh Toán Cổng VNPAY QR
                </h3>
                <p className="text-xs text-gray-500">Hỗ trợ quét qua hơn 30 ứng dụng Mobile Banking</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-blue-50/40 rounded-2xl border border-blue-200">
              <img
                src={vnpayQrUrl}
                alt="Mã VNPAY QR 3AE"
                className="w-48 h-auto rounded-xl shadow-md border border-white"
              />
              <div className="space-y-2 text-xs text-gray-700">
                <div>Mã giao dịch VNPAY: <strong className="font-mono text-[#0B192C]">{order.orderCode}</strong></div>
                <div>Số tiền thanh toán: <strong className="text-base text-blue-700 font-mono">{formatCurrency(order.total)}</strong></div>
                <div className="text-[11px] text-gray-500">Hệ thống sẽ tự động cập nhật trạng thái đơn sau 30 giây khi quý khách hoàn tất giao dịch.</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Payment Notice Box: COD */}
        {order.paymentMethod === 'COD' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <Truck className="w-6 h-6 text-[#D4AF37]" />
              <h3 className="text-base font-bold font-serif text-[#0B192C]">
                Thanh Toán Tiền Mặt Khi Nhận Hàng (COD Đồng Kiểm)
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nhân viên giao nhận bảo an của 3AE sẽ mang kiện hàng đến tận nơi. Quý khách được quyền mở hộp niêm phong, kiểm tra giấy chứng nhận kim cương GIA và tình trạng trang sức trước khi thanh toán số tiền <strong className="text-[#997A15]">{formatCurrency(order.total)}</strong> cho nhân viên giao hàng.
            </p>
          </div>
        )}

        {/* Order Details & Summary Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
              Chi Tiết Đơn Hàng #{order.orderCode}
            </h3>
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-[#997A15] font-bold hover:underline cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Xem Hóa Đơn GTGT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
            <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200">
              <span className="font-bold text-[#0B192C] block">Thông Tin Người Nhận:</span>
              <div>Họ tên: <strong>{order.shippingAddress?.fullName || order.customerInfo?.fullName}</strong></div>
              <div>Số điện thoại: <strong>{order.shippingAddress?.phone || order.customerInfo?.phone}</strong></div>
              <div>
                Địa chỉ: {[
                  order.shippingAddress?.streetAddress || (order.shippingAddress as any)?.address,
                  order.shippingAddress?.ward,
                  order.shippingAddress?.district,
                  order.shippingAddress?.province || (order.shippingAddress as any)?.city
                ].filter(Boolean).join(', ')}
              </div>
              {order.note && (
                <div className="text-gray-500 italic pt-1 border-t border-gray-200 mt-1">
                  Ghi chú: {order.note}
                </div>
              )}
            </div>

            <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200">
              <span className="font-bold text-[#0B192C] block">Trạng Thái Giao Dịch:</span>
              <div>Ngày đặt: <strong>{formatDate(order.createdAt)}</strong></div>
              <div>Phương thức: <strong className="uppercase">{order.paymentMethod}</strong></div>
              <div>Trạng thái đơn: <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">{order.orderStatus}</span></div>
              <div>Thanh toán: <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">{order.paymentStatus}</span></div>
            </div>
          </div>

          {/* Items table */}
          <div className="divide-y divide-gray-100 border-t border-b border-gray-200 py-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage || (item as any).image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.productName || (item as any).name}</h4>
                    <div className="text-[11px] text-gray-500">
                      SL: {item.quantity} {item.size && `• Size: ${item.size}`} {item.material && `• ${item.material}`}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[#0B192C] font-mono">{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-right">
            <div className="text-gray-600">Tạm tính (Trước thuế): <span className="font-mono font-bold text-gray-900">{formatCurrency(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="text-emerald-600 font-semibold">Ưu đãi Voucher: -{formatCurrency(order.discount)}</div>}
            <div className="text-gray-700">Thuế GTGT (VAT 10%): <span className="font-mono font-bold text-gray-900">+{formatCurrency(vatAmount)}</span></div>
            <div className="text-gray-600">Phí giao hàng: <span className="text-emerald-600 font-bold">Miễn phí</span></div>
            <div className="text-base font-bold text-[#997A15]">Tổng tiền đã gồm VAT: <span className="font-mono text-lg">{formatCurrency(order.total)}</span></div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-6 py-3 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3E62] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>In Hóa Đơn Điện Tử GTGT</span>
          </button>
          <Link
            to="/account?tab=orders"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:border-[#D4AF37] transition-colors"
          >
            Xem Lịch Sử Đơn Hàng
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-[#FAF8F5] text-gray-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>

      </div>

      {/* VAT Invoice Printable Modal */}
      {order && (
        <InvoiceModal
          order={order}
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      )}
    </div>
  );
};
