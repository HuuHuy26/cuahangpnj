import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface WishlistContextType {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_KEY = 'lumiere_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item._id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product._id)) {
      setFavorites((prev) => prev.filter((i) => i._id !== product._id));
      showToast(`Đã xóa "${product.name}" khỏi danh sách yêu thích`, 'info');
    } else {
      setFavorites((prev) => [...prev, product]);
      showToast(`Đã thêm "${product.name}" vào danh sách yêu thích`, 'success');
    }
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter((i) => i._id !== productId));
    showToast('Đã xóa khỏi danh sách yêu thích', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFromFavorites,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
