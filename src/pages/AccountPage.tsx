import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Diamond,
  Trash2,
  Phone,
  Mail,
  Printer,
  KeyRound,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { Order, Product } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { handleAdminPortalAccess } from '../utils/adminGuard';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { favorites: wishlistItems = [], removeFromFavorites } = useWishlist();
  const { showToast } = useToast();

  const tabParam = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState<string>(tabParam);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State via OTP
  const [otpTarget, setOtpTarget] = useState(user?.phone || user?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'profile');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setOtpTarget(user.phone || user.email || '');
    }
  }, [user]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      setIsLoadingOrders(true);
      try {
        const res = await apiService.orders.getAll(user._id);
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateProfile({ name, phone, address });
      showToast('Cập nhật thông tin tài khoản thành công!', 'success');
    } catch (err: any) {
      showToast('Cập nhật thất bại', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSendChangePassOtp = async () => {
    if (!otpTarget.trim()) {
      showToast('Vui lòng nhập SĐT hoặc Email để nhận OTP', 'error');
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await apiService.auth.sendOtp(otpTarget, 'RESET_PASSWORD');
      setCountdown(60);
      showToast(res.message || 'Đã gửi mã OTP!', 'success');
      if (res.otpDemo) {
        showToast(`[MÃ OTP MÔ PHỎNG]: ${res.otpDemo}`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Gửi OTP thất bại', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || !newPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ mã OTP và mật khẩu mới', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới tối thiểu 6 ký tự', 'error');
      return;
    }
    setIsChangingPass(true);
    try {
      await apiService.auth.resetPassword(otpTarget, otpCode, newPassword);
      showToast('Đổi mật khẩu tài khoản thành công!', 'success');
      setOtpCode('');
      setNewPassword('');
    } catch (err: any) {
      showToast(err.message || 'Đổi mật khẩu thất bại', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Quý khách có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await apiService.orders.updateStatus(orderId, 'Đã hủy');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'Đã hủy' } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: 'Đã hủy' } : null));
        }
        showToast('Đã hủy đơn hàng thành công', 'success');
      } catch (err: any) {
        showToast('Không thể hủy đơn hàng', 'error');
      }
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Đã giao hàng':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Đã giao hàng</span>;
      case 'Đang giao hàng':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Đang giao hàng</span>;
      case 'Đang chuẩn bị':
      case 'Đang xử lý':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Đang chuẩn bị</span>;
      case 'Đã xác nhận':
        return <span className="bg-cyan-100 text-cyan-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Đã xác nhận</span>;
      case 'Đã hủy':
        return <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Đã hủy</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-full">Chờ xác nhận</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* User Card Top Banner */}
        <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1E3E62] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-bold font-serif">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-serif text-[#F4E8C1]">{user.name}</h1>
                <span className="text-[10px] bg-[#D4AF37] text-[#0B192C] font-bold px-2 py-0.5 rounded-full uppercase">
                  {user.role === 'admin' ? 'Quản Trị Viên' : 'Hội Viên VIP'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => handleAdminPortalAccess(user, isAuthenticated, navigate, showToast)}
                className="px-4 py-2.5 bg-[#D4AF37] text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer"
              >
                Trang Quản Trị Hệ Thống →
              </button>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-white/20 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-xs border border-[#E8E2D5] space-y-2">
            {[
              { key: 'profile', label: 'Thông Tin Tài Khoản', icon: UserIcon },
              { key: 'orders', label: 'Lịch Sử Đơn Hàng', icon: Package, badge: orders.length },
              { key: 'wishlist', label: 'Danh Sách Yêu Thích', icon: Heart, badge: wishlistItems.length },
              { key: 'password', label: 'Đổi Mật Khẩu (OTP)', icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearchParams({ tab: tab.key });
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-[#0B192C] text-[#F4E8C1] shadow-md'
                    : 'text-gray-700 hover:bg-[#FAF8F5] hover:text-[#997A15]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-[#D4AF37] text-[#0B192C]' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Body (8 cols) */}
          <div className="lg:col-span-8">

            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
                <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                  Thông Tin Cá Nhân & Địa Chỉ Giao Hàng
                </h2>

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700">Họ và tên</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-700">Số điện thoại</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Chưa cập nhật"
                        className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-semibold text-gray-700">Địa chỉ Email (Định danh tài khoản)</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="font-semibold text-gray-700">Địa chỉ giao hàng mặc định</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nhập địa chỉ nhà hoặc công ty"
                        className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-3 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer"
                  >
                    {isUpdatingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
                <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                  Lịch Sử Đơn Hàng & Hóa Đơn VAT ({orders.length})
                </h2>

                {isLoadingOrders ? (
                  <div className="py-8 text-center text-xs text-gray-400">Đang tải đơn hàng...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="p-5 bg-[#FAF8F5] rounded-2xl border border-gray-200 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200 text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#0B192C]">{ord.orderCode}</span>
                            <span className="text-gray-400 ml-2">• {formatDate(ord.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(ord.orderStatus || (ord as any).status)}
                          </div>
                        </div>

                        {/* Order preview items */}
                        <div className="space-y-2">
                          {(ord.items || []).map((it, idx) => {
                            const itemImage = it.productImage || (it as any).image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
                            const itemName = it.productName || (it as any).name || 'Trang sức 3AE';
                            return (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                  <img src={itemImage} alt="" className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-200" />
                                  <div>
                                    <span className="font-bold text-gray-900 line-clamp-1">{itemName}</span>
                                    <span className="text-[11px] text-gray-500">
                                      SL: {it.quantity} {it.size && `• Size: ${it.size}`} {it.material && `• ${it.material}`}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-[#0B192C] font-mono">{formatCurrency(it.price * it.quantity)}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Actions */}
                        <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-gray-500">Tổng thanh toán (VAT 10%): </span>
                            <strong className="text-sm font-bold text-[#997A15] font-mono">{formatCurrency(ord.total)}</strong>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setInvoiceOrder(ord)}
                              className="px-3 py-1.5 bg-[#FAF8F5] border border-gray-300 hover:border-[#D4AF37] text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#997A15]" />
                              <span>In Hóa Đơn GTGT</span>
                            </button>
                            {(ord.orderStatus === 'Chờ xác nhận' || (ord as any).status === 'Chờ xác nhận') && (
                              <button
                                onClick={() => handleCancelOrder(ord._id)}
                                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-semibold cursor-pointer"
                              >
                                Hủy đơn
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-3 py-1.5 bg-[#0B192C] text-white rounded-lg text-xs font-semibold hover:bg-[#1E3E62] flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-gray-500 space-y-3">
                    <Package className="w-10 h-10 text-gray-300 mx-auto" />
                    <p>Quý khách chưa có đơn hàng nào.</p>
                    <Link to="/products" className="inline-block px-4 py-2 bg-[#0B192C] text-[#F4E8C1] rounded-xl font-bold">
                      Mua Sắm Ngay
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
                <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                  Sản Phẩm Yêu Thích ({wishlistItems.length})
                </h2>

                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((prod) => (
                      <div key={prod._id} className="p-3 bg-[#FAF8F5] rounded-2xl border border-gray-200 flex gap-3 items-center">
                        <Link to={`/products/${prod.slug}`} className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white">
                          <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80'} alt="" className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${prod.slug}`}>
                            <h4 className="text-xs font-bold text-gray-900 truncate hover:text-[#997A15]">{prod.name}</h4>
                          </Link>
                          <div className="text-xs font-bold text-[#0B192C] mt-0.5">
                            {formatCurrency(prod.salePrice || prod.price)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromFavorites(prod._id)}
                          className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"
                          title="Xóa khỏi yêu thích"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-gray-500 space-y-3">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto" />
                    <p>Danh sách yêu thích đang trống.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Change Password via OTP */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
                <h2 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider pb-3 border-b border-gray-100">
                  Bảo Mật & Đổi Mật Khẩu (Xác Thực OTP)
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-lg">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700">Số điện thoại hoặc Email nhận OTP</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otpTarget}
                        onChange={(e) => setOtpTarget(e.target.value)}
                        required
                        className="flex-1 p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        disabled={countdown > 0 || isSendingOtp}
                        onClick={handleSendChangePassOtp}
                        className="px-4 py-3 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl hover:bg-[#1E3E62] disabled:opacity-50 cursor-pointer whitespace-nowrap"
                      >
                        {countdown > 0 ? `${countdown}s` : isSendingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700">Mã xác thực OTP 6 số *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Ví dụ: 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full p-3 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono text-sm tracking-widest focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700">Mật khẩu mới *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Tối thiểu 6 ký tự"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-3 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPass ? 'Đang cập nhật...' : 'Xác Nhận Đổi Mật Khẩu'}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="text-sm font-bold font-serif text-[#0B192C]">
                Chi Tiết Đơn Hàng #{selectedOrder.orderCode}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-black cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-3 rounded-xl">
                <div>Trạng thái đơn: {getStatusBadge(selectedOrder.orderStatus || (selectedOrder as any).status)}</div>
                <div>Thanh toán: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></div>
                <div>Ngày đặt: {formatDate(selectedOrder.createdAt)}</div>
                <div>Tổng tiền (Gồm VAT 10%): <strong className="text-[#997A15] font-mono font-bold">{formatCurrency(selectedOrder.total)}</strong></div>
              </div>

              {selectedOrder.shippingAddress && (
                <div className="p-3 bg-[#FAF8F5] rounded-xl space-y-1">
                  <span className="font-bold block">Địa chỉ giao:</span>
                  <div>
                    {selectedOrder.shippingAddress.fullName || selectedOrder.customerInfo?.fullName} - {selectedOrder.shippingAddress.phone || selectedOrder.customerInfo?.phone}
                  </div>
                  <div>
                    {[
                      selectedOrder.shippingAddress.streetAddress || (selectedOrder.shippingAddress as any).address,
                      selectedOrder.shippingAddress.ward,
                      selectedOrder.shippingAddress.district,
                      selectedOrder.shippingAddress.province || (selectedOrder.shippingAddress as any).city
                    ].filter(Boolean).join(', ')}
                  </div>
                  {selectedOrder.note && (
                    <div className="text-gray-500 italic mt-1">Ghi chú: {selectedOrder.note}</div>
                  )}
                </div>
              )}

              <div className="divide-y divide-gray-200">
                {(selectedOrder.items || []).map((it, idx) => {
                  const itemImg = it.productImage || (it as any).image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
                  const itemName = it.productName || (it as any).name || 'Trang sức 3AE';
                  return (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={itemImg} alt="" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <span className="font-bold">{itemName}</span>
                          <div className="text-[11px] text-gray-500">
                            SL: {it.quantity} {it.size && `• Size ${it.size}`} {it.material && `• ${it.material}`}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold font-mono">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => {
                    const current = selectedOrder;
                    setSelectedOrder(null);
                    setInvoiceOrder(current);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>In Hóa Đơn Điện Tử GTGT</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          isOpen={!!invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
