/**
 * Tiện ích kiểm tra và ràng buộc dữ liệu đầu vào
 */

export interface PhoneValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Ràng buộc số điện thoại:
 * - Không được để trống
 * - Không được chứa chữ cái hoặc ký tự đặc biệt (chỉ cho phép các chữ số 0-9)
 * - Phải có đúng 10 chữ số
 * - Phải bắt đầu bằng số 0
 * - Thuộc các đầu số di động hợp lệ tại Việt Nam (03, 05, 07, 08, 09)
 */
export const validatePhoneNumber = (phone: string): PhoneValidationResult => {
  const cleanPhone = (phone || '').trim();

  if (!cleanPhone) {
    return {
      isValid: false,
      message: 'Vui lòng nhập số điện thoại!',
    };
  }

  // Kiểm tra nếu có chứa chữ cái hoặc ký tự đặc biệt
  if (/[^0-9]/.test(cleanPhone)) {
    return {
      isValid: false,
      message: 'Số điện thoại không được chứa chữ cái hoặc ký tự đặc biệt!',
    };
  }

  // Kiểm tra độ dài chính xác 10 chữ số
  if (cleanPhone.length !== 10) {
    return {
      isValid: false,
      message: `Số điện thoại phải có đúng 10 chữ số (hiện tại bạn nhập ${cleanPhone.length} số)!`,
    };
  }

  // Kiểm tra đầu số phải bắt đầu bằng số 0
  if (!cleanPhone.startsWith('0')) {
    return {
      isValid: false,
      message: 'Số điện thoại phải bắt đầu bằng chữ số 0 (ví dụ: 0912345678)!',
    };
  }

  // Kiểm tra các đầu số viễn thông di động hợp lệ tại Việt Nam (03, 05, 07, 08, 09)
  const validPrefixes = ['03', '05', '07', '08', '09'];
  const prefix = cleanPhone.substring(0, 2);
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      message: 'Đầu số điện thoại không hợp lệ! Vui lòng nhập đầu số 03, 05, 07, 08 hoặc 09.',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};
