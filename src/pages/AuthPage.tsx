import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Gem,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { handleAdminPortalAccess } from '../utils/adminGuard';
import { validatePhoneNumber } from '../utils/validators';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Login & Register Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Forgot Password fields
  const [resetTarget, setResetTarget] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Countdown
  const [countdown, setCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (target: string, type: 'REGISTER' | 'RESET_PASSWORD') => {
    if (type === 'REGISTER') {
      const validation = validatePhoneNumber(target);
      if (!validation.isValid) {
        setPhoneError(validation.message);
        showToast(validation.message, 'error');
        return;
      }
      setPhoneError('');
    } else {
      if (!target.trim()) {
        showToast('Vui lòng nhập Số điện thoại hoặc Email để nhận mã OTP', 'error');
        return;
      }
    }

    setIsSendingOtp(true);
    try {
      const res = await apiService.auth.sendOtp(target, type);
      setCountdown(30);
      showToast(res.message || 'Mã OTP 6 số đã được gửi!', 'success');

      // Notify demo OTP on screen for testing ease
      if (res.otpDemo) {
        showToast(`[MÃ OTP MÔ PHỎNG]: ${res.otpDemo} (Hết hạn sau 5 phút)`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Không thể gửi mã OTP', 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        const currentUser = await apiService.auth.getCurrentUser();
        if (currentUser?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from === '/admin' ? '/' : from, { replace: true });
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email & mật khẩu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      showToast('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email', 'error');
      return;
    }

    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      setPhoneError(validation.message);
      showToast(validation.message, 'error');
      return;
    }

    if (!otpCode.trim()) {
      showToast('Vui lòng bấm "Nhận mã OTP" và nhập mã xác thực 6 số để đăng ký!', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Mật khẩu phải có tối thiểu 6 ký tự', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        name,
        email,
        password,
        phone,
        otp: otpCode
      } as any);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      showToast(err.message || 'Đăng ký thất bại.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget.trim() || !resetOtp.trim() || !newPassword.trim()) {
      showToast('Vui lòng điền đầy đủ SĐT/Email, Mật khẩu mới , Mã OTP', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiService.auth.resetPassword(resetTarget, resetOtp, newPassword);
      showToast(res.message || 'Đổi mật khẩu thành công! Quý khách có thể đăng nhập ngay.', 'success');
      setMode('login');
      setEmail(resetTarget);
      setPassword(newPassword);
    } catch (err: any) {
      showToast(err.message || 'Xác thực OTP hoặc đổi mật khẩu thất bại', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Top Header Links */}
      <div className="max-w-md w-full mb-4 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003366] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ cửa hàng</span>
        </Link>
        <button
          onClick={() => handleAdminPortalAccess(user, isAuthenticated, navigate, showToast)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#003366] transition-colors cursor-pointer bg-transparent border-0 p-0"
          title="Cổng Quản Trị Hệ Thống"
        >
          <span>Cổng Quản Trị Hệ Thống →</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <Gem className="w-8 h-8 text-[#C5A059]" />
            <span className="font-brand text-2xl font-bold tracking-[0.2em] text-[#003366]">3AE</span>
          </Link>
          <h2 className="text-xl font-bold font-serif text-[#003366]">
            {mode === 'login' && 'Đăng Nhập Khách Hàng VIP'}
            {mode === 'register' && 'Đăng Ký Thành Viên 3AE (Xác Thực OTP)'}
            {mode === 'forgot_password' && 'Khôi Phục & Đổi Mật Khẩu Qua OTP'}
          </h2>
          <p className="text-xs text-gray-500">
            Đặc quyền bảo dưỡng trang sức trọn đời và tích lũy điểm thưởng VIP
          </p>
        </div>

        {/* Quick Demo Login Card (only in login mode) */}
        {mode === 'login' && (
          <div className="p-4 bg-white rounded-2xl border border-[#C5A059]/40 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#003366]">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Tài Khoản Trải Nghiệm :</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickAccount('huuhuy123@gmail.com', 'Huy@123')}
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200 text-left hover:border-[#C5A059] transition-all cursor-pointer"
              >
                <div className="font-bold text-[#003366] truncate">Khách Hàng</div>
                <div className="text-[10px] text-gray-500 font-mono">huuhuy123@gmail.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@3ae.vn', 'Admin@123')}
                className="p-2.5 rounded-xl bg-[#003366]/5 border border-gray-200 text-left hover:border-[#003366] transition-all cursor-pointer"
              >
                <div className="font-bold text-[#003366] truncate">Quản Trị Viên</div>
                <div className="text-[10px] text-gray-500 font-mono">admin@3ae.vn</div>
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E5E2D9] space-y-6">

          {/* Mode Switch Tabs */}
          {mode !== 'forgot_password' ? (
            <div className="flex p-1 bg-[#FAF8F5] rounded-2xl border border-gray-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${mode === 'login'
                  ? 'bg-[#003366] text-[#F4E8C1] shadow-xs'
                  : 'text-gray-600 hover:text-[#003366]'
                  }`}
              >
                Đăng Nhập
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${mode === 'register'
                  ? 'bg-[#003366] text-[#F4E8C1] shadow-xs'
                  : 'text-gray-600 hover:text-[#003366]'
                  }`}
              >
                Đăng Ký (OTP)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">Đặt Lại Mật Khẩu</span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[#C5A059] font-bold hover:underline cursor-pointer"
              >
                ← Quay lại Đăng nhập
              </button>
            </div>
          )}

          {/* Form 1: Login */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Email hoặc Số điện thoại</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="email@example.com hoặc 0901234567"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-gray-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] text-[#C5A059] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#003366] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#002244] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Register with OTP */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 text-xs animate-in fade-in">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Họ và tên *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Số điện thoại (10 chữ số) *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="0912345678"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhone(val);
                        if (val.trim()) {
                          const v = validatePhoneNumber(val);
                          setPhoneError(v.isValid ? '' : v.message);
                        } else {
                          setPhoneError('');
                        }
                      }}
                      className={`w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border rounded-xl focus:outline-none ${
                        phoneError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#C5A059]'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    disabled={countdown > 0 || isSendingOtp || !phone.trim()}
                    onClick={() => handleSendOtp(phone, 'REGISTER')}
                    className="px-3.5 py-3 bg-[#003366] text-[#F4E8C1] rounded-xl font-bold whitespace-nowrap hover:bg-[#002244] disabled:opacity-50 cursor-pointer"
                  >
                    {countdown > 0 ? `${countdown}s` : isSendingOtp ? 'Đang gửi...' : 'Nhận mã OTP'}
                  </button>
                </div>
                {phoneError && (
                  <p className="text-[11px] text-red-500 font-medium">{phoneError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Địa chỉ Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Mật khẩu *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />

                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-700">Mã xác thực OTP</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Nhập 6 số OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl font-mono text-sm tracking-widest focus:outline-none focus:border-[#C5A059]"
                      />
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#C5A059] to-[#997A15] text-[#003366] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang tạo tài khoản...' : 'Kích Hoạt & Đăng Ký Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 3: Forgot Password with OTP */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs animate-in fade-in">
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Nhập Số điện thoại hoặc Email đã đăng ký tài khoản. Hệ thống 3AE sẽ gửi mã OTP 6 số để bạn thiết lập mật khẩu mới.
              </p>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Số điện thoại hoặc Email *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      placeholder="0912345678 hoặc email@example.com"
                      value={resetTarget}
                      onChange={(e) => setResetTarget(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="button"
                    disabled={countdown > 0 || isSendingOtp || !resetTarget.trim()}
                    onClick={() => handleSendOtp(resetTarget, 'RESET_PASSWORD')}
                    className="px-3.5 py-3 bg-[#003366] text-[#F4E8C1] rounded-xl font-bold whitespace-nowrap hover:bg-[#002244] disabled:opacity-50 cursor-pointer"
                  >
                    {countdown > 0 ? `${countdown}s` : isSendingOtp ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Mã xác thực OTP*</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Nhập 6 số OTP"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl font-mono text-sm tracking-widest focus:outline-none focus:border-[#C5A059]"
                  />
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
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
                    className="w-full pl-9 pr-10 py-3 bg-[#FAF8F5] border border-gray-200 rounded-xl focus:outline-none focus:border-[#C5A059]"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                disabled={isLoading}
                className="w-full py-3.5 bg-[#003366] text-[#F4E8C1] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#002244] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Đang cập nhật mật khẩu...' : 'Xác Nhận & Đổi Mật Khẩu'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
