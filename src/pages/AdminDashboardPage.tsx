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
  Printer,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Unlock,
  KeyRound,
  ShieldAlert
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

  // Customer Management States
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerRoleFilter, setCustomerRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'active' | 'locked'>('all');
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<(Partial<User> & { password?: string }) | null>(null);
  const [customerDetailModalOpen, setCustomerDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Lock / Unlock Modal States
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [userToUnlock, setUserToUnlock] = useState<User | null>(null);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [userToLock, setUserToLock] = useState<User | null>(null);
  const [lockReason, setLockReason] = useState('Vi phạm chính sách bảo mật / gian lận đơn hàng');
  const [customLockReason, setCustomLockReason] = useState('');
  const [isProcessingLockAction, setIsProcessingLockAction] = useState(false);

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
      await apiService.users.update(targetUser._id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      if (selectedCustomer?._id === targetUser._id) {
        setSelectedCustomer({ ...selectedCustomer, role: newRole });
      }
      showToast(`Đã đổi vai trò của ${targetUser.name} thành ${newRole.toUpperCase()}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Không thể cập nhật quyền người dùng', 'error');
    }
  };

  // Mở khóa tài khoản
  const handleOpenUnlockModal = (targetUser: User) => {
    setUserToUnlock(targetUser);
    setUnlockModalOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (!userToUnlock) return;
    setIsProcessingLockAction(true);
    try {
      const res = await apiService.users.unlock(userToUnlock._id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userToUnlock._id
            ? { ...u, status: 'active', isLocked: false, lockReason: undefined, lockedAt: undefined }
            : u
        )
      );
      if (selectedCustomer?._id === userToUnlock._id) {
        setSelectedCustomer({
          ...selectedCustomer,
          status: 'active',
          isLocked: false,
          lockReason: undefined,
          lockedAt: undefined,
        });
      }
      showToast(res.message || `Đã mở khóa tài khoản cho ${userToUnlock.name} thành công!`, 'success');
      setUnlockModalOpen(false);
      setUserToUnlock(null);
    } catch (err: any) {
      showToast(err.message || 'Mở khóa tài khoản thất bại', 'error');
    } finally {
      setIsProcessingLockAction(false);
    }
  };

  // Khóa tài khoản
  const handleOpenLockModal = (targetUser: User) => {
    if (targetUser._id === 'usr-admin' || targetUser.email === 'admin@3ae.vn') {
      window.alert('🚫 Không thể khóa tài khoản Quản Trị Viên gốc của hệ thống!');
      return;
    }
    if (user?._id === targetUser._id) {
      window.alert('🚫 Bạn không thể tự khóa tài khoản quản trị đang đăng nhập!');
      return;
    }
    setUserToLock(targetUser);
    setLockReason('Vi phạm chính sách bảo mật / gian lận đơn hàng');
    setCustomLockReason('');
    setLockModalOpen(true);
  };

  const handleConfirmLock = async () => {
    if (!userToLock) return;
    const finalReason = lockReason === 'Khác' ? customLockReason.trim() || 'Tài khoản bị tạm khóa bởi Quản Trị Viên' : lockReason;
    setIsProcessingLockAction(true);
    try {
      const res = await apiService.users.lock(userToLock._id, finalReason);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userToLock._id
            ? { ...u, status: 'locked', isLocked: true, lockReason: finalReason, lockedAt: new Date().toISOString() }
            : u
        )
      );
      if (selectedCustomer?._id === userToLock._id) {
        setSelectedCustomer({
          ...selectedCustomer,
          status: 'locked',
          isLocked: true,
          lockReason: finalReason,
          lockedAt: new Date().toISOString(),
        });
      }
      showToast(res.message || `Đã khóa tài khoản của ${userToLock.name}!`, 'success');
      setLockModalOpen(false);
      setUserToLock(null);
    } catch (err: any) {
      showToast(err.message || 'Khóa tài khoản thất bại', 'error');
    } finally {
      setIsProcessingLockAction(false);
    }
  };

  // Open Create Customer Modal
  const handleOpenCreateCustomer = () => {
    setEditingCustomer({
      name: '',
      email: '',
      phone: '',
      password: 'Customer@123',
      address: '',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    setCustomerModalOpen(true);
  };

  // Open Edit Customer Modal
  const handleOpenEditCustomer = (customerToEdit: User) => {
    setEditingCustomer({
      ...customerToEdit,
      password: '',
    });
    setCustomerModalOpen(true);
  };

  // Open Customer Detail Modal
  const handleViewCustomerDetail = (targetCustomer: User) => {
    setSelectedCustomer(targetCustomer);
    setCustomerDetailModalOpen(true);
  };

  // Helper: Find orders belonging to a customer
  const getCustomerOrders = (targetUser: User) => {
    return orders.filter(
      (o) =>
        (o.userId && o.userId === targetUser._id) ||
        (o.customerInfo?.email && targetUser.email && o.customerInfo.email.toLowerCase() === targetUser.email.toLowerCase()) ||
        (o.customerInfo?.phone && targetUser.phone && o.customerInfo.phone === targetUser.phone) ||
        (o.shippingAddress?.email && targetUser.email && o.shippingAddress.email.toLowerCase() === targetUser.email.toLowerCase())
    );
  };

  // Helper: Calculate total spent by customer
  const getCustomerTotalSpent = (targetUser: User) => {
    const customerOrders = getCustomerOrders(targetUser);
    return customerOrders
      .filter((o) => o.orderStatus !== 'Đã hủy')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  };

  // Save (Create or Update) Customer
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.name?.trim() || !editingCustomer?.email?.trim()) {
      showToast('Vui lòng nhập đầy đủ Họ tên và Email!', 'error');
      return;
    }

    try {
      if (editingCustomer._id) {
        // Update
        const payload: any = { ...editingCustomer };
        if (!payload.password) delete payload.password;
        const res = await apiService.users.update(editingCustomer._id, payload);
        setUsers((prev) =>
          prev.map((u) => (u._id === editingCustomer._id ? res.data : u))
        );
        if (selectedCustomer?._id === editingCustomer._id) {
          setSelectedCustomer(res.data);
        }
        showToast(`Cập nhật thông tin khách hàng "${res.data.name}" thành công!`, 'success');
      } else {
        // Create
        const res = await apiService.users.create(editingCustomer);
        setUsers((prev) => [res.data, ...prev]);
        showToast(`Thêm khách hàng mới "${res.data.name}" thành công!`, 'success');
      }
      setCustomerModalOpen(false);
      setEditingCustomer(null);
    } catch (err: any) {
      showToast(err.message || 'Thao tác lưu khách hàng không thành công!', 'error');
    }
  };

  // Delete Customer
  const handleDeleteCustomer = async (customerToDelete: User) => {
    if (customerToDelete._id === 'usr-admin' || customerToDelete.email === 'admin@3ae.vn') {
      window.alert('🚫 Không thể xóa tài khoản Quản Trị Viên gốc của hệ thống!');
      return;
    }
    if (user?._id === customerToDelete._id) {
      window.alert('🚫 Bạn không thể tự xóa tài khoản quản trị đang đăng nhập!');
      return;
    }

    if (
      window.confirm(
        `⚠️ BẠN CÓ CHẮC MUỐN XÓA KHÁCH HÀNG NÀY?\n\n• Họ tên: ${customerToDelete.name}\n• Email: ${customerToDelete.email}\n• Số điện thoại: ${customerToDelete.phone || 'N/A'}\n\nDữ liệu sau khi xóa sẽ không thể hoàn tác!`
      )
    ) {
      try {
        await apiService.users.delete(customerToDelete._id);
        setUsers((prev) => prev.filter((u) => u._id !== customerToDelete._id));
        if (selectedCustomer?._id === customerToDelete._id) {
          setCustomerDetailModalOpen(false);
          setSelectedCustomer(null);
        }
        showToast(`Đã xóa khách hàng "${customerToDelete.name}" thành công!`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Không thể xóa khách hàng!', 'error');
      }
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesRole = customerRoleFilter === 'all' || u.role === customerRoleFilter;
    const isUserLocked = u.isLocked || u.status === 'locked';
    const matchesStatus =
      customerStatusFilter === 'all' ||
      (customerStatusFilter === 'locked' && isUserLocked) ||
      (customerStatusFilter === 'active' && !isUserLocked);
    const q = customerSearchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      (u.address && u.address.toLowerCase().includes(q)) ||
      (u.lockReason && u.lockReason.toLowerCase().includes(q));
    return matchesRole && matchesStatus && matchesSearch;
  });

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
            {
              key: 'users',
              label: 'Danh Sách Khách Hàng',
              icon: Users,
              alert: users.filter((u) => u.isLocked || u.status === 'locked').length,
              count: users.length
            },
            { key: 'coupons', label: 'Mã Giảm Giá Voucher', icon: Tag, count: coupons.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
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
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80'}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
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
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'}
                      alt={cat.name}
                      className="w-full h-32 object-cover rounded-xl bg-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
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

          {/* Tab 5: Users / Customer Management */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Top Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0B192C]/5 text-[#0B192C] flex items-center justify-center font-bold">
                    <Users className="w-6 h-6 text-[#997A15]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#0B192C]">{users.length}</div>
                    <div className="text-xs text-gray-500 font-medium">Tổng Tài Khoản Khách Hàng</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#997A15] flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#997A15]">
                      {users.filter((u) => u.role === 'customer').length}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Khách Hàng VIP & Bán Lẻ</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-[#0B192C]">
                      {users.filter((u) => u.role === 'admin').length}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Quản Trị Viên & Điều Hành</div>
                  </div>
                </div>

                {/* Thẻ Thống Kê Tài Khoản Bị Khóa */}
                <div
                  onClick={() => setCustomerStatusFilter(customerStatusFilter === 'locked' ? 'all' : 'locked')}
                  className={`rounded-2xl p-5 border shadow-xs flex items-center gap-4 cursor-pointer transition-all ${customerStatusFilter === 'locked'
                      ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
                      : 'bg-white border-[#E8E2D5] hover:border-rose-300'
                    }`}
                  title="Bấm để lọc nhanh danh sách tài khoản bị khóa"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-serif text-rose-600">
                      {users.filter((u) => u.isLocked || u.status === 'locked').length}
                    </div>
                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <span>Tài Khoản Bị Khóa</span>
                      {users.filter((u) => u.isLocked || u.status === 'locked').length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Thông Báo Có Tài Khoản Cần Mở Khóa */}
              {users.filter((u) => u.isLocked || u.status === 'locked').length > 0 && customerStatusFilter !== 'locked' && (
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-rose-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                        <span>Phát hiện {users.filter((u) => u.isLocked || u.status === 'locked').length} tài khoản khách hàng đang bị khóa</span>
                        <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Cần Kiểm Tra</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Quản trị viên có thể xem nguyên nhân khóa và bấm nút "Mở Khóa" để mở lại quyền truy cập cho khách hàng.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCustomerStatusFilter('locked')}
                    className="px-3.5 py-1.5 bg-[#0B192C] text-[#F4E8C1] hover:bg-[#1E3E62] rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Xem & Mở Khóa Ngay</span>
                  </button>
                </div>
              )}

              {/* Main Content Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E2D5] space-y-6">
                {/* Toolbar: Search, Filter, Add Customer Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#997A15]" />
                      <span>Quản Lý Hồ Sơ Khách Hàng ({filteredUsers.length} / {users.length})</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Tra cứu, cập nhật thông tin cá nhân và theo dõi lịch sử giao dịch mua sắm
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search input */}
                    <div className="relative min-w-[240px] sm:min-w-[280px]">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm tên, email, SĐT, địa chỉ..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                      {customerSearchTerm && (
                        <button
                          onClick={() => setCustomerSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Role filter */}
                    <select
                      value={customerRoleFilter}
                      onChange={(e) => setCustomerRoleFilter(e.target.value as any)}
                      className="p-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">Tất Cả Vai Trò</option>
                      <option value="customer">Khách Hàng</option>
                      <option value="admin">Quản Trị Viên</option>
                    </select>

                    {/* Status filter */}
                    <select
                      value={customerStatusFilter}
                      onChange={(e) => setCustomerStatusFilter(e.target.value as any)}
                      className="p-2 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="all">Tất Cả Trạng Thái</option>
                      <option value="active">Đang Hoạt Động</option>
                      <option value="locked">
                        Đã Bị Khóa ({users.filter((u) => u.isLocked || u.status === 'locked').length})
                      </option>
                    </select>

                    {/* Add Customer Button */}
                    <button
                      onClick={handleOpenCreateCustomer}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#0B192C] text-[#F4E8C1] hover:bg-[#1E3E62] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#D4AF37]" />
                      <span>Thêm Khách Hàng</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3">Khách Hàng</th>
                        <th className="p-3">Thông Tin Liên Hệ</th>
                        <th className="p-3">Địa Chỉ Giao Hàng</th>
                        <th className="p-3 text-center">Đơn Đã Mua</th>
                        <th className="p-3 text-right">Tổng Chi Tiêu</th>
                        <th className="p-3">Vai Trò</th>
                        <th className="p-3">Trạng Thái</th>
                        <th className="p-3 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-400">
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>Không tìm thấy khách hàng nào phù hợp với điều kiện tìm kiếm.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => {
                          const customerOrders = getCustomerOrders(u);
                          const totalSpent = getCustomerTotalSpent(u);
                          const isUserLocked = u.isLocked || u.status === 'locked';
                          return (
                            <tr key={u._id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                    alt={u.name}
                                    className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30 shrink-0 bg-gray-100"
                                    onError={(ev) => {
                                      (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                                    }}
                                  />
                                  <div>
                                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                      <span>{u.name}</span>
                                      {u.role === 'admin' && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" title="Quản Trị Viên" />
                                      )}
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400">ID: {u._id}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3">
                                <div className="font-mono text-gray-800 font-semibold">{u.email}</div>
                                <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span>{u.phone || 'Chưa có SĐT'}</span>
                                </div>
                              </td>

                              <td className="p-3 max-w-xs">
                                <div className="text-gray-600 text-[11px] truncate flex items-start gap-1" title={u.address || 'Chưa cập nhật'}>
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                  <span className="truncate">{u.address || 'Chưa cập nhật'}</span>
                                </div>
                              </td>

                              <td className="p-3 text-center">
                                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full font-bold text-[11px] ${customerOrders.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                  {customerOrders.length} đơn
                                </span>
                              </td>

                              <td className="p-3 text-right font-mono font-bold text-[#997A15]">
                                {totalSpent > 0 ? formatCurrency(totalSpent) : '0 ₫'}
                              </td>

                              <td className="p-3">
                                <button
                                  onClick={() => handleUserRoleToggle(u)}
                                  title="Bấm để chuyển đổi vai trò"
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-transform hover:scale-105 cursor-pointer ${u.role === 'admin' ? 'bg-[#0B192C] text-[#F4E8C1]' : 'bg-amber-100 text-amber-900 border border-amber-200'
                                    }`}
                                >
                                  {u.role === 'admin' ? 'Admin' : 'Khách Hàng VIP'}
                                </button>
                              </td>

                              {/* Cột Trạng Thái Tài Khoản */}
                              <td className="p-3">
                                {isUserLocked ? (
                                  <div className="inline-flex flex-col">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200 shadow-xs">
                                      <Lock className="w-3 h-3 text-rose-600 shrink-0" />
                                      <span>Đã Bị Khóa</span>
                                    </span>
                                    {u.lockReason && (
                                      <span className="text-[10px] text-gray-500 mt-1 max-w-[150px] truncate" title={u.lockReason}>
                                        {u.lockReason}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Hoạt Động</span>
                                  </span>
                                )}
                              </td>

                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Nút Mở Khóa / Khóa Tài Khoản */}
                                  {u.email !== 'admin@3ae.vn' && u._id !== 'usr-admin' && user?._id !== u._id && (
                                    isUserLocked ? (
                                      <button
                                        onClick={() => handleOpenUnlockModal(u)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                                        title="Mở khóa tài khoản khách hàng ngay"
                                      >
                                        <Unlock className="w-3.5 h-3.5" />
                                        <span>Mở Khóa</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleOpenLockModal(u)}
                                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                        title="Tạm khóa tài khoản khách hàng"
                                      >
                                        <Lock className="w-4 h-4" />
                                      </button>
                                    )
                                  )}

                                  {/* Xem Chi Tiết */}
                                  <button
                                    onClick={() => handleViewCustomerDetail(u)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                    title="Xem chi tiết hồ sơ & lịch sử mua hàng"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Chỉnh sửa */}
                                  <button
                                    onClick={() => handleOpenEditCustomer(u)}
                                    className="p-1.5 text-[#997A15] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                    title="Cập nhật thông tin khách hàng"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Xóa */}
                                  {u.email !== 'admin@3ae.vn' && u._id !== 'usr-admin' && (
                                    <button
                                      onClick={() => handleDeleteCustomer(u)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Xóa khách hàng"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
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

                  <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-gray-100">
                    <label className="font-bold text-gray-700 block">
                      Link hình ảnh sản phẩm (Phân cách bằng dấu phẩy hoặc xuống dòng)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      value={editingProduct.images?.join('\n') || ''}
                      onChange={(e) => {
                        const urls = e.target.value.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
                        setEditingProduct({ ...editingProduct, images: urls });
                      }}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono text-[11px] placeholder-gray-400"
                    />
                    <p className="text-[10px] text-gray-500">
                      💡 Khuyên dùng link ảnh chất lượng cao từ Unsplash hoặc link ảnh trực tiếp có đuôi .jpg / .png / .webp
                    </p>
                    {editingProduct.images && editingProduct.images.length > 0 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                        {editingProduct.images.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50 shadow-xs">
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(ev) => {
                                (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white font-mono">
                              Ảnh {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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

        {/* Customer Detail Modal */}
        {customerDetailModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D5] flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="bg-[#0B192C] text-[#F4E8C1] px-6 py-5 flex items-center justify-between border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] bg-white/10 shrink-0"
                    onError={(ev) => {
                      (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div>
                    <h3 className="text-base font-bold font-serif flex items-center gap-2">
                      <span>{selectedCustomer.name}</span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-sans font-bold tracking-wider ${selectedCustomer.role === 'admin' ? 'bg-[#D4AF37] text-[#0B192C]' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                        {selectedCustomer.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng VIP'}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-300 font-mono mt-0.5">Mã tài khoản: {selectedCustomer._id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setCustomerDetailModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200 space-y-3">
                    <h4 className="font-bold font-serif text-[#0B192C] text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                      <UserCheck className="w-4 h-4 text-[#997A15]" />
                      <span>Hồ Sơ Định Danh Khách Hàng</span>
                    </h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-bold text-gray-900 font-mono">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số Điện Thoại:</span>
                        <span className="font-bold text-gray-900 font-mono">{selectedCustomer.phone || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 shrink-0">Địa Chỉ:</span>
                        <span className="font-semibold text-gray-800 text-right pl-4">{selectedCustomer.address || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vai Trò:</span>
                        <span className="font-bold text-[#997A15] uppercase">{selectedCustomer.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng VIP'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Xác thực SĐT:</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã xác minh OTP</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="text-gray-600">{selectedCustomer.createdAt ? formatDate(selectedCustomer.createdAt) : '2026-01-15'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                        <span className="text-gray-500">Trạng Thái:</span>
                        {selectedCustomer.isLocked || selectedCustomer.status === 'locked' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                            <Lock className="w-3 h-3 text-rose-600" />
                            <span>Đã Bị Khóa</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Đang Hoạt Động</span>
                          </span>
                        )}
                      </div>
                      {(selectedCustomer.isLocked || selectedCustomer.status === 'locked') && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 mt-1">
                          <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Lý do khóa tài khoản:</span>
                          </div>
                          <div className="text-rose-700 text-[11px] pl-5">
                            {selectedCustomer.lockReason || 'Khóa theo quyết định của Quản Trị Viên'}
                          </div>
                          {selectedCustomer.lockedAt && (
                            <div className="text-[10px] text-gray-500 pl-5">
                              Thời điểm khóa: {formatDate(selectedCustomer.lockedAt)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Purchase Summary */}
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold font-serif text-[#0B192C] text-sm uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                        <ShoppingBag className="w-4 h-4 text-[#997A15]" />
                        <span>Thống Kê Chi Tiêu & Giao Dịch</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                          <div className="text-2xl font-bold font-serif text-[#0B192C]">
                            {getCustomerOrders(selectedCustomer).length}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">Tổng Đơn Đã Đặt</div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
                          <div className="text-base sm:text-lg font-bold font-serif text-[#997A15] font-mono">
                            {formatCurrency(getCustomerTotalSpent(selectedCustomer))}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">Tổng Đã Chi Tiêu</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#997A15] shrink-0" />
                      <span>Hạng thẻ: <strong>Hội Viên Kim Cương VIP</strong> (Được hưởng ưu đãi bảo dưỡng và quà tặng sinh nhật).</span>
                    </div>
                  </div>
                </div>

                {/* Order History Table */}
                <div className="space-y-3">
                  <h4 className="font-bold font-serif text-[#0B192C] text-sm uppercase tracking-wider">
                    Lịch Sử Các Đơn Hàng Gần Nhất ({getCustomerOrders(selectedCustomer).length})
                  </h4>

                  {getCustomerOrders(selectedCustomer).length === 0 ? (
                    <div className="p-6 text-center bg-[#FAF8F5] rounded-2xl border border-gray-200 text-gray-400">
                      <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>Khách hàng này hiện chưa thực hiện giao dịch đơn hàng nào.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#FAF8F5] text-gray-700 uppercase font-bold border-b border-gray-200">
                          <tr>
                            <th className="p-2.5">Mã Đơn</th>
                            <th className="p-2.5">Sản Phẩm</th>
                            <th className="p-2.5 text-right">Tổng Tiền</th>
                            <th className="p-2.5">Trạng Thái</th>
                            <th className="p-2.5">Ngày Đặt</th>
                            <th className="p-2.5 text-center">Hóa Đơn</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {getCustomerOrders(selectedCustomer).map((ord) => (
                            <tr key={ord._id} className="hover:bg-gray-50">
                              <td className="p-2.5 font-mono font-bold text-[#0B192C]">{ord.orderCode}</td>
                              <td className="p-2.5 text-gray-600 max-w-xs truncate">
                                {(ord.items || []).map((i) => i.productName).join(', ')}
                              </td>
                              <td className="p-2.5 text-right font-bold text-[#997A15] font-mono">
                                {formatCurrency(ord.total)}
                              </td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-700">
                                  {ord.orderStatus}
                                </span>
                              </td>
                              <td className="p-2.5 text-gray-500">{formatDate(ord.createdAt)}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  onClick={() => {
                                    setCustomerDetailModalOpen(false);
                                    setInvoiceOrder(ord);
                                  }}
                                  className="p-1 hover:text-[#D4AF37] font-semibold text-[11px] underline cursor-pointer"
                                >
                                  Xem Hóa Đơn
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#FAF8F5] px-6 py-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomerDetailModalOpen(false);
                      handleOpenEditCustomer(selectedCustomer);
                    }}
                    className="px-4 py-2 bg-white border border-[#D4AF37] text-[#997A15] font-bold rounded-xl hover:bg-[#FAF8F5] flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Chỉnh Sửa Hồ Sơ</span>
                  </button>

                  {/* Nút Mở Khóa / Khóa trực tiếp trong Modal Chi Tiết */}
                  {selectedCustomer.email !== 'admin@3ae.vn' && selectedCustomer._id !== 'usr-admin' && user?._id !== selectedCustomer._id && (
                    (selectedCustomer.isLocked || selectedCustomer.status === 'locked') ? (
                      <button
                        onClick={() => {
                          handleOpenUnlockModal(selectedCustomer);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
                      >
                        <Unlock className="w-4 h-4" />
                        <span>Mở Khóa Tài Khoản Này</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleOpenLockModal(selectedCustomer);
                        }}
                        className="px-4 py-2 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Khóa Tài Khoản</span>
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setCustomerDetailModalOpen(false)}
                  className="px-5 py-2 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Form Modal (Create / Edit) */}
        {customerModalOpen && editingCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-[#E8E2D5]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base font-bold font-serif text-[#0B192C] uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#997A15]" />
                  <span>{editingCustomer._id ? 'Cập Nhật Thông Tin Khách Hàng' : 'Thêm Khách Hàng Mới'}</span>
                </h3>
                <button
                  onClick={() => setCustomerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 block">Họ và Tên *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={editingCustomer.name || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 block">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 block">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0988776655"
                      value={editingCustomer.phone || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 block">Phân Quyền Vai Trò</label>
                    <select
                      value={editingCustomer.role || 'customer'}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, role: e.target.value as any })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-semibold focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="customer">Khách Hàng VIP</option>
                      <option value="admin">Quản Trị Viên (Admin)</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 block">
                      {editingCustomer._id ? 'Mật Khẩu Mới (Để trống nếu không đổi)' : 'Mật Khẩu *'}
                    </label>
                    <input
                      type="text"
                      required={!editingCustomer._id}
                      placeholder={editingCustomer._id ? '••••••••' : 'Customer@123'}
                      value={editingCustomer.password || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, password: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 block">Địa Chỉ Giao Hàng</label>
                    <input
                      type="text"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      value={editingCustomer.address || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 block">Link Ảnh Đại Diện (Avatar URL)</label>
                    <div className="flex gap-3 items-center">
                      <img
                        src={editingCustomer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 shrink-0 bg-gray-100"
                        onError={(ev) => {
                          (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={editingCustomer.avatar || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, avatar: e.target.value })}
                        className="w-full p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                  {/* Account Status (Khi chỉnh sửa khách hàng) */}
                  {editingCustomer._id && editingCustomer._id !== 'usr-admin' && editingCustomer.email !== 'admin@3ae.vn' && user?._id !== editingCustomer._id && (
                    <div className="space-y-1 sm:col-span-2 p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200">
                      <label className="font-bold text-gray-700 block mb-2">Trạng Thái Quyền Truy Cập</label>
                      <div className="flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="customerFormStatus"
                            checked={!editingCustomer.isLocked && editingCustomer.status !== 'locked'}
                            onChange={() => setEditingCustomer({ ...editingCustomer, status: 'active', isLocked: false, lockReason: '' })}
                            className="accent-emerald-600"
                          />
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đang Hoạt Động (Mở Khóa)</span>
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="customerFormStatus"
                            checked={editingCustomer.isLocked || editingCustomer.status === 'locked'}
                            onChange={() => setEditingCustomer({ ...editingCustomer, status: 'locked', isLocked: true, lockReason: editingCustomer.lockReason || 'Khóa bởi Quản trị viên' })}
                            className="accent-rose-600"
                          />
                          <span className="text-rose-700 font-bold flex items-center gap-1 text-xs">
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            <span>Tạm Khóa Tài Khoản</span>
                          </span>
                        </label>
                      </div>

                      {(editingCustomer.isLocked || editingCustomer.status === 'locked') && (
                        <div className="pt-2">
                          <label className="text-[11px] font-semibold text-gray-600 block">Lý do khóa tài khoản:</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Vi phạm điều khoản, gian lận đơn hàng..."
                            value={editingCustomer.lockReason || ''}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, lockReason: e.target.value })}
                            className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-rose-400"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomerModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0B192C] text-[#F4E8C1] font-bold rounded-xl hover:bg-[#1E3E62] transition-colors cursor-pointer"
                  >
                    {editingCustomer._id ? 'Lưu Thay Đổi' : 'Tạo Khách Hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 1. Modal Xác Nhận Mở Khóa Tài Khoản */}
        {unlockModalOpen && userToUnlock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D5] flex flex-col">
              {/* Header */}
              <div className="bg-[#0B192C] text-[#F4E8C1] px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/30">
                <h3 className="text-base font-bold font-serif flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-emerald-400" />
                  <span>Mở Khóa Quyền Truy Cập</span>
                </h3>
                <button
                  onClick={() => setUnlockModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs text-gray-700">
                <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-2xl border border-gray-200">
                  <img
                    src={userToUnlock.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={userToUnlock.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 bg-gray-100 shrink-0"
                    onError={(ev) => {
                      (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{userToUnlock.name}</div>
                    <div className="font-mono text-gray-600 truncate">{userToUnlock.email}</div>
                    <div className="text-[11px] text-gray-500">{userToUnlock.phone || 'Chưa có SĐT'}</div>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 space-y-1.5">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Thông tin trạng thái khóa:</span>
                  </div>
                  <div className="text-gray-700 pl-5 leading-relaxed">
                    Lý do: <span className="font-semibold text-rose-800">{userToUnlock.lockReason || 'Khóa bởi Quản trị viên'}</span>
                  </div>
                  {userToUnlock.lockedAt && (
                    <div className="text-[11px] text-gray-500 pl-5">
                      Thời điểm khóa: {formatDate(userToUnlock.lockedAt)}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hiệu lực sau khi mở khóa:</span>
                  </div>
                  <p className="pl-5 text-emerald-800">
                    Khách hàng sẽ có thể đăng nhập bình thường vào hệ thống, tiếp tục đặt hàng và hưởng trọn vẹn đặc quyền hội viên VIP.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#FAF8F5] px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setUnlockModalOpen(false)}
                  disabled={isProcessingLockAction}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUnlock}
                  disabled={isProcessingLockAction}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-xs shadow-md"
                >
                  {isProcessingLockAction ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Mở Khóa...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Xác Nhận Mở Khóa Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Modal Khóa Tài Khoản */}
        {lockModalOpen && userToLock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D5] flex flex-col">
              {/* Header */}
              <div className="bg-[#0B192C] text-[#F4E8C1] px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/30">
                <h3 className="text-base font-bold font-serif flex items-center gap-2">
                  <Lock className="w-5 h-5 text-rose-400" />
                  <span>Tạm Khóa Tài Khoản Khách Hàng</span>
                </h3>
                <button
                  onClick={() => setLockModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs text-gray-700">
                <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-2xl border border-gray-200">
                  <img
                    src={userToLock.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={userToLock.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40 bg-gray-100 shrink-0"
                    onError={(ev) => {
                      (ev.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{userToLock.name}</div>
                    <div className="font-mono text-gray-600 truncate">{userToLock.email}</div>
                    <div className="text-[11px] text-gray-500">{userToLock.phone || 'Chưa có SĐT'}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-gray-900 block">Lý do khóa tài khoản *</label>
                  {[
                    'Vi phạm chính sách đặt hàng / bom hàng nhiều lần',
                    'Nghi vấn bảo mật / gian lận giao dịch thẻ',
                    'Đăng nhập bất thường nhiều lần từ địa chỉ IP lạ',
                    'Yêu cầu tạm ngưng dịch vụ từ chính chủ tài khoản',
                    'Khác',
                  ].map((r) => (
                    <label key={r} className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-gray-200 cursor-pointer">
                      <input
                        type="radio"
                        name="lockReason"
                        checked={lockReason === r}
                        onChange={() => setLockReason(r)}
                        className="accent-[#D4AF37]"
                      />
                      <span className="text-gray-700 font-medium">{r}</span>
                    </label>
                  ))}

                  {lockReason === 'Khác' && (
                    <input
                      type="text"
                      placeholder="Nhập chi tiết lý do tạm khóa..."
                      value={customLockReason}
                      onChange={(e) => setCustomLockReason(e.target.value)}
                      className="w-full mt-2 p-2.5 bg-[#FAF8F5] border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#D4AF37]"
                      autoFocus
                    />
                  )}
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Khi bị khóa, khách hàng sẽ bị chặn đăng nhập và nhận được thông báo kèm lý do đã chọn. Bạn có thể mở khóa bất cứ lúc nào.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#FAF8F5] px-6 py-4 border-t border-gray-200 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLockModalOpen(false)}
                  disabled={isProcessingLockAction}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLock}
                  disabled={isProcessingLockAction}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer text-xs shadow-md"
                >
                  {isProcessingLockAction ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Khóa...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Xác Nhận Khóa Tài Khoản</span>
                    </>
                  )}
                </button>
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
      </main>
    </div>
  );
};
