import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Wallet,
  Lock,
  ArrowLeft,
  Check,
  Sparkles,
  Award,
  FileText,
  Building,
  Mail,
  Receipt
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { validatePhoneNumber } from '../utils/validators';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, discount, shippingFee, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [note, setNote] = useState('');
  const [engravingText, setEngravingText] = useState('');

  // Payment methods: bank_transfer, momo, zalopay, vnpay, cod
  const [paymentMethod, setPaymentMethod] = useState<string>('bank_transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  // VAT & Company Invoice request
  const [isCompanyInvoiceRequested, setIsCompanyInvoiceRequested] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [invoiceEmail, setInvoiceEmail] = useState('');

  // VAT calculation: 10% on subtotal after discount
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);
  const vatRate = 10;
  const vatAmount = Math.round(subtotalAfterDiscount * 0.10);
  const grandTotal = subtotalAfterDiscount + vatAmount + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-xl font-bold font-serif text-[#0B192C]">Không có sản phẩm để thanh toán</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6">Quý khách vui lòng chọn sản phẩm vào giỏ hàng trước khi đặt hàng.</p>
        <Link to="/products" className="px-6 py-3 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold uppercase rounded-xl">
          Khám Phá Sản Phẩm
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng', 'error');
      return;
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      showToast(phoneValidation.message, 'error');
      return;
    }

    if (isCompanyInvoiceRequested && (!companyName.trim() || !taxCode.trim())) {
      showToast('Vui lòng điền Tên công ty và Mã số thuế để xuất hóa đơn VAT', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData: any = {
        userId: user?._id,
        customerInfo: {
          fullName,
          phone,
          email,
        },
        items,
        shippingAddress: {
          fullName,
          phone,
          email,
          streetAddress: address,
          ward: 'Phường Bến Thành',
          district,
          province: city,
          note: engravingText ? `Khắc chữ: "${engravingText}". ${note}` : note,
        },
        paymentMethod: (paymentMethod === 'bank_transfer' ? 'BANK_TRANSFER' : paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase()) as any,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        vatRate,
        vatAmount,
        shippingFee,
        total: grandTotal,
        isCompanyInvoiceRequested,
        companyInvoice: isCompanyInvoiceRequested ? {
          companyName,
          taxCode,
          companyAddress: companyAddress || address,
          invoiceEmail: invoiceEmail || email
        } : undefined,
      };

      const res = await apiService.orders.create(orderData);
      clearCart();
      showToast('Đặt hàng trang sức kim cương thành công!', 'success');
      navigate(`/order-success/${res.data.orderCode}`, { state: { order: res.data } });
    } catch (err: any) {
      showToast('Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/cart" className="flex items-center gap-1 hover:text-[#997A15]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay lại Giỏ hàng
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Thanh Toán & Đặt Hàng VIP</span>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Section 1: Customer & Shipping Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
              <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                1. Thông Tin Nhận Hàng & Bảo Hiểm Vận Chuyển
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Họ và tên người nhận *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-gray-700">Địa chỉ Email (Nhận hóa đơn điện tử GTGT & GIA)</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-semibold text-gray-700">Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Số 128 Nguyễn Trãi, Phường Bến Thành"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Tỉnh / Thành phố *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    placeholder="Quận 1 / Quận Ba Đình..."
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Complimentary Laser Engraving */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D4AF37] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B192C]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Dịch Vụ Khắc Tên Kỷ Niệm Laser Miễn Phí
                </div>
                <p className="text-[11px] text-gray-500">
                  3AE tặng miễn phí dịch vụ khắc tên, ngày cưới hoặc thông điệp ý nghĩa vào lòng nhẫn.
                </p>
                <input
                  type="text"
                  placeholder="Ví dụ: 'Minh & Linh 20.10.2026' (Tối đa 20 ký tự)"
                  maxLength={20}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-gray-700">Ghi chú giao hàng (Không bắt buộc)</label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Giao giờ hành chính, bọc thêm hộp quà cao cấp..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Section 2: VAT Invoice Option */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#D4AF37]" />
                  <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
                    2. Hóa Đơn Giá Trị Gia Tăng (VAT)
                  </h2>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B192C]">
                  <input
                    type="checkbox"
                    checked={isCompanyInvoiceRequested}
                    onChange={(e) => setIsCompanyInvoiceRequested(e.target.checked)}
                    className="w-4 h-4 accent-[#D4AF37] rounded"
                  />
                  <span>Yêu cầu xuất hóa đơn Doanh Nghiệp</span>
                </label>
              </div>

              <div className="text-[11px] text-gray-600 bg-[#FAF8F5] p-3 rounded-xl border border-gray-200">
                Theo quy định của Tổng cục Thuế Việt Nam, đơn hàng sẽ được áp dụng thuế suất thuế GTGT 10% và phát hành hóa đơn điện tử hợp lệ theo Thông tư 78/2021/TT-BTC.
              </div>

              {isCompanyInvoiceRequested && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 animate-in fade-in">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-gray-700">Tên Doanh Nghiệp / Công Ty *</label>
                    <input
                      type="text"
                      required={isCompanyInvoiceRequested}
                      placeholder="CÔNG TY TNHH / CỔ PHẦN..."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Mã Số Thuế (MST) *</label>
                    <input
                      type="text"
                      required={isCompanyInvoiceRequested}
                      placeholder="0102030405"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700">Email nhận hóa đơn điện tử</label>
                    <input
                      type="email"
                      placeholder="ketoan@congty.com"
                      value={invoiceEmail}
                      onChange={(e) => setInvoiceEmail(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-gray-700">Địa chỉ đăng ký kinh doanh</label>
                    <input
                      type="text"
                      placeholder="Địa chỉ ghi trên Giấy phép ĐKKD"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Payment Methods */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
              <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-gray-100">
                <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                3. Phương Thức Thanh Toán
              </h2>

              <div className="space-y-3">
                {/* Method 1: Bank Transfer / VietQR */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-[#D4AF37] bg-[#FAF8F5]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-[#D4AF37]"
                    />
                    <div className="p-2 rounded-xl bg-white border border-gray-200 text-[#997A15]">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#0B192C]">Chuyển Khoản Ngân Hàng Tự Động (VietQR Napas 24/7)</div>
                      <div className="text-[11px] text-gray-500">Quét mã QR qua tất cả app ngân hàng (MB, VCB, BIDV, Techcombank, ACB...).</div>
                    </div>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 pt-3 border-t border-[#E8E2D5] space-y-2 text-xs text-gray-700 bg-white p-3.5 rounded-xl">
                      <div className="flex items-center gap-2 text-[#997A15] font-bold">
                        <Award className="w-4 h-4" />
                        Tài khoản thụ hưởng chính thức của 3AE:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>Ngân hàng: <strong>MBBank (Ngân Hàng Quân Đội)</strong></div>
                        <div>Số tài khoản: <strong className="font-mono text-[#0B192C]">0901234567</strong></div>
                        <div>Chủ tài khoản: <strong>CTY CP KIM HOAN 3AE</strong></div>
                        <div>Chi nhánh: <strong>Hội Sở TP.HCM</strong></div>
                      </div>
                      <p className="text-[10px] text-gray-400 italic">
                        * Mã VietQR chuẩn Napas và nội dung tự động sẽ hiển thị sau khi bấm Đặt Hàng.
                      </p>
                    </div>
                  )}
                </label>

                {/* Method 2: MoMo */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'momo' ? 'border-[#D4AF37] bg-[#FAF8F5]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                      className="accent-[#D4AF37]"
                    />
                    <div className="p-2 rounded-xl bg-white border border-gray-200 text-pink-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B192C]">Ví Điện Tử MoMo Pay</div>
                      <div className="text-[11px] text-gray-500">Quét mã MoMo QR hoặc thanh toán một chạm qua ứng dụng MoMo.</div>
                    </div>
                  </div>
                </label>

                {/* Method 3: ZaloPay */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'zalopay' ? 'border-[#D4AF37] bg-[#FAF8F5]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'zalopay'}
                      onChange={() => setPaymentMethod('zalopay')}
                      className="accent-[#D4AF37]"
                    />
                    <div className="p-2 rounded-xl bg-white border border-gray-200 text-blue-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B192C]">Ví Điện Tử ZaloPay</div>
                      <div className="text-[11px] text-gray-500">Thanh toán an toàn bảo mật qua ví ZaloPay hoặc thẻ liên kết.</div>
                    </div>
                  </div>
                </label>

                {/* Method 4: VNPay */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'vnpay' ? 'border-[#D4AF37] bg-[#FAF8F5]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="accent-[#D4AF37]"
                    />
                    <div className="p-2 rounded-xl bg-white border border-gray-200 text-blue-700">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B192C]">Cổng Thanh Toán VNPAY QR</div>
                      <div className="text-[11px] text-gray-500">Quét mã VNPAY QR qua Mobile Banking của hơn 30 ngân hàng.</div>
                    </div>
                  </div>
                </label>

                {/* Method 5: COD */}
                <label className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#D4AF37] bg-[#FAF8F5]' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#D4AF37]"
                    />
                    <div className="p-2 rounded-xl bg-white border border-gray-200 text-[#0B192C]">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B192C]">Thanh Toán Khi Nhận Hàng (COD Đồng Kiểm)</div>
                      <div className="text-[11px] text-gray-500">Kiểm tra hộp niêm phong và giấy kiểm định GIA trước khi thanh toán tiền mặt.</div>
                    </div>
                  </div>
                </label>
              </div>

            </div>

          </div>

          {/* Right Order Recap Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6 sticky top-28">
              <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                Tóm Tắt Đơn Hàng ({items.reduce((s, i) => s + i.quantity, 0)} món)
              </h2>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-[#FAF8F5]"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] text-gray-500">
                          SL: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[#0B192C] text-right whitespace-nowrap">
                      {formatCurrency((item.salePrice || item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính tiền hàng (Trước thuế):</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Ưu đãi Voucher ({appliedCoupon?.code}):</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700 font-medium">
                  <span className="flex items-center gap-1">
                    Thuế GTGT (VAT 10%):
                    <span className="text-[10px] text-gray-400 font-normal">Luật thuế VN</span>
                  </span>
                  <span className="font-semibold text-gray-900">+{formatCurrency(vatAmount)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Phí bảo hiểm & vận chuyển bọc thép:</span>
                  <span className="text-emerald-600 font-bold">Miễn phí (0đ)</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-[#0B192C]">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wider">Tổng Thanh Toán:</div>
                    <div className="text-[10px] text-gray-400 italic">Đã bao gồm thuế GTGT (VAT 10%)</div>
                  </div>
                  <div className="text-xl font-bold text-[#997A15] font-serif">
                    {formatCurrency(grandTotal)}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] text-xs font-bold uppercase tracking-[0.15em] rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'Đang Khởi Tạo Đơn Hàng VIP...' : 'Hoàn Tất Đặt Hàng & Thanh Toán'}</span>
              </button>

              <div className="space-y-2 text-[10px] text-gray-500 text-center pt-2">
                <div className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Bảo hiểm 100% giá trị kiện hàng kim cương trong suốt quá trình vận chuyển.
                </div>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
