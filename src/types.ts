export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
  isPhoneVerified?: boolean;
  status?: 'active' | 'locked';
  isLocked?: boolean;
  lockedAt?: string;
  lockReason?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
  featured?: boolean;
}

export type DiamondShape = 'Round' | 'Princess' | 'Emerald' | 'Cushion' | 'Oval' | 'Pear' | 'Marquise' | 'Heart';
export type DiamondColor = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type DiamondClarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1';
export type DiamondCut = 'Ideal' | 'Excellent' | 'Very Good' | 'Good';
export type JewelryMaterial = 'Vàng Vàng 18K' | 'Vàng Trắng 18K' | 'Vàng Hồng 18K' | 'Bạch Kim Platinum 950' | 'Vàng 14K';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  images: string[];
  material: JewelryMaterial;
  size?: string;
  availableSizes?: string[];
  diamondShape?: DiamondShape;
  carat?: number;
  color?: DiamondColor;
  clarity?: DiamondClarity;
  cut?: DiamondCut;
  certificate?: 'GIA' | 'IGI' | 'HRD' | 'PNJ Lab' | 'Không kèm';
  certificateNumber?: string;
  stock: number;
  sold: number;
  featured: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  status: 'active' | 'inactive';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  size?: string;
  selectedMaterial?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đang chuẩn bị' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã hủy';
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'VNPAY' | 'MOMO';
export type PaymentStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hoàn tiền';

export interface OrderItem {
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  material?: string;
}

export interface Order {
  _id: string;
  orderCode: string;
  userId?: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
  };
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  note?: string;
  timeline?: {
    status: OrderStatus;
    time: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive';
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  buttonText?: string;
  position: 'hero' | 'collection' | 'promo';
  status: 'active' | 'inactive';
  order: number;
}
