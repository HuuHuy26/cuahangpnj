import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    nameOrData: string | { name: string; email: string; phone: string; password: string },
    email?: string,
    phone?: string,
    password?: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  switchDemoRole: (role: 'admin' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await apiService.auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to get current user', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiService.auth.login({ email, password });
      setUser(res.data.user);
      showToast(`Chào mừng ${res.data.user.name} trở lại với 3AE!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Đăng nhập thất bại', 'error');
      return false;
    }
  };

  const register = async (
    nameOrData: string | { name: string; email: string; phone: string; password: string },
    email?: string,
    phone?: string,
    password?: string
  ): Promise<boolean> => {
    try {
      const payload = typeof nameOrData === 'object'
        ? nameOrData
        : { name: nameOrData, email: email!, phone: phone!, password: password! };
      const res = await apiService.auth.register(payload);
      setUser(res.data.user);
      showToast('Đăng ký tài khoản thành viên thành công!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Đăng ký tài khoản thành viên thất bại', 'error');
      return false;
    }
  };

  const logout = async () => {
    await apiService.auth.logout();
    setUser(null);
    showToast('Bạn đã đăng xuất tài khoản', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await apiService.auth.updateProfile(user._id, data);
      setUser(res.data);
      showToast('Cập nhật hồ sơ thành công!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Cập nhật hồ sơ thất bại', 'error');
      return false;
    }
  };

  const switchDemoRole = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@3ae.vn', 'Admin@123');
    } else {
      await login('khachhang@gmail.com', 'Customer@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
