import axios from 'axios';
import { Product, Category, Order, User, Coupon, Banner, Review, CartItem, ShippingAddress, OrderStatus } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_USERS
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'lumiere_products',
  CATEGORIES: 'lumiere_categories',
  ORDERS: 'lumiere_orders',
  COUPONS: 'lumiere_coupons',
  BANNERS: 'lumiere_banners',
  REVIEWS: 'lumiere_reviews',
  USERS: 'lumiere_users',
  CART: 'lumiere_cart',
  FAVORITES: 'lumiere_favorites',
  CURRENT_USER: 'lumiere_current_user',
  TOKEN: 'lumiere_auth_token',
};

const DATA_VERSION = 'v4_unique_hd_images';

// Initialize Storage with Seed Data if empty or version changed
const initStorage = () => {
  const currentVersion = localStorage.getItem('lumiere_data_version');
  if (currentVersion !== DATA_VERSION) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem('lumiere_data_version', DATA_VERSION);
  } else {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  } else {
    // Đảm bảo có tài khoản mẫu bị khóa để Quản trị viên test mở khóa
    const storedUsers = getStored<User[]>(STORAGE_KEYS.USERS, []);
    if (!storedUsers.some(u => u._id === 'usr-customer-3')) {
      const lockedDemo = INITIAL_USERS.find(u => u._id === 'usr-customer-3');
      if (lockedDemo) {
        storedUsers.push(lockedDemo);
        setStored(STORAGE_KEYS.USERS, storedUsers);
      }
    }
  }
};

// Axios Instance configured for Laravel API
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper storage functions
const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return defaultValue;
  }
};

const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
};

initStorage();

