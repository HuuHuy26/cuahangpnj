import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  appliedCoupon: Coupon | null;
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedMaterial?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'lumiere_cart_items';
const COUPON_STORAGE_KEY = 'lumiere_cart_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = (subtotal * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
      } else {
        discount = appliedCoupon.discountValue;
      }
    }
  }

  // Free shipping on luxury orders over 50.000.000 VNĐ
  const shippingFee = items.length > 0 ? (subtotal > 50000000 ? 0 : 150000) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (product: Product, quantity = 1, selectedSize?: string, selectedMaterial?: string) => {
    if (product.stock <= 0) {
      showToast('Sản phẩm tạm thời hết hàng!', 'error');
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product._id === product._id && i.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const newQty = prev[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex].quantity = newQty;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: Math.min(quantity, product.stock),
          selectedSize: selectedSize || product.size || (product.availableSizes ? product.availableSizes[0] : undefined),
          selectedMaterial: selectedMaterial || product.material,
        },
      ];
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product._id === productId && item.selectedSize === selectedSize) {
          if (quantity > item.product.stock) {
            showToast(`Rất tiếc, kho chỉ còn ${item.product.stock} sản phẩm!`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product._id === productId && i.selectedSize === selectedSize))
    );
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) {
      showToast('Vui lòng nhập mã giảm giá', 'error');
      return false;
    }
    try {
      const res = await apiService.coupons.check(code, subtotal);
      setAppliedCoupon(res.data.coupon);
      showToast(`Áp dụng mã ${code.toUpperCase()} thành công!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Mã giảm giá không hợp lệ', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Đã hủy áp dụng mã giảm giá', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        total,
        appliedCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
