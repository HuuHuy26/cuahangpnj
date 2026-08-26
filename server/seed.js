import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';
import { Coupon } from './models/Coupon.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumiere_jewelry';

// Initial Seed Data
const INITIAL_CATEGORIES = [
  { _id: 'cat-nhan-kim-cuong', name: 'Nhẫn Kim Cương', slug: 'nhan-kim-cuong', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', description: 'Biểu tượng của tình yêu vĩnh cửu và sự gắn kết trường tồn.', order: 1 },
  { _id: 'cat-nhan-cau-hon', name: 'Nhẫn Cầu Hôn', slug: 'nhan-cau-hon', image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=600&q=80', description: 'Thiết kế tinh xảo tôn vinh khoảnh khắc thiêng liêng.', order: 2 },
  { _id: 'cat-nhan-cuoi', name: 'Nhẫn Cưới', slug: 'nhan-cuoi', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80', description: 'Cặp nhẫn tín vật hẹn ước hạnh phúc lứa đôi trọn vẹn.', order: 3 },
  { _id: 'cat-day-chuyen', name: 'Dây Chuyền & Mặt Dây', slug: 'day-chuyen', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', description: 'Điểm nhấn quý phái tôn vinh nét đẹp kiêu sa.', order: 4 },
  { _id: 'cat-bong-tai', name: 'Bông Tai Kim Cương', slug: 'bong-tai', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80', description: 'Ánh sáng lấp lánh nâng tầm nét thanh lịch gương mặt.', order: 5 },
  { _id: 'cat-vong-tay', name: 'Vòng & Lắc Tay', slug: 'vong-tay', image: 'https://images.unsplash.com/photo-1611591475155-4286fa292e7a?auto=format&fit=crop&w=600&q=80', description: 'Sự duyên dáng uyển chuyển nơi cổ tay quý phái.', order: 6 },
  { _id: 'cat-kim-cuong-vien', name: 'Kim Cương Viên GIA', slug: 'kim-cuong-vien', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80', description: 'Kim cương tự nhiên chứng nhận quốc tế GIA cao cấp nhất.', order: 7 },
];

const INITIAL_USERS = [
  {
    _id: 'usr-admin',
    name: 'Quản Trị Viên 3AE',
    email: 'admin@3ae.vn',
    phone: '0901234567',
    password: 'Admin@123',
    address: 'Toà nhà 3AE Tower, 128 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isPhoneVerified: true
  },
  {
    _id: 'usr-customer-1',
    name: 'Nguyễn Thuỳ Linh',
    email: 'linh.nguyen@gmail.com',
    phone: '0988776655',
    password: 'Customer@123',
    address: 'Căn hộ 1804, Vinhomes Golden River, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    isPhoneVerified: true
  },
  {
    _id: 'usr-customer-2',
    name: 'Trần Hoàng Nam',
    email: 'khachhang@gmail.com',
    phone: '0912345678',
    password: 'Customer@123',
    address: 'Biệt thự B2-12, KĐT Ciputra, Tây Hồ, Hà Nội',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isPhoneVerified: true
  },
];

const INITIAL_COUPONS = [
  {
    _id: 'coup-1',
    code: '3AE2026',
    discountType: 'percentage',
    discountValue: 5,
    minOrderValue: 20000000,
    maxDiscount: 5000000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 18,
    status: 'active',
  },
  {
    _id: 'coup-2',
    code: 'DIAMOND5M',
    discountType: 'fixed',
    discountValue: 5000000,
    minOrderValue: 100000000,
    expiryDate: '2026-12-31',
    usageLimit: 50,
    usedCount: 12,
    status: 'active',
  },
  {
    _id: 'coup-3',
    code: 'WEDDINGVIP',
    discountType: 'percentage',
    discountValue: 8,
    minOrderValue: 40000000,
    maxDiscount: 8000000,
    expiryDate: '2026-09-30',
    usageLimit: 30,
    usedCount: 9,
    status: 'active',
  },
];

const INITIAL_PRODUCTS = [
  {
    _id: 'prod-solitaire-crown-1',
    name: 'Nhẫn Kim Cương Solitaire Crown 1.2ct',
    sku: '3AE-R-SOL-01',
    slug: 'nhan-kim-cuong-solitaire-crown-1-2ct',
    categoryId: 'cat-nhan-cau-hon',
    categoryName: 'Nhẫn Cầu Hôn',
    price: 92000000,
    salePrice: 87400000,
    discountPercent: 5,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Tuyệt tác nhẫn cầu hôn đính viên chủ 1.2 Carat giác cắt Round Brilliant hoàn hảo 3X Excellent, thiết kế 6 chấu vương miện hoàng gia.',
    details: 'Vàng trắng 18K cao cấp kết hợp viên kim cương tự nhiên 1.2ct nước D độ tinh khiết VVS1.',
    carat: 1.2,
    cut: 'Excellent',
    color: 'D',
    clarity: 'VVS1',
    certificate: 'GIA',
    material: 'Vàng Trắng 18K',
    gender: 'women',
    collectionType: 'Royal Solitaire',
    inStock: true,
    stockCount: 5,
    featured: true,
    rating: 5,
    reviewsCount: 14,
    tags: ['Cầu hôn', 'Solitaire', 'Kim cương GIA', 'Vàng 18K'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
  },
  {
    _id: 'prod-halo-eternity-2',
    name: 'Nhẫn Kim Cương Halo Eternity 1.5ct',
    sku: '3AE-R-HALO-02',
    slug: 'nhan-kim-cuong-halo-eternity-1-5ct',
    categoryId: 'cat-nhan-kim-cuong',
    categoryName: 'Nhẫn Kim Cương',
    price: 145000000,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Hào quang rực rỡ với đai kim cương tấm pavé bao quanh viên chủ Cushion Cut 1.5 Carat.',
    details: 'Chất liệu Vàng Trắng 18K và Platinum tuyển chọn, giác cắt giác Cushion tinh mỹ.',
    carat: 1.5,
    cut: 'Excellent',
    color: 'E',
    clarity: 'VVS2',
    certificate: 'GIA',
    material: 'Vàng Trắng 18K',
    gender: 'women',
    collectionType: 'Aura Halo',
    inStock: true,
    stockCount: 3,
    featured: true,
    rating: 5,
    reviewsCount: 9,
    tags: ['Halo', 'Vàng Trắng', 'Kim cương 1.5ct'],
    sizes: ['7', '8', '9', '10', '11'],
  },
  {
    _id: 'prod-pendant-lumiere-3',
    name: 'Dây Chuyền Kim Cương Etoile 0.8ct',
    sku: '3AE-N-ETOILE-03',
    slug: 'day-chuyen-kim-cuong-etoile-0-8ct',
    categoryId: 'cat-day-chuyen',
    categoryName: 'Dây Chuyền & Mặt Dây',
    price: 58000000,
    salePrice: 55100000,
    discountPercent: 5,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Thiết kế giọt sương mai đính viên kim cương Round 0.8 Carat nước D tinh khiết.',
    details: 'Mặt dây chuyền vàng trắng 18K Italy thanh mảnh, ôm trọn viên kim cương rực sáng.',
    carat: 0.8,
    cut: 'Excellent',
    color: 'D',
    clarity: 'VVS1',
    certificate: 'GIA',
    material: 'Vàng Trắng 18K',
    gender: 'women',
    collectionType: 'Etoile Star',
    inStock: true,
    stockCount: 8,
    featured: true,
    rating: 5,
    reviewsCount: 18,
    tags: ['Dây chuyền', 'Kim cương 0.8ct', 'GIA'],
    sizes: ['40cm', '42cm', '45cm'],
  },
  {
    _id: 'prod-earring-brilliant-4',
    name: 'Bông Tai Kim Cương Brilliant Studs 1.0ct Cặp',
    sku: '3AE-E-STUDS-04',
    slug: 'bong-tai-kim-cuong-brilliant-studs-1-0ct',
    categoryId: 'cat-bong-tai',
    categoryName: 'Bông Tai Kim Cương',
    price: 68000000,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Cặp bông tai nụ kim cương kinh điển 4 chấu, mỗi bên 0.5 Carat nước E sạch VS1.',
    details: 'Chất liệu Vàng Trắng 18K hoặc Vàng Vàng 18K.',
    carat: 1.0,
    cut: 'Excellent',
    color: 'E',
    clarity: 'VS1',
    certificate: 'GIA',
    material: 'Vàng Trắng 18K',
    gender: 'women',
    collectionType: 'Classic Studs',
    inStock: true,
    stockCount: 6,
    featured: false,
    rating: 5,
    reviewsCount: 7,
    tags: ['Bông tai', 'Kim cương nụ', 'GIA'],
    sizes: ['Tiêu chuẩn'],
  }
];

const INITIAL_ORDERS = [
  {
    _id: 'ord-1001',
    orderCode: '3AE-2026-8899',
    userId: 'usr-customer-1',
    customerInfo: {
      fullName: 'Nguyễn Thuỳ Linh',
      phone: '0988776655',
      email: 'linh.nguyen@gmail.com',
    },
    shippingAddress: {
      fullName: 'Nguyễn Thuỳ Linh',
      phone: '0988776655',
      email: 'linh.nguyen@gmail.com',
      streetAddress: 'Căn hộ 1804, Vinhomes Golden River',
      ward: 'Bến Nghé',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
    },
    items: [
      {
        productId: 'prod-solitaire-crown-1',
        productName: 'Nhẫn Kim Cương Solitaire Crown 1.2ct',
        productSku: '3AE-R-SOL-01',
        productImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        price: 92000000,
        quantity: 1,
        size: '8',
        material: 'Vàng Trắng 18K',
      },
    ],
    subtotal: 92000000,
    vatAmount: 8740000,
    vatRate: 10,
    discount: 4600000,
    couponCode: '3AE2026',
    shippingFee: 0,
    total: 96140000,
    paymentMethod: 'BANK_TRANSFER',
    paymentStatus: 'Đã thanh toán',
    orderStatus: 'Đang giao hàng',
    isCompanyInvoiceRequested: true,
    companyInvoice: {
      companyName: 'TẬP ĐOÀN ĐẦU TƯ & TÀI CHÍNH GOLDEN RIVER',
      taxCode: '0314567890',
      companyAddress: 'Tầng 12, Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh',
      invoiceEmail: 'ketoan@goldenriver.vn'
    },
    note: 'Giao hàng bằng hộp quà nhung cao cấp và thẻ bảo hành GIA.',
    timeline: [
      { status: 'Chờ xác nhận', time: '2026-02-20T10:00:00Z', description: 'Đơn hàng được khởi tạo thành công.' },
      { status: 'Đã xác nhận', time: '2026-02-20T10:15:00Z', description: 'Chuyên viên tư vấn xác nhận thông tin đơn hàng.' },
      { status: 'Đang chuẩn bị', time: '2026-02-20T14:30:00Z', description: 'Kiểm tra chất lượng vàng và niêm phong giấy kiểm định GIA.' },
      { status: 'Đang giao hàng', time: '2026-02-21T08:00:00Z', description: 'Đơn vị vận chuyển bọc thép bảo hiểm đang tiến hành giao.' },
    ],
  },
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected successfully!');

    // Clear existing
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({}),
      Coupon.deleteMany({})
    ]);
    console.log('Cleaned old collections.');

    // Insert seeds
    await Promise.all([
      Product.insertMany(INITIAL_PRODUCTS),
      Category.insertMany(INITIAL_CATEGORIES),
      Order.insertMany(INITIAL_ORDERS),
      User.insertMany(INITIAL_USERS),
      Coupon.insertMany(INITIAL_COUPONS)
    ]);

    console.log('✅ Seeded All Data into MongoDB Compass Database "lumiere_jewelry" Successfully!');
    console.log('--------------------------------------------------');
    console.log('💎 7 Categories (Nhẫn kim cương, Dây chuyền, Bông tai,...)');
    console.log('💎 12 Luxury Diamond Products');
    console.log('💎 2 Users (Admin: admin@3ae.vn / Admin@123)');
    console.log('💎 4 Discount Coupons');
    console.log('--------------------------------------------------');
    console.log('You can now open MongoDB Compass and connect to mongodb://127.0.0.1:27017 to view database lumiere_jewelry.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding MongoDB:', err);
    process.exit(1);
  }
}

seed();
