import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Diamond,
  X,
  Save,
  RotateCcw,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Sparkles,
  Gem,
  EyeOff,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { Product, Order, User, Category, Coupon, Banner } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/common/InvoiceModal';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'users' | 'coupons'>('overview');

  // Admin login states if unauthenticated
  const [adminEmail, setAdminEmail] = useState('admin@3ae.vn');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Datasets
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Search in tables
  const [searchTerm, setSearchTerm] = useState('');

  // Product Modal (Create/Edit)
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Coupon Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 10000000,
    isActive: true,
  });

  useEffect(() => {
    // Kiểm tra quyền: Nếu đã đăng nhập nhưng không phải admin (ví dụ: Khách hàng VIP)
    if (isAuthenticated && user && user.role !== 'admin') {
      window.alert(
        `🚫 TRUY CẬP BỊ TỪ CHỐI!\n\nTài khoản của bạn (${user.name || user.email} - Khách Hàng VIP) không có đủ thẩm quyền để truy cập Cổng Quản Trị.\n\nCổng này chỉ dành riêng cho Ban Quản Trị Hệ Thống.`
      );
      showToast('Bạn không có đủ thẩm quyền truy cập Cổng Quản Trị!', 'error');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, showToast]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, ordRes, userRes, catRes, coupRes] = await Promise.all([
        apiService.products.getAll({ limit: 100 }),
        apiService.orders.getAll(),
        apiService.admin.getUsers(),
        apiService.categories.getAll(),
        apiService.coupons.getAll(),
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
      setUsers(userRes.data);
      setCategories(catRes.data);
      setCoupons(coupRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllData();
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const success = await login(adminEmail, adminPassword);
      if (success) {
        const currentUser = await apiService.auth.getCurrentUser();
        if (currentUser?.role !== 'admin') {
          window.alert(
            `🚫 TRUY CẬP BỊ TỪ CHỐI!\n\nTài khoản (${currentUser?.email} - Khách Hàng VIP) không có đủ thẩm quyền để truy cập Cổng Quản Trị.`
          );
          showToast('Tài khoản không có thẩm quyền Quản Trị!', 'error');
          navigate('/', { replace: true });
          return;
        }
        showToast('Đăng nhập Quản Trị Viên thành công!', 'success');
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập Admin thất bại', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickAdminLogin = async (emailToUse: string, passwordToUse: string) => {
    setIsLoggingIn(true);
    try {
      const success = await login(emailToUse, passwordToUse);
      if (success) {
        const currentUser = await apiService.auth.getCurrentUser();
        if (currentUser?.role !== 'admin') {
          window.alert(
            `🚫 TRUY CẬP BỊ TỪ CHỐI!\n\nTài khoản (${currentUser?.email}) không có quyền Quản Trị.`
          );
          showToast('Tài khoản không có thẩm quyền Quản Trị!', 'error');
          navigate('/', { replace: true });
          return;
        }
        showToast('Đăng nhập Quản Trị Viên thành công!', 'success');
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập Admin thất bại', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Check admin guard - render standalone luxury Admin Login
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#081220] flex flex-col items-center justify-center p-4 sm:p-6 text-white selection:bg-[#D4AF37] selection:text-[#0B192C]">
        <div className="max-w-md w-full mb-4 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Cửa Hàng Bán Lẻ</span>
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white"
          >
            <span>Trang Khách Hàng VIP →</span>
          </Link>
        </div>

        <div className="max-w-md w-full bg-[#0B192C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E3E62] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#F4E8C1] tracking-wide">
              Cổng Quản Trị Hệ Thống 3AE
            </h2>
            <p className="text-xs text-gray-400">
              Trang riêng biệt dành cho Ban Quản Trị & Điều Hành
            </p>
          </div>

          {/* Quick 1-click test button */}
          <div
            onClick={() => handleQuickAdminLogin('admin@3ae.vn', 'Admin@123')}
            className="p-3.5 bg-[#1E3E62]/70 hover:bg-[#1E3E62] rounded-2xl border border-[#D4AF37]/40 space-y-1.5 cursor-pointer transition-colors shadow-inner"
            title="Bấm để đăng nhập nhanh ngay lập tức"
          >
            <div className="flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Đăng Nhập Nhanh 1-Chạm (Khuyên dùng):
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37] text-[#0B192C] font-bold rounded-full">Bấm vào đây</span>
            </div>
            <div className="text-[11px] text-gray-300 font-mono flex justify-between">
              <span>admin@3ae.vn</span>
              <span className="text-gray-300 font-bold">Admin@123</span>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Email Quản Trị Viên</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@3ae.vn"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#142338] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-300">Mật khẩu Admin</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#142338] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoggingIn ? 'Đang xác thực quyền Admin...' : 'Đăng Nhập Cổng Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-gray-800 text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
            >
              ← Trở về giao diện cửa hàng bán lẻ 3AE
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Đã hủy' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Chờ xác nhận').length;
  const totalProductsCount = products.length;

  // Order Status Change
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiService.orders.updateStatus(orderId, newStatus as any);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
      );
      showToast(`Đã cập nhật trạng thái đơn hàng thành "${newStatus}"`, 'success');
    } catch (err) {
      showToast('Cập nhật trạng thái thất bại', 'error');
    }
  };

  // User Role Toggle
  const handleUserRoleToggle = async (targetUser: User) => {
    const newRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    try {
      await apiService.admin.updateUserRole(targetUser._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      showToast(`Đã thay đổi vai trò của ${targetUser.name} thành ${newRole.toUpperCase()}`, 'success');
    } catch (err) {
      showToast('Không thể cập nhật quyền người dùng', 'error');
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      try {
        await apiService.products.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast(`Đã xóa sản phẩm "${name}"`, 'success');
      } catch (err) {
        showToast('Không thể xóa sản phẩm', 'error');
      }
    }
  };

  // Product Save / Update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showToast('Vui lòng nhập tên và giá sản phẩm', 'error');
      return;
    }

    try {
      if (editingProduct._id) {
        // Update
        const res = await apiService.products.update(editingProduct._id, editingProduct);
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? res.data : p))
        );
        showToast('Cập nhật sản phẩm thành công', 'success');
      } else {
        // Create
        const payload: any = {
          ...editingProduct,
          slug: editingProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
          images: editingProduct.images && editingProduct.images.length > 0 
            ? editingProduct.images 
            : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
          rating: 5,
          reviewCount: 0,
          sold: 0,
          inStock: true,
          stock: editingProduct.stock || 10,
        };
        const res = await apiService.products.create(payload);
        setProducts((prev) => [res.data, ...prev]);
        showToast('Thêm sản phẩm mới thành công', 'success');
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      showToast('Lỗi lưu sản phẩm', 'error');
    }
  };

  // Coupon Create
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      const res = await apiService.coupons.create(newCoupon);
      setCoupons((prev) => [...prev, res.data]);
      setCouponModalOpen(false);
      setNewCoupon({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 10000000,
        isActive: true,
      });
      showToast('Tạo mã voucher thành công', 'success');
    } catch (err) {
      showToast('Không thể tạo mã voucher', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#081220] border-r border-[#D4AF37]/30 text-white flex flex-col shrink-0 md:min-h-screen">
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-gray-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1E3E62] border border-[#D4AF37] text-[#D4AF37]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-brand font-bold text-sm tracking-wider text-[#F4E8C1]">3AE ADMIN</div>
            <div className="text-[10px] text-[#D4AF37] font-semibold">Portal Quản Trị v2.4</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {[
            { key: 'overview', label: 'Tổng Quan Doanh Thu', icon: TrendingUp },
            { key: 'products', label: 'Quản Lý Sản Phẩm', icon: Diamond, count: products.length },
            { key: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag, alert: pendingOrdersCount, count: orders.length },
            { key: 'categories', label: 'Danh Mục Hàng Hóa', icon: Package, count: categories.length },
            { key: 'users', label: 'Danh Sách Khách Hàng', icon: Users, count: users.length },
            { key: 'coupons', label: 'Mã Giảm Giá Voucher', icon: Tag, count: coupons.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0B192C] font-bold shadow-md'
                    : 'text-gray-300 hover:bg-[#142338] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B192C]' : 'text-[#D4AF37]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.alert !== undefined && tab.alert > 0 ? (
                  <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                    {tab.alert}
                  </span>
                ) : tab.count !== undefined ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-[#0B192C]/20 text-[#0B192C]' : 'bg-gray-800 text-gray-400'}`}>
                    {tab.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Sidebar User & Logout Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#060D17] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E3E62] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-sm">
              {user.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-gray-400 font-mono truncate">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Xem Shop</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate('/admin');
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E8E2D5] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xs sticky top-0 z-20">
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif text-[#0B192C]">
              {activeTab === 'overview' && 'Tổng Quan Hoạt Động & Doanh Thu'}
              {activeTab === 'products' && 'Quản Lý Danh Sách Sản Phẩm & Kim Cương'}
              {activeTab === 'orders' && 'Quản Lý Đơn Hàng & Trạng Thái Giao Nhận'}
              {activeTab === 'categories' && 'Quản Lý Danh Mục Trang Sức'}
              {activeTab === 'users' && 'Quản Lý Khách Hàng & Phân Quyền'}
              {activeTab === 'coupons' && 'Quản Lý Mã Giảm Giá & Voucher'}
            </h1>
            <p className="text-[11px] text-gray-500">Hệ thống điều hành quản trị độc lập 3AE Diamond</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                loadAllData();
                showToast('Đã làm mới toàn bộ dữ liệu quản trị', 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#997A15]" />
              <span>Làm Mới</span>
            </button>
            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct({});
                  setProductModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Sản Phẩm Mới</span>
              </button>
            )}
            {activeTab === 'coupons' && (
              <button
                onClick={() => setCouponModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Mã Voucher</span>
              </button>
            )}
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
                  <span>Tổng Doanh Thu</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#0B192C]">{formatCurrency(totalRevenue)}</div>
                <div className="text-[11px] text-emerald-600 font-medium">Bao gồm {orders.filter(o => o.status === 'Đã giao hàng').length} đơn hoàn tất</div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
                  <span>Tổng Số Đơn Hàng</span>
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#0B192C]">{totalOrdersCount} Đơn</div>
                <div className="text-[11px] text-amber-600 font-medium">{pendingOrdersCount} đơn đang chờ xác nhận</div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
                  <span>Tổng Sản Phẩm</span>
                  <Diamond className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#0B192C]">{totalProductsCount} Mẫu</div>
                <div className="text-[11px] text-gray-500">100% Kim cương chuẩn GIA</div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase">
                  <span>Thành Viên Khách Hàng</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#0B192C]">{users.length} Khách</div>
                <div className="text-[11px] text-gray-500 font-medium">Đã đăng ký tài khoản VIP</div>
              </div>
            </div>

            {/* Recent orders table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-4">
              <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
                Đơn Hàng Gần Đây Cần Xử Lý
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Mã Đơn</th>
                      <th className="p-3">Khách Hàng</th>
                      <th className="p-3">Tổng Tiền</th>
                      <th className="p-3">Thanh Toán</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3">Ngày Đặt</th>
                      <th className="p-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#FAF8F5]">
                        <td className="p-3 font-mono font-bold text-[#0B192C]">{ord.orderCode}</td>
                        <td className="p-3 font-medium">{ord.shippingAddress.fullName}</td>
                        <td className="p-3 font-bold text-[#997A15]">{formatCurrency(ord.total)}</td>
                        <td className="p-3 uppercase text-[11px]">{ord.paymentMethod}</td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                            className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
                          >
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao hàng">Đã giao hàng</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
                        </td>
                        <td className="p-3 text-gray-500">{formatDate(ord.createdAt)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-semibold"
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Tìm theo tên, SKU, chất liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                id="btn-add-new-product"
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    price: 25000000,
                    material: 'Vàng Trắng 18K',
                    categoryId: categories[0]?._id || 'cat-1',
                    categoryName: categories[0]?.name || 'Nhẫn Kim Cương',
                    stock: 10,
                    sku: `LUM-${Math.floor(1000 + Math.random() * 9000)}`,
                  });
                  setProductModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3E62] flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                Thêm Sản Phẩm Mới
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Ảnh</th>
                    <th className="p-3">Mã SKU</th>
                    <th className="p-3">Tên Sản Phẩm</th>
                    <th className="p-3">Danh Mục</th>
                    <th className="p-3">4C / Chứng Nhận</th>
                    <th className="p-3">Giá Bán</th>
                    <th className="p-3">Kho</th>
                    <th className="p-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products
                    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((prod) => (
                      <tr key={prod._id} className="hover:bg-[#FAF8F5]">
                        <td className="p-3">
                          <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#0B192C]">{prod.sku}</td>
                        <td className="p-3 font-semibold max-w-xs truncate">{prod.name}</td>
                        <td className="p-3 text-gray-600">{prod.categoryName}</td>
                        <td className="p-3 text-[11px] text-gray-500">
                          {prod.carat ? `${prod.carat}ct • ${prod.color}/${prod.clarity} • ${prod.certificate}` : 'Trang sức đính đá'}
                        </td>
                        <td className="p-3 font-bold text-[#997A15]">{formatCurrency(prod.salePrice || prod.price)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-semibold ${prod.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setProductModalOpen(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders List */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
            <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
              Quản Lý Tất Cả Đơn Hàng ({orders.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Mã Đơn</th>
                    <th className="p-3">Khách Hàng & Địa Chỉ</th>
                    <th className="p-3">Sản Phẩm</th>
                    <th className="p-3">Tổng Tiền (Gồm VAT)</th>
                    <th className="p-3">Phương Thức</th>
                    <th className="p-3">Trạng Thái Đơn</th>
                    <th className="p-3">Ngày Đặt</th>
                    <th className="p-3 text-right">Hóa Đơn GTGT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#FAF8F5]">
                      <td className="p-3 font-mono font-bold text-[#0B192C]">{ord.orderCode}</td>
                      <td className="p-3">
                        <div className="font-bold">{ord.shippingAddress?.fullName || ord.customerInfo?.fullName}</div>
                        <div className="text-gray-500 text-[11px]">{ord.shippingAddress?.phone || ord.customerInfo?.phone}</div>
                        <div className="text-gray-400 text-[10px] truncate max-w-xs">
                          {[
                            ord.shippingAddress?.streetAddress || (ord.shippingAddress as any)?.address,
                            ord.shippingAddress?.district,
                            ord.shippingAddress?.province || (ord.shippingAddress as any)?.city
                          ].filter(Boolean).join(', ')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-[11px] text-gray-600">
                          {(ord.items || []).map((i, idx) => (
                            <div key={idx}>• {i.productName || (i as any).name} (x{i.quantity})</div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-[#997A15] font-mono">{formatCurrency(ord.total)}</td>
                      <td className="p-3 uppercase text-[11px]">
                        <span className="px-2 py-0.5 bg-gray-100 rounded font-semibold">{ord.paymentMethod}</span>
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.orderStatus || (ord as any).status}
                          onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                          className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đã xác nhận">Đã xác nhận</option>
                          <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                          <option value="Đang giao hàng">Đang giao hàng</option>
                          <option value="Đã giao hàng">Đã giao hàng</option>
                          <option value="Đã hủy">Đã hủy</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-500 text-[11px]">{formatDate(ord.createdAt)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#FAF8F5] hover:bg-[#0B192C] hover:text-[#F4E8C1] border border-gray-300 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
                          title="In Hóa Đơn VAT Điện Tử"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In Hóa Đơn</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Categories */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
            <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
              Danh Mục Trang Sức & Kim Cương
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 rounded-2xl border border-gray-200 bg-[#FAF8F5] space-y-3">
                  <img src={cat.image} alt="" className="w-full h-32 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-bold text-sm text-[#0B192C]">{cat.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                    <span className="text-[10px] font-mono text-gray-400 block mt-2">Slug: {cat.slug}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
            <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
              Danh Sách Khách Hàng & Quản Trị Viên ({users.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Họ Tên</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Số Điện Thoại</th>
                    <th className="p-3">Vai Trò</th>
                    <th className="p-3 text-right">Phân Quyền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#FAF8F5]">
                      <td className="p-3 font-bold text-gray-900">{u.name}</td>
                      <td className="p-3 font-mono">{u.email}</td>
                      <td className="p-3 text-gray-600">{u.phone || 'Chưa cập nhật'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-[#0B192C] text-[#F4E8C1]' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleUserRoleToggle(u)}
                          className="px-3 py-1.5 bg-[#FAF8F5] border border-gray-300 hover:border-[#D4AF37] rounded-lg text-xs font-semibold transition-colors"
                        >
                          Chuyển sang {u.role === 'admin' ? 'Khách Hàng' : 'Quản Trị Viên'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Coupons */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider">
                Mã Khuyến Mãi & Voucher VIP ({coupons.length})
              </h3>
              <button
                onClick={() => setCouponModalOpen(true)}
                className="px-4 py-2 bg-[#0B192C] text-[#F4E8C1] text-xs font-bold uppercase rounded-xl hover:bg-[#1E3E62] flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                Tạo Mã Giảm Giá
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coupons.map((c) => (
                <div key={c._id} className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#D4AF37]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-[#0B192C]">{c.code}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Đang hoạt động
                    </span>
                  </div>
                  <div className="text-xs text-gray-700">
                    Giảm: <strong className="text-[#997A15]">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}
                    </strong>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Đơn tối thiểu: {formatCurrency(c.minOrderAmount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Product Edit/Create Modal */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-base font-bold font-serif text-[#0B192C]">
                {editingProduct._id ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Tuyệt Tác Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-700">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Danh mục</label>
                  <select
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => {
                      const selectedCat = categories.find((c) => c._id === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categoryId: e.target.value,
                        categoryName: selectedCat?.name || '',
                      });
                    }}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Giá khuyến mãi (Sale VNĐ)</label>
                  <input
                    type="number"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Chất liệu kim loại</label>
                  <input
                    type="text"
                    value={editingProduct.material || 'Vàng Trắng 18K'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Số lượng trong kho</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                {/* 4C parameters */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Carat (ct)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.carat || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, carat: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Nước màu (D, E, F...)</label>
                  <input
                    type="text"
                    value={editingProduct.color || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Độ tinh khiết (VVS1, VS1...)</label>
                  <input
                    type="text"
                    value={editingProduct.clarity || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, clarity: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Chứng nhận (GIA / IGI)</label>
                  <input
                    type="text"
                    value={editingProduct.certificate || 'GIA'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, certificate: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl hover:bg-[#1E3E62]"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold font-serif text-[#0B192C]">Tạo Mã Giảm Giá Mới</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  required
                  placeholder="VÍ DỤ: VIP2026"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Loại chiết khấu</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (VNĐ)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Giá trị chiết khấu *</label>
                <input
                  type="number"
                  required
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Giá trị đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderAmount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl"
                >
                  Tạo Mã
                </button>
              </div>
            </form>
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
      </main>
    </div>
  );
};
