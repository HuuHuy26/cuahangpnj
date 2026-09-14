import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_KEY = 'lumiere_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | undefined>(user?._id);

  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  // Load saved wishlist for user when logging in
  useEffect(() => {
    if (user?._id && user._id !== prevUserIdRef.current) {
      try {
        const savedUserWishlist = localStorage.getItem(`lumiere_wishlist_${user._id}`);
        if (savedUserWishlist) {
          const parsed = JSON.parse(savedUserWishlist);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFavorites(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    prevUserIdRef.current = user?._id;
  }, [user]);

  // Handle logout event: clean up wishlist completely
  useEffect(() => {
    const handleLogout = () => {
      setFavorites([]);
      localStorage.removeItem(WISHLIST_KEY);
    };

    window.addEventListener('lumiere:logout', handleLogout);
    return () => {
      window.removeEventListener('lumiere:logout', handleLogout);
    };
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(favorites));
      if (user?._id) {
        localStorage.setItem(`lumiere_wishlist_${user._id}`, JSON.stringify(favorites));
      }
    } catch (e) {
      console.error(e);
    }
  }, [favorites, user]);

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

  const clearWishlist = () => {
    setFavorites([]);
    localStorage.removeItem(WISHLIST_KEY);
    if (user?._id) {
      localStorage.removeItem(`lumiere_wishlist_${user._id}`);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFromFavorites,
        clearWishlist,
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
