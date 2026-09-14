import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Diamond,
  Gem
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { handleAdminPortalAccess } from '../../utils/adminGuard';

export const Header: React.FC = () => {
  const { user, isAdmin, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const { itemCount, subtotal } = useCart();
  const { favorites } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // Live search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        const res = await apiService.products.getAll({ search: searchQuery.trim(), limit: 5 });
        setSearchSuggestions(res.data);
        setShowSearchDropdown(true);
      } else {
        setSearchSuggestions([]);
        setShowSearchDropdown(false);
      }
    };
    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Kim Cương Viên', path: '/diamonds', highlight: true },
    { name: 'Nhẫn Kim Cương', path: '/products?category=nhan-kim-cuong-nu' },
    { name: 'Trang Sức Cưới', path: '/products?category=trang-suc-cuoi' },
    { name: 'Bộ Sưu Tập', path: '/products' },
    { name: 'Chuẩn 4C', path: '/4c-standards' },
    { name: 'Tin Tức & Cẩm Nang', path: '/news' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#003366] text-white text-[10px] uppercase tracking-[0.2em] py-2 px-4 border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-[#C5A059] animate-pulse" />
              100% Kim Cương Tự Nhiên Kiểm Định GIA & IGI Toàn Cầu
            </span>
            <span className="hidden md:inline-block text-[#C5A059]/50">•</span>
            <span className="hidden md:inline-block">Miễn phí giao hàng toàn quốc từ 5.000.000đ</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:1800545457" className="hover:text-[#C5A059] flex items-center gap-1 transition-colors">
              <PhoneCall className="w-3 h-3 text-[#C5A059]" /> Hotline: <span className="font-semibold">1800 5454 57</span>
            </a>
            <button
              onClick={() => handleAdminPortalAccess(user, isAuthenticated, navigate, showToast)}
              className="hidden sm:inline-flex items-center gap-1.5 text-gray-300 hover:text-[#C5A059] transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs"
              title="Cổng Quản Trị Hệ Thống"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Cổng Quản Trị →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`bg-white/95 backdrop-blur-md transition-shadow duration-300 ${isScrolled ? 'shadow-sm border-b border-[#E5E2D9]' : 'border-b border-[#E5E2D9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Mobile Menu Button */}
            <button
              id="btn-toggle-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#003366] hover:text-[#C5A059] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex flex-col items-center group py-2">
              <div className="flex items-center gap-1.5">
                <Gem className="w-6 h-6 text-[#C5A059] group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#003366]">
                  3AE
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-[0.4em] text-[#C5A059] font-semibold uppercase -mt-0.5">
                Diamond & Fine Jewelry
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div ref={searchRef} className="hidden lg:block relative w-72 xl:w-88">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kim cương GIA, nhẫn cưới, mã SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                    className="w-full pl-9 pr-9 py-2 bg-[#FAF9F6] border border-[#E5E2D9] rounded-none text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
                  />
                  <Search className="w-4 h-4 text-[#003366] absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {showSearchDropdown && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-[#E5E2D9] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-[#E5E2D9] bg-[#FAF9F6] text-[10px] font-semibold text-[#003366] uppercase tracking-wider">
                    Gợi ý sản phẩm ({searchSuggestions.length})
                  </div>
                  <div className="divide-y divide-[#E5E2D9] max-h-80 overflow-y-auto">
                    {searchSuggestions.map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-[#FAF9F6] transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover border border-[#E5E2D9]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#C5A059]">
                              {formatCurrency(product.salePrice || product.price)}
                            </span>
                            {product.certificate && (
                              <span className="text-[9px] bg-[#003366] text-white px-1.5 py-0.5">
                                {product.certificate}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 bg-[#FAF9F6] text-center border-t border-[#E5E2D9]">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs text-[#003366] font-semibold hover:text-[#C5A059]"
                    >
                      Xem tất cả kết quả cho "{searchQuery}" →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Wishlist Icon */}
              <Link
                to="/account?tab=wishlist"
                className="relative p-2 text-[#003366] hover:text-[#C5A059] transition-colors"
                title="Sản phẩm yêu thích"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C5A059] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 text-[#003366] hover:text-[#C5A059] transition-colors flex items-center gap-2"
                title="Giỏ hàng"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#003366] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-gray-400 leading-none uppercase tracking-wider">Giỏ hàng</span>
                  <span className="text-xs font-bold text-[#003366]">{formatCurrency(subtotal)}</span>
                </div>
              </Link>

              {/* Account Dropdown */}
              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <button
                    id="btn-account-menu"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#C5A059]"
                    />
                    <span className="hidden md:inline-block text-xs font-medium text-[#003366] max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#003366] hover:text-[#C5A059] px-3.5 py-1.5 border border-[#003366] hover:border-[#C5A059] transition-all"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Đăng nhập</span>
                  </Link>
                )}

                {/* Account Dropdown Menu */}
                {accountMenuOpen && isAuthenticated && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl border border-[#E5E2D9] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-[#E5E2D9]">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 ${isAdmin ? 'bg-[#003366] text-[#C5A059]' : 'bg-[#FAF9F6] text-[#003366] border border-[#E5E2D9]'
                        }`}>
                        {isAdmin ? 'Quản trị viên (Admin)' : 'Thành viên VIP'}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          handleAdminPortalAccess(user, isAuthenticated, navigate, showToast);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#003366] font-semibold hover:bg-[#FAF9F6] hover:text-[#C5A059] transition-colors text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#C5A059]" />
                        Trang Quản Trị (Admin)
                      </button>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF9F6] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#003366]" />
                      Tài khoản của tôi
                    </Link>

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF9F6] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#003366]" />
                      Lịch sử đơn hàng
                    </Link>

                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[#FAF9F6] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#003366]" />
                      Danh sách yêu thích ({favorites.length})
                    </Link>

                    <div className="border-t border-[#E5E2D9] my-1"></div>

                    <button
                      id="btn-logout"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-[#E5E2D9] text-[11px] font-semibold uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 relative ${location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
                    ? 'text-[#C5A059] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C5A059]'
                    : 'text-[#003366] hover:text-[#C5A059]'
                  } ${link.highlight ? 'font-bold flex items-center gap-1' : ''}`}
              >
                {link.highlight && <Diamond className="w-3 h-3 text-[#C5A059]" />}
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-black/50 backdrop-blur-xs z-50 animate-in fade-in duration-200">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mb-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kim cương, nhẫn cưới..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                        ? 'bg-[#FAF8F5] text-[#997A15] font-semibold border-l-2 border-[#D4AF37]'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 my-4 pt-4">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAdminPortalAccess(user, isAuthenticated, navigate, showToast);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0B192C] font-semibold bg-amber-50 rounded-lg mb-2 text-left cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
                    Quản trị viên (Admin)
                  </button>
                )}
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Hồ sơ & Đơn hàng của tôi
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-[#997A15] font-semibold"
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
              <p>Hotline tư vấn: 1800 6868 (Miễn phí)</p>
              <p className="mt-1">3AE Diamond & Fine Jewelry</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
