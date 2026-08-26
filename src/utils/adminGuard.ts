import { User } from '../types';
import { NavigateFunction } from 'react-router-dom';

/**
 * Kiểm tra phân quyền truy cập Cổng Quản Trị (Admin Portal).
 * - Nếu chưa đăng nhập: Alert thông báo cần đăng nhập tài khoản Quản Trị Viên & chuyển tới trang đăng nhập.
 * - Nếu là khách hàng / VIP (không phải admin): Alert thông báo từ chối truy cập vì không đủ thẩm quyền.
 * - Nếu là admin: Cho phép chuyển trang đến /admin.
 */
export const handleAdminPortalAccess = (
  user: User | null,
  isAuthenticated: boolean,
  navigate: NavigateFunction,
  showToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
): boolean => {
  if (!isAuthenticated || !user) {
    window.alert(
      '⚠️ YÊU CẦU ĐĂNG NHẬP!\n\nBạn cần đăng nhập tài khoản Quản Trị Viên (Admin) để có quyền truy cập Cổng Quản Trị.'
    );
    if (showToast) {
      showToast('Vui lòng đăng nhập tài khoản Quản trị viên', 'warning');
    }
    navigate('/auth?redirect=/admin');
    return false;
  }

  if (user.role !== 'admin') {
    window.alert(
      `🚫 TRUY CẬP BỊ TỪ CHỐI!\n\nTài khoản của bạn (${user.name || user.email} - Khách Hàng VIP) không có đủ thẩm quyền để truy cập Cổng Quản Trị.\n\nCổng này chỉ dành riêng cho Ban Quản Trị Hệ Thống.`
    );
    if (showToast) {
      showToast('Bạn không có đủ thẩm quyền truy cập Cổng Quản Trị!', 'error');
    }
    return false;
  }

  // Là Quản Trị Viên hợp lệ
  navigate('/admin');
  return true;
};