export const apiService = {
  // Authentication
  auth: {
    async register(data: { name: string; email: string; phone: string; password: string }) {
      await new Promise(r => setTimeout(r, 400));
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error('Email này đã được đăng ký trong hệ thống!');
      }
      const newUser: User = {
        _id: 'usr-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      setStored(STORAGE_KEYS.USERS, users);
      const token = 'jwt_token_' + Math.random().toString(36).substring(2);
      setStored(STORAGE_KEYS.TOKEN, token);
      setStored(STORAGE_KEYS.CURRENT_USER, newUser);
      return { success: true, message: 'Đăng ký tài khoản thành công', data: { user: newUser, token } };
    },

    async login(data: { email: string; password: string }) {
      await new Promise(r => setTimeout(r, 200));
      const cleanEmail = (data.email || '').trim().toLowerCase();
      const cleanPassword = (data.password || '').trim();

      // Check if trying to log in as admin
      const isAdminLogin =
        cleanEmail === 'admin@3ae.vn' ||
        cleanEmail === 'admin@lumiere.vn' ||
        cleanEmail === 'admin' ||
        cleanEmail.startsWith('admin@');

      let users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      let user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (isAdminLogin) {
        if (!user) {
          user = {
            _id: 'usr-admin',
            name: 'Quản Trị Viên 3AE',
            email: 'admin@3ae.vn',
            phone: '0901234567',
            address: 'Toà nhà 3AE Tower, 128 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            createdAt: '2026-01-01T00:00:00Z',
          };
          users = [user, ...users.filter(u => u._id !== 'usr-admin' && u.role !== 'admin')];
          setStored(STORAGE_KEYS.USERS, users);
        } else {
          user.role = 'admin';
        }

        // Accept common admin passwords
        const validAdminPasswords = ['admin@123', 'admin', 'admin123', '123456', '3ae@123', '3ae123'];
        if (cleanPassword.toLowerCase() !== 'admin@123' && !validAdminPasswords.includes(cleanPassword.toLowerCase()) && cleanPassword.length < 5) {
          throw new Error('Mật khẩu quản trị viên không chính xác! (Mặc định: Admin@123)');
        }
      } else {
        if (!user) {
          // Check if customer demo login
          if (cleanEmail === 'khachhang@gmail.com' || cleanEmail.includes('khachhang')) {
            user = {
              _id: 'usr-customer-demo',
              name: 'Trần Hoàng Nam',
              email: 'khachhang@gmail.com',
              phone: '0912345678',
              address: 'Biệt thự B2-12, KĐT Ciputra, Tây Hồ, Hà Nội',
              role: 'customer',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
              createdAt: '2026-01-20T10:15:00Z',
            };
            users.push(user);
            setStored(STORAGE_KEYS.USERS, users);
          } else {
            throw new Error('Email chưa được đăng ký trong hệ thống!');
          }
        }

        if (cleanPassword.length < 5 && cleanPassword !== 'Customer@123') {
          throw new Error('Mật khẩu không chính xác!');
        }
      }

      // Kiểm tra trạng thái tài khoản bị khóa
      if (user.isLocked || user.status === 'locked') {
        const reason = user.lockReason ? ` Lý do: ${user.lockReason}.` : '';
        throw new Error(`Tài khoản của quý khách hiện đang bị tạm khóa.${reason} Vui lòng liên hệ Hotline 1800 8888 hoặc Quản trị viên để được hỗ trợ mở khóa.`);
      }

      const token = 'jwt_token_' + Math.random().toString(36).substring(2);
      setStored(STORAGE_KEYS.TOKEN, token);
      setStored(STORAGE_KEYS.CURRENT_USER, user);
      return { success: true, message: 'Đăng nhập thành công', data: { user, token } };
    },

    async logout() {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem('lumiere_cart_items');
      localStorage.removeItem('lumiere_cart_coupon');
      localStorage.removeItem('lumiere_wishlist');
      return { success: true, message: 'Đã đăng xuất an toàn' };
    },

    async getCurrentUser(): Promise<User | null> {
      return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    },

    async sendOtp(target: string, type: 'REGISTER' | 'RESET_PASSWORD' = 'REGISTER') {
      try {
        const res = await apiClient.post('/auth/send-otp', { target, type });
        return res.data;
      } catch {
        // Fallback simulation
        await new Promise(r => setTimeout(r, 400));
        const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otps = getStored<Record<string, string>>('3ae_otps', {});
        otps[target] = demoOtp;
        setStored('3ae_otps', otps);
        return {
          success: true,
          message: `Đã gửi mã xác thực OTP về ${target}!`,
          otpDemo: demoOtp,
        };
      }
    },

    async verifyOtp(target: string, otp: string) {
      try {
        const res = await apiClient.post('/auth/verify-otp', { target, otp });
        return res.data;
      } catch {
        // Fallback simulation
        const otps = getStored<Record<string, string>>('3ae_otps', {});
        if (otps[target] === otp || otp === '123456' || otp === '888888') {
          return { success: true, message: 'Xác thực OTP thành công!' };
        }
        throw new Error('Mã OTP không chính xác!');
      }
    },

    async resetPassword(target: string, otp: string, newPassword: string) {
      try {
        const res = await apiClient.post('/auth/reset-password', { target, otp, newPassword });
        return res.data;
      } catch {
        // Fallback simulation
        const otps = getStored<Record<string, string>>('3ae_otps', {});
        if (otps[target] !== otp && otp !== '123456' && otp !== '888888') {
          throw new Error('Mã OTP không chính xác!');
        }
        const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
        const index = users.findIndex(u => u.email.toLowerCase() === target.toLowerCase() || u.phone === target);
        if (index === -1) {
          throw new Error('Không tìm thấy tài khoản tương ứng với SĐT/Email này!');
        }
        users[index] = { ...users[index], password: newPassword } as any;
        setStored(STORAGE_KEYS.USERS, users);
        return { success: true, message: 'Đổi mật khẩu thành công! Quý khách có thể đăng nhập ngay.' };
      }
    },

    async updateProfile(userId: string, data: Partial<User>) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const index = users.findIndex(u => u._id === userId);
      if (index === -1) throw new Error('Không tìm thấy người dùng');

      users[index] = { ...users[index], ...data };
      setStored(STORAGE_KEYS.USERS, users);
      setStored(STORAGE_KEYS.CURRENT_USER, users[index]);
      return { success: true, message: 'Cập nhật thông tin thành công', data: users[index] };
    }
  },

  // Products
  products: {
    async getAll(params?: {
      category?: string;
      search?: string;
      caratMin?: number;
      caratMax?: number;
      priceMin?: number;
      priceMax?: number;
      color?: string;
      clarity?: string;
      cut?: string;
      shape?: string;
      certificate?: string;
      material?: string;
      inStock?: boolean;
      sort?: string;
      featured?: boolean;
      limit?: number;
    }) {
      await new Promise(r => setTimeout(r, 150));
      let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

      if (params?.category) {
        products = products.filter(p => p.categoryId === params.category || p.slug.includes(params.category!));
      }
      if (params?.search) {
        const query = params.search.toLowerCase().trim();
        products = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      if (params?.caratMin !== undefined) {
        products = products.filter(p => (p.carat || 0) >= params.caratMin!);
      }
      if (params?.caratMax !== undefined) {
        products = products.filter(p => (p.carat || 0) <= params.caratMax!);
      }
      if (params?.priceMin !== undefined) {
        products = products.filter(p => (p.salePrice || p.price) >= params.priceMin!);
      }
      if (params?.priceMax !== undefined) {
        products = products.filter(p => (p.salePrice || p.price) <= params.priceMax!);
      }
      if (params?.color) {
        products = products.filter(p => p.color === params.color);
      }
      if (params?.clarity) {
        products = products.filter(p => p.clarity === params.clarity);
      }
      if (params?.cut) {
        products = products.filter(p => p.cut === params.cut);
      }
      if (params?.shape) {
        products = products.filter(p => p.diamondShape === params.shape);
      }
      if (params?.certificate) {
        products = products.filter(p => p.certificate === params.certificate);
      }
      if (params?.material) {
        products = products.filter(p => p.material === params.material);
      }
      if (params?.inStock) {
        products = products.filter(p => p.stock > 0);
      }
      if (params?.featured) {
        products = products.filter(p => p.featured);
      }

      // Sort
      if (params?.sort === 'price_asc') {
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      } else if (params?.sort === 'price_desc') {
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      } else if (params?.sort === 'best_seller') {
        products.sort((a, b) => b.sold - a.sold);
      } else if (params?.sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      if (params?.limit) {
        products = products.slice(0, params.limit);
      }

      return {
        success: true,
        data: products,
        total: products.length
      };
    },

    async getById(idOrSlug: string) {
      await new Promise(r => setTimeout(r, 100));
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const product = products.find(p => p._id === idOrSlug || p.slug === idOrSlug);
      if (!product) throw new Error('Không tìm thấy sản phẩm');
      return { success: true, data: product };
    },

    async create(productData: Partial<Product>) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const newProduct: Product = {
        _id: 'prod-' + Date.now(),
        name: productData.name || 'Sản phẩm mới',
        slug: (productData.name || 'san-pham').toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
        sku: productData.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        categoryId: productData.categoryId || 'cat-1',
        categoryName: productData.categoryName || 'Trang sức kim cương',
        description: productData.description || '',
        shortDescription: productData.shortDescription || '',
        price: Number(productData.price) || 0,
        salePrice: productData.salePrice ? Number(productData.salePrice) : undefined,
        images: productData.images?.length ? productData.images : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80'],
        material: productData.material || 'Vàng Trắng 18K',
        diamondShape: productData.diamondShape || 'Round',
        carat: productData.carat ? Number(productData.carat) : undefined,
        color: productData.color || 'F',
        clarity: productData.clarity || 'VS1',
        cut: productData.cut || 'Excellent',
        certificate: productData.certificate || 'GIA',
        certificateNumber: productData.certificateNumber || 'GIA-' + Math.floor(100000000 + Math.random() * 900000000),
        stock: Number(productData.stock) || 1,
        sold: 0,
        featured: !!productData.featured,
        status: productData.status || 'active',
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.unshift(newProduct);
      setStored(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, message: 'Thêm sản phẩm thành công', data: newProduct };
    },

    async update(id: string, productData: Partial<Product>) {
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const index = products.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Không tìm thấy sản phẩm để cập nhật');

      products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, message: 'Cập nhật sản phẩm thành công', data: products[index] };
    },

    async delete(id: string) {
      let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      products = products.filter(p => p._id !== id);
      setStored(STORAGE_KEYS.PRODUCTS, products);
      return { success: true, message: 'Xóa sản phẩm thành công' };
    }
  },

  // Categories
  categories: {
    async getAll() {
      const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return { success: true, data: categories };
    },
    async create(data: Partial<Category>) {
      const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      const newCat: Category = {
        _id: 'cat-' + Date.now(),
        name: data.name || 'Danh mục mới',
        slug: (data.name || 'danh-muc').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: data.description || '',
        image: data.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        itemCount: 0,
        featured: !!data.featured,
      };
      categories.push(newCat);
      setStored(STORAGE_KEYS.CATEGORIES, categories);
      return { success: true, message: 'Tạo danh mục thành công', data: newCat };
    },
    async delete(id: string) {
      let categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      categories = categories.filter(c => c._id !== id);
      setStored(STORAGE_KEYS.CATEGORIES, categories);
      return { success: true, message: 'Đã xóa danh mục' };
    }
  },

  // Orders
  orders: {
    async getAll(userId?: string) {
      await new Promise(r => setTimeout(r, 150));
      let orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      if (userId) {
        orders = orders.filter(o => o.userId === userId);
      }
      return { success: true, data: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
    },

    async getById(idOrCode: string) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const order = orders.find(o => o._id === idOrCode || o.orderCode === idOrCode);
      if (!order) throw new Error('Không tìm thấy đơn hàng');
      return { success: true, data: order };
    },

    async create(orderData: {
      userId?: string;
      customerInfo: { fullName: string; phone: string; email: string };
      shippingAddress: ShippingAddress;
      items: CartItem[];
      couponCode?: string;
      paymentMethod: 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
      note?: string;
    }) {
      await new Promise(r => setTimeout(r, 400));
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

      // Backend verification of prices and stock
      let subtotal = 0;
      const orderItems = [];

      for (const item of orderData.items) {
        const prod = products.find(p => p._id === item.product._id);
        if (!prod) throw new Error(`Sản phẩm ${item.product.name} không tồn tại`);
        if (prod.stock < item.quantity) {
          throw new Error(`Sản phẩm ${prod.name} chỉ còn ${prod.stock} sản phẩm trong kho`);
        }

        // Auto decrement stock
        prod.stock -= item.quantity;
        prod.sold += item.quantity;

        const effectivePrice = prod.salePrice || prod.price;
        subtotal += effectivePrice * item.quantity;

        orderItems.push({
          productId: prod._id,
          productName: prod.name,
          productSku: prod.sku,
          productImage: prod.images[0],
          price: effectivePrice,
          quantity: item.quantity,
          size: item.selectedSize,
          material: item.selectedMaterial || prod.material,
        });
      }

      // Check coupon
      let discount = 0;
      if (orderData.couponCode) {
        const coupons = getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
        const coupon = coupons.find(c => c.code.toUpperCase() === orderData.couponCode?.toUpperCase() && c.status === 'active');
        if (coupon) {
          if (subtotal >= coupon.minOrderValue) {
            if (coupon.discountType === 'percentage') {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
              }
            } else {
              discount = coupon.discountValue;
            }
            coupon.usedCount += 1;
            setStored(STORAGE_KEYS.COUPONS, coupons);
          }
        }
      }

      // Free shipping over 50.000.000 VND
      const shippingFee = subtotal > 50000000 ? 0 : 150000;
      const total = Math.max(0, subtotal - discount + shippingFee);

      const newOrder: Order = {
        _id: 'ord-' + Date.now(),
        orderCode: 'LUM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        userId: orderData.userId,
        customerInfo: orderData.customerInfo,
        shippingAddress: orderData.shippingAddress,
        items: orderItems,
        subtotal,
        discount,
        couponCode: orderData.couponCode,
        shippingFee,
        total,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'BANK_TRANSFER' ? 'Chưa thanh toán' : 'Chưa thanh toán',
        orderStatus: 'Chờ xác nhận',
        note: orderData.note,
        timeline: [
          { status: 'Chờ xác nhận', time: new Date().toISOString(), description: 'Đơn hàng mới được tạo trên hệ thống.' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save updated products stock
      setStored(STORAGE_KEYS.PRODUCTS, products);

      // Save order
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      orders.unshift(newOrder);
      setStored(STORAGE_KEYS.ORDERS, orders);

      return { success: true, message: 'Đặt hàng thành công!', data: newOrder };
    },

    async updateStatus(orderId: string, status: OrderStatus, note?: string) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex(o => o._id === orderId);
      if (index === -1) throw new Error('Không tìm thấy đơn hàng');

      const currentOrder = orders[index];
      currentOrder.orderStatus = status;
      currentOrder.updatedAt = new Date().toISOString();
      if (!currentOrder.timeline) currentOrder.timeline = [];
      currentOrder.timeline.push({
        status,
        time: new Date().toISOString(),
        description: note || `Cập nhật trạng thái đơn sang: ${status}`,
      });

      if (status === 'Đã giao hàng') {
        currentOrder.paymentStatus = 'Đã thanh toán';
      }

      setStored(STORAGE_KEYS.ORDERS, orders);
      return { success: true, message: 'Cập nhật trạng thái thành công', data: currentOrder };
    },

    async cancelOrder(orderId: string, reason?: string) {
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const index = orders.findIndex(o => o._id === orderId);
      if (index === -1) throw new Error('Không tìm thấy đơn hàng');

      if (orders[index].orderStatus !== 'Chờ xác nhận') {
        throw new Error('Chỉ có thể hủy đơn hàng khi đơn ở trạng thái "Chờ xác nhận"');
      }

      // Restock products
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      for (const item of orders[index].items) {
        const prod = products.find(p => p._id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
          prod.sold = Math.max(0, prod.sold - item.quantity);
        }
      }
      setStored(STORAGE_KEYS.PRODUCTS, products);

      orders[index].orderStatus = 'Đã hủy';
      orders[index].updatedAt = new Date().toISOString();
      if (!orders[index].timeline) orders[index].timeline = [];
      orders[index].timeline.push({
        status: 'Đã hủy',
        time: new Date().toISOString(),
        description: reason || 'Khách hàng yêu cầu hủy đơn.',
      });

      setStored(STORAGE_KEYS.ORDERS, orders);
      return { success: true, message: 'Đã hủy đơn hàng thành công', data: orders[index] };
    }
  },

  // Coupons
  coupons: {
    async check(code: string, subtotal: number) {
      await new Promise(r => setTimeout(r, 200));
      const coupons = getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.status === 'active');

      if (!coupon) {
        throw new Error('Mã giảm giá không tồn tại hoặc đã hết hạn!');
      }
      if (subtotal < coupon.minOrderValue) {
        throw new Error(`Mã giảm giá này chỉ áp dụng cho đơn hàng từ ${new Intl.NumberFormat('vi-VN').format(coupon.minOrderValue)} ₫`);
      }
      if (coupon.usedCount >= coupon.usageLimit) {
        throw new Error('Mã giảm giá đã hết lượt sử dụng!');
      }

      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      return {
        success: true,
        message: 'Áp dụng mã giảm giá thành công',
        data: {
          coupon,
          discountAmount: discount,
        }
      };
    },

    async getAll() {
      const coupons = getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      return { success: true, data: coupons };
    },

    async create(data: Partial<Coupon>) {
      const coupons = getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      const newCoupon: Coupon = {
        _id: 'coup-' + Date.now(),
        code: (data.code || 'SALE').toUpperCase(),
        discountType: data.discountType || 'percentage',
        discountValue: Number(data.discountValue) || 5,
        minOrderValue: Number(data.minOrderValue) || 10000000,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        expiryDate: data.expiryDate || '2026-12-31',
        usageLimit: Number(data.usageLimit) || 100,
        usedCount: 0,
        status: data.status || 'active',
      };
      coupons.push(newCoupon);
      setStored(STORAGE_KEYS.COUPONS, coupons);
      return { success: true, message: 'Tạo mã giảm giá thành công', data: newCoupon };
    },

    async delete(id: string) {
      let coupons = getStored<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      coupons = coupons.filter(c => c._id !== id);
      setStored(STORAGE_KEYS.COUPONS, coupons);
      return { success: true, message: 'Đã xóa mã giảm giá' };
    }
  },

  // Reviews
  reviews: {
    async getByProduct(productId: string) {
      const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      const filtered = reviews.filter(r => r.productId === productId && r.status === 'approved');
      return { success: true, data: filtered };
    },

    async addReview(data: { productId: string; userId: string; userName: string; rating: number; comment: string }) {
      const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      const newReview: Review = {
        _id: 'rev-' + Date.now(),
        productId: data.productId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment,
        isVerifiedPurchase: true,
        status: 'approved',
        createdAt: new Date().toISOString(),
      };
      reviews.unshift(newReview);
      setStored(STORAGE_KEYS.REVIEWS, reviews);

      // Update product rating average
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const product = products.find(p => p._id === data.productId);
      if (product) {
        const prodReviews = reviews.filter(r => r.productId === data.productId && r.status === 'approved');
        const avgRating = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
        product.rating = Number(avgRating.toFixed(1));
        product.reviewCount = prodReviews.length;
        setStored(STORAGE_KEYS.PRODUCTS, products);
      }

      return { success: true, message: 'Cảm ơn bạn đã gửi đánh giá quý giá!', data: newReview };
    },

    async getAll() {
      const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      return { success: true, data: reviews };
    },

    async updateStatus(id: string, status: 'approved' | 'rejected') {
      const reviews = getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      const review = reviews.find(r => r._id === id);
      if (review) {
        review.status = status;
        setStored(STORAGE_KEYS.REVIEWS, reviews);
      }
      return { success: true, message: 'Cập nhật trạng thái đánh giá thành công' };
    }
  },

  // Banners
  banners: {
    async getAll() {
      const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
      return { success: true, data: banners.filter(b => b.status === 'active').sort((a, b) => a.order - b.order) };
    },
    async getAllAdmin() {
      const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
      return { success: true, data: banners };
    },
    async create(data: Partial<Banner>) {
      const banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
      const newBanner: Banner = {
        _id: 'ban-' + Date.now(),
        title: data.title || 'Banner mới',
        subtitle: data.subtitle || '',
        image: data.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85',
        link: data.link || '/products',
        buttonText: data.buttonText || 'Khám phá ngay',
        position: data.position || 'hero',
        status: data.status || 'active',
        order: banners.length + 1,
      };
      banners.push(newBanner);
      setStored(STORAGE_KEYS.BANNERS, banners);
      return { success: true, message: 'Thêm banner thành công', data: newBanner };
    },
    async delete(id: string) {
      let banners = getStored<Banner[]>(STORAGE_KEYS.BANNERS, INITIAL_BANNERS);
      banners = banners.filter(b => b._id !== id);
      setStored(STORAGE_KEYS.BANNERS, banners);
      return { success: true, message: 'Đã xóa banner' };
    }
  },

  // Users & Customer Management
  users: {
    async getAll(params?: { search?: string; role?: string; status?: string }) {
      try {
        const res = await apiClient.get('/users', { params });
        if (res.data?.success && res.data.data) {
          return res.data;
        }
      } catch (e) {
        // Fallback to localStorage
      }
      let users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      if (params?.role && params.role !== 'all') {
        users = users.filter(u => u.role === params.role);
      }
      if (params?.status && params.status !== 'all') {
        if (params.status === 'locked') {
          users = users.filter(u => u.isLocked || u.status === 'locked');
        } else if (params.status === 'active') {
          users = users.filter(u => !u.isLocked && u.status !== 'locked');
        }
      }
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        users = users.filter(u =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q)) ||
          (u.address && u.address.toLowerCase().includes(q))
        );
      }
      return { success: true, count: users.length, data: users };
    },

    async getById(id: string) {
      try {
        const res = await apiClient.get(`/users/${id}`);
        if (res.data?.success && res.data.data) {
          return res.data;
        }
      } catch (e) {
        // Fallback
      }
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const user = users.find(u => u._id === id);
      if (!user) throw new Error('Không tìm thấy thông tin khách hàng!');
      return { success: true, data: user };
    },

    async create(userData: Partial<User> & { password?: string }) {
      try {
        const res = await apiClient.post('/users', userData);
        if (res.data?.success) {
          const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
          if (!users.some(u => u._id === res.data.data._id)) {
            users.unshift(res.data.data);
            setStored(STORAGE_KEYS.USERS, users);
          }
          return res.data;
        }
      } catch (e: any) {
        if (e.response?.data?.message) {
          throw new Error(e.response.data.message);
        }
      }

      // LocalStorage Fallback
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      if (users.some(u => u.email.toLowerCase() === (userData.email || '').toLowerCase())) {
        throw new Error('Email này đã được sử dụng bởi khách hàng khác!');
      }

      const newUser: User = {
        _id: userData._id || 'usr-' + Date.now(),
        name: userData.name || 'Khách Hàng Mới',
        email: (userData.email || '').toLowerCase(),
        phone: userData.phone || '',
        address: userData.address || '',
        role: (userData.role as any) || 'customer',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        isPhoneVerified: true
      };

      users.unshift(newUser);
      setStored(STORAGE_KEYS.USERS, users);
      return { success: true, message: 'Thêm khách hàng thành công!', data: newUser };
    },

    async update(id: string, updateData: Partial<User> & { password?: string }) {
      try {
        const res = await apiClient.put(`/users/${id}`, updateData);
        if (res.data?.success) {
          const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
          const idx = users.findIndex(u => u._id === id);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...res.data.data };
            setStored(STORAGE_KEYS.USERS, users);
          }
          return res.data;
        }
      } catch (e: any) {
        if (e.response?.data?.message) {
          throw new Error(e.response.data.message);
        }
      }

      // LocalStorage Fallback
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const idx = users.findIndex(u => u._id === id);
      if (idx === -1) throw new Error('Không tìm thấy người dùng cần cập nhật!');

      users[idx] = {
        ...users[idx],
        ...updateData,
        email: updateData.email ? updateData.email.toLowerCase() : users[idx].email
      };
      setStored(STORAGE_KEYS.USERS, users);
      return { success: true, message: 'Cập nhật thông tin khách hàng thành công!', data: users[idx] };
    },

    async delete(id: string) {
      if (id === 'usr-admin') {
        throw new Error('Không thể xóa tài khoản Quản Trị Viên gốc của hệ thống!');
      }

      try {
        const res = await apiClient.delete(`/users/${id}`);
        if (res.data?.success) {
          let users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
          users = users.filter(u => u._id !== id);
          setStored(STORAGE_KEYS.USERS, users);
          return res.data;
        }
      } catch (e: any) {
        if (e.response?.data?.message) {
          throw new Error(e.response.data.message);
        }
      }

      let users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const user = users.find(u => u._id === id);
      if (user?.email === 'admin@3ae.vn' || user?.role === 'admin') {
        throw new Error('Không thể xóa tài khoản Quản Trị Viên chính!');
      }

      users = users.filter(u => u._id !== id);
      setStored(STORAGE_KEYS.USERS, users);
      return { success: true, message: 'Đã xóa người dùng khỏi hệ thống!' };
    },

    async unlock(id: string) {
      try {
        const res = await apiClient.patch(`/users/${id}/unlock`);
        if (res.data?.success) {
          const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
          const idx = users.findIndex(u => u._id === id);
          if (idx !== -1) {
            users[idx] = {
              ...users[idx],
              status: 'active',
              isLocked: false,
              lockReason: undefined,
              lockedAt: undefined,
            };
            setStored(STORAGE_KEYS.USERS, users);
          }
          return res.data;
        }
      } catch (e: any) {
        // Fallback to localStorage
      }

      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const idx = users.findIndex(u => u._id === id);
      if (idx === -1) throw new Error('Không tìm thấy tài khoản người dùng!');

      users[idx] = {
        ...users[idx],
        status: 'active',
        isLocked: false,
        lockReason: undefined,
        lockedAt: undefined,
      };
      setStored(STORAGE_KEYS.USERS, users);
      return {
        success: true,
        message: `Đã mở khóa tài khoản cho ${users[idx].name} thành công!`,
        data: users[idx]
      };
    },

    async lock(id: string, reason?: string) {
      if (id === 'usr-admin') {
        throw new Error('Không thể khóa tài khoản Quản Trị Viên gốc của hệ thống!');
      }

      try {
        const res = await apiClient.patch(`/users/${id}/lock`, { reason });
        if (res.data?.success) {
          const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
          const idx = users.findIndex(u => u._id === id);
          if (idx !== -1) {
            users[idx] = {
              ...users[idx],
              status: 'locked',
              isLocked: true,
              lockReason: reason || 'Tài khoản tạm khóa theo quyết định của Quản Trị Viên',
              lockedAt: new Date().toISOString(),
            };
            setStored(STORAGE_KEYS.USERS, users);
          }
          return res.data;
        }
      } catch (e: any) {
        // Fallback to localStorage
      }

      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const idx = users.findIndex(u => u._id === id);
      if (idx === -1) throw new Error('Không tìm thấy tài khoản người dùng!');

      if (users[idx].email === 'admin@3ae.vn' || users[idx]._id === 'usr-admin') {
        throw new Error('Không thể khóa tài khoản Quản Trị Viên gốc!');
      }

      users[idx] = {
        ...users[idx],
        status: 'locked',
        isLocked: true,
        lockReason: reason || 'Tài khoản tạm khóa theo quyết định của Quản Trị Viên',
        lockedAt: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.USERS, users);
      return {
        success: true,
        message: `Đã khóa tài khoản của ${users[idx].name} thành công!`,
        data: users[idx]
      };
    }
  },

  // Admin Dashboard Statistics
  admin: {
    async getDashboardStats() {
      await new Promise(r => setTimeout(r, 200));
      const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);

      const totalRevenue = orders
        .filter(o => o.orderStatus !== 'Đã hủy')
        .reduce((sum, o) => sum + o.total, 0);

      const totalOrders = orders.length;
      const totalCustomers = users.filter(u => u.role === 'customer').length;
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock <= 3);

      // Monthly revenue trend (Past 6 months)
      const monthlyRevenue = [
        { month: 'T9/25', revenue: 680000000, orders: 8 },
        { month: 'T10/25', revenue: 950000000, orders: 12 },
        { month: 'T11/25', revenue: 1240000000, orders: 16 },
        { month: 'T12/25', revenue: 1890000000, orders: 24 },
        { month: 'T1/26', revenue: 2150000000, orders: 28 },
        { month: 'T2/26', revenue: totalRevenue, orders: totalOrders },
      ];

      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
          lowStockCount: lowStockProducts.length,
          lowStockProducts,
          monthlyRevenue,
          recentOrders: orders.slice(0, 5),
          topSelling: [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)
        }
      };
    },

    async getUsers() {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      return { success: true, data: users };
    },

    async updateUserRole(userId: string, role: 'customer' | 'admin') {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
      const user = users.find(u => u._id === userId);
      if (user) {
        user.role = role;
        setStored(STORAGE_KEYS.USERS, users);
      }
      return { success: true, message: 'Cập nhật phân quyền thành công' };
    }
  }
};
