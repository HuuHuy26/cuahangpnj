import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS
} from './src/data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, 'database');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 1. Store Branches Data
const STORE_INFO = {
  brandName: '3AE Diamond & Fine Jewelry',
  shortName: '3AE Jewelry',
  companyName: 'CÔNG TY CỔ PHẦN TRANG SỨC & KIM CƯƠNG CAO CẤP 3AE',
  slogan: 'Vẻ Đẹp Kiêu Sa - Giá Trị Vĩnh Cửu',
  taxCode: '0109887766',
  headquarters: 'Tòa nhà Diamond Tower, 47 - 48 TT16, Khu đô thị Văn Phú, Quận Hà Đông, Hà Nội',
  hotline: '0868 895 658',
  hotlineTollFree: '1800 5454 57',
  email: 'vietkhoi@diamond-jewelry.vn',
  customerServiceEmail: 'contact@diamond-jewelry.vn',
  website: 'http://localhost:3000',
  apiEndpoint: 'http://localhost:5000/api',
  currency: 'VND',
  currencySymbol: '₫',
  databaseName: 'lumiere_jewelry',
  description: 'Thương hiệu trang sức kim cương và đá quý cao cấp chuẩn quốc tế GIA & IGI. Độc quyền chế tác vàng 18K và Platinum 950.',
  socials: {
    facebook: 'https://facebook.com/3aejewelry',
    instagram: 'https://instagram.com/3aejewelry',
    youtube: 'https://youtube.com/@3aejewelry',
    tiktok: 'https://tiktok.com/@3aejewelry'
  }
};

const STORES = [
  {
    _id: 'store-1',
    code: 'STORE-HN-01',
    name: '3AE Diamond Flagship Hà Đông',
    type: 'Flagship Showroom',
    address: 'Tòa nhà Diamond Tower, 47 - 48 TT16, Khu đô thị Văn Phú',
    ward: 'Phường Phú La',
    district: 'Quận Hà Đông',
    city: 'Hà Nội',
    phone: '0868 895 658',
    email: 'vietkhoi@diamond-jewelry.vn',
    openingHours: '08:30 - 21:30 (Thứ 2 - Chủ Nhật)',
    isFlagship: true,
    coordinates: { lat: 20.9575, lng: 105.7682 },
    services: [
      'Tư vấn kim cương 1-1 phòng VIP',
      'Kiểm định mã số cạnh kim cương GIA tại chỗ bằng kính hiển vi 40X',
      'Thiết kế trang sức độc bản 3D Custom Made',
      'Làm sạch & xi mạ đánh bóng trọn đời miễn phí',
      'Thu đổi kim cương và trang sức với chính sách bảo chứng tốt nhất'
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    status: 'active'
  },
  {
    _id: 'store-2',
    code: 'STORE-HN-02',
    name: '3AE Diamond Boutique Keangnam Landmark 72',
    type: 'Luxury Boutique',
    address: 'Tầng 1 sảnh chính, Tòa tháp Keangnam Landmark 72, Đường Phạm Hùng',
    ward: 'Phường Mễ Trì',
    district: 'Quận Nam Từ Liêm',
    city: 'Hà Nội',
    phone: '0868 895 658',
    email: 'contact@diamond-jewelry.vn',
    openingHours: '09:00 - 22:00 (Thứ 2 - Chủ Nhật)',
    isFlagship: false,
    coordinates: { lat: 21.0173, lng: 105.7838 },
    services: [
      'Trải nghiệm kim cương viên Fancy Cut (Oval, Cushion, Emerald, Pear)',
      'Khắc laser tên riêng và lời ước hẹn trên đai nhẫn',
      'Đặt lịch hẹn riêng tư cùng Master Jeweler',
      'Giao nhận trang sức bọc thép bảo mật tận nơi'
    ],
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80',
    status: 'active'
  },
  {
    _id: 'store-3',
    code: 'STORE-HCM-01',
    name: '3AE Diamond Showroom Vinhomes Golden River TP.HCM',
    type: 'VIP Lounge & Boutique',
    address: 'Tòa Aqua 1, Khu đô thị Vinhomes Golden River, Số 2 Tôn Đức Thắng',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    phone: '1800 5454 57',
    email: 'hcm@diamond-jewelry.vn',
    openingHours: '09:00 - 21:30 (Thứ 2 - Chủ Nhật)',
    isFlagship: false,
    coordinates: { lat: 10.7852, lng: 106.7088 },
    services: [
      'Phòng thử trang sức riêng biệt chuẩn 5 sao',
      'Bộ sưu tập nhẫn cưới & nhẫn cầu hôn Eternity mới nhất',
      'Hỗ trợ trả góp 0% lãi suất thẻ tín dụng',
      'Bảo hành & thu đổi toàn quốc'
    ],
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80',
    status: 'active'
  }
];

// Combine all for db.json
const FULL_DB = {
  meta: {
    exportDate: new Date().toISOString(),
    storeName: '3AE Diamond & Fine Jewelry',
    version: '2.0.0',
    totalCollections: 8,
    counts: {
      stores: STORES.length,
      categories: INITIAL_CATEGORIES.length,
      products: INITIAL_PRODUCTS.length,
      users: INITIAL_USERS.length,
      orders: INITIAL_ORDERS.length,
      coupons: INITIAL_COUPONS.length,
      banners: INITIAL_BANNERS.length,
      reviews: INITIAL_REVIEWS.length
    }
  },
  storeInfo: STORE_INFO,
  stores: STORES,
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  users: INITIAL_USERS,
  orders: INITIAL_ORDERS,
  coupons: INITIAL_COUPONS,
  banners: INITIAL_BANNERS,
  reviews: INITIAL_REVIEWS
};

// Write individual JSON files
fs.writeFileSync(path.join(dbDir, 'db.json'), JSON.stringify(FULL_DB, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'stores.json'), JSON.stringify(STORES, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'categories.json'), JSON.stringify(INITIAL_CATEGORIES, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'products.json'), JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'users.json'), JSON.stringify(INITIAL_USERS, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'orders.json'), JSON.stringify(INITIAL_ORDERS, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'coupons.json'), JSON.stringify(INITIAL_COUPONS, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'banners.json'), JSON.stringify(INITIAL_BANNERS, null, 2), 'utf8');
fs.writeFileSync(path.join(dbDir, 'reviews.json'), JSON.stringify(INITIAL_REVIEWS, null, 2), 'utf8');

console.log('✅ Generated all JSON database files in:', dbDir);

// 2. Generate SQL file
function escapeSql(str: any) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return str;
  if (typeof str === 'boolean') return str ? 1 : 0;
  return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

let sql = `-- ==========================================================
-- CƠ SỞ DỮ LIỆU CỬA HÀNG TRANG SỨC & KIM CƯƠNG 3AE JEWELRY
-- Hệ thống: 3AE Diamond & Fine Jewelry (Lumière Jewelry)
-- Ngày tạo: ${new Date().toISOString()}
-- Chuẩn tương thích: MySQL / MariaDB / PostgreSQL / SQLite
-- ==========================================================

-- Tạo cơ sở dữ liệu nếu dùng MySQL
CREATE DATABASE IF NOT EXISTS \`lumiere_jewelry\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`lumiere_jewelry\`;

-- Tắt kiểm tra khóa ngoại khi import
SET FOREIGN_KEY_CHECKS = 0;

-- 1. BẢNG CHI NHÁNH CỬA HÀNG / SHOWROOMS
DROP TABLE IF EXISTS \`stores\`;
CREATE TABLE \`stores\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`name\` VARCHAR(255) NOT NULL,
  \`type\` VARCHAR(100) DEFAULT 'Showroom',
  \`address\` VARCHAR(500) NOT NULL,
  \`ward\` VARCHAR(100),
  \`district\` VARCHAR(100),
  \`city\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(50) NOT NULL,
  \`email\` VARCHAR(100),
  \`opening_hours\` VARCHAR(100) DEFAULT '08:30 - 21:30',
  \`is_flagship\` TINYINT(1) DEFAULT 0,
  \`latitude\` DECIMAL(10, 6),
  \`longitude\` DECIMAL(10, 6),
  \`services\` TEXT,
  \`image\` VARCHAR(500),
  \`status\` VARCHAR(20) DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. BẢNG DANH MỤC TRANG SỨC
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL UNIQUE,
  \`description\` TEXT,
  \`image\` VARCHAR(500),
  \`item_count\` INT DEFAULT 0,
  \`featured\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BẢNG SẢN PHẨM TRANG SỨC & KIM CƯƠNG
DROP TABLE IF EXISTS \`products\`;
CREATE TABLE \`products\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`sku\` VARCHAR(100) NOT NULL UNIQUE,
  \`name\` VARCHAR(500) NOT NULL,
  \`slug\` VARCHAR(500) NOT NULL UNIQUE,
  \`category_id\` VARCHAR(50) NOT NULL,
  \`category_name\` VARCHAR(255),
  \`description\` TEXT,
  \`short_description\` TEXT,
  \`price\` BIGINT NOT NULL,
  \`sale_price\` BIGINT,
  \`material\` VARCHAR(100),
  \`size\` VARCHAR(50),
  \`diamond_shape\` VARCHAR(50),
  \`carat\` DECIMAL(4, 2),
  \`color\` VARCHAR(10),
  \`clarity\` VARCHAR(20),
  \`cut\` VARCHAR(50),
  \`certificate\` VARCHAR(50) DEFAULT 'GIA',
  \`certificate_number\` VARCHAR(100),
  \`stock\` INT DEFAULT 5,
  \`sold\` INT DEFAULT 0,
  \`featured\` TINYINT(1) DEFAULT 0,
  \`is_best_seller\` TINYINT(1) DEFAULT 0,
  \`is_new_arrival\` TINYINT(1) DEFAULT 0,
  \`status\` VARCHAR(20) DEFAULT 'active',
  \`rating\` DECIMAL(2, 1) DEFAULT 5.0,
  \`review_count\` INT DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- BẢNG HÌNH ẢNH SẢN PHẨM
DROP TABLE IF EXISTS \`product_images\`;
CREATE TABLE \`product_images\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` VARCHAR(50) NOT NULL,
  \`image_url\` VARCHAR(500) NOT NULL,
  \`sort_order\` INT DEFAULT 0,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. BẢNG NGƯỜI DÙNG & TÀI KHOẢN
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`phone\` VARCHAR(50),
  \`password\` VARCHAR(255) DEFAULT 'Customer@123',
  \`role\` VARCHAR(20) DEFAULT 'customer',
  \`address\` VARCHAR(500),
  \`avatar\` VARCHAR(500),
  \`is_phone_verified\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. BẢNG MÃ GIẢM GIÁ / VOUCHER
DROP TABLE IF EXISTS \`coupons\`;
CREATE TABLE \`coupons\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`code\` VARCHAR(50) NOT NULL UNIQUE,
  \`discount_type\` VARCHAR(20) NOT NULL,
  \`discount_value\` BIGINT NOT NULL,
  \`min_order_value\` BIGINT DEFAULT 0,
  \`max_discount\` BIGINT,
  \`expiry_date\` DATE,
  \`usage_limit\` INT DEFAULT 100,
  \`used_count\` INT DEFAULT 0,
  \`status\` VARCHAR(20) DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. BẢNG ĐƠN HÀNG
DROP TABLE IF EXISTS \`orders\`;
CREATE TABLE \`orders\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`order_code\` VARCHAR(100) NOT NULL UNIQUE,
  \`user_id\` VARCHAR(50),
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`customer_phone\` VARCHAR(50) NOT NULL,
  \`customer_email\` VARCHAR(255),
  \`province\` VARCHAR(100),
  \`district\` VARCHAR(100),
  \`ward\` VARCHAR(100),
  \`street_address\` VARCHAR(500),
  \`subtotal\` BIGINT NOT NULL,
  \`vat_rate\` INT DEFAULT 10,
  \`vat_amount\` BIGINT DEFAULT 0,
  \`discount\` BIGINT DEFAULT 0,
  \`coupon_code\` VARCHAR(50),
  \`shipping_fee\` BIGINT DEFAULT 0,
  \`total\` BIGINT NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'BANK_TRANSFER',
  \`payment_status\` VARCHAR(50) DEFAULT 'Chưa thanh toán',
  \`order_status\` VARCHAR(50) DEFAULT 'Chờ xác nhận',
  \`note\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- BẢNG CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG
DROP TABLE IF EXISTS \`order_items\`;
CREATE TABLE \`order_items\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`order_id\` VARCHAR(50) NOT NULL,
  \`product_id\` VARCHAR(50) NOT NULL,
  \`product_name\` VARCHAR(500) NOT NULL,
  \`product_sku\` VARCHAR(100),
  \`product_image\` VARCHAR(500),
  \`price\` BIGINT NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`size\` VARCHAR(50),
  \`material\` VARCHAR(100),
  FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. BẢNG ĐÁNH GIÁ CỦA KHÁCH HÀNG
DROP TABLE IF EXISTS \`reviews\`;
CREATE TABLE \`reviews\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`product_id\` VARCHAR(50) NOT NULL,
  \`user_id\` VARCHAR(50),
  \`user_name\` VARCHAR(255) NOT NULL,
  \`user_avatar\` VARCHAR(500),
  \`rating\` INT DEFAULT 5,
  \`comment\` TEXT,
  \`is_verified_purchase\` TINYINT(1) DEFAULT 1,
  \`status\` VARCHAR(20) DEFAULT 'approved',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. BẢNG BANNER QUẢNG CÁO
DROP TABLE IF EXISTS \`banners\`;
CREATE TABLE \`banners\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(500),
  \`image\` VARCHAR(500) NOT NULL,
  \`link\` VARCHAR(255),
  \`button_text\` VARCHAR(100),
  \`position\` VARCHAR(50) DEFAULT 'hero',
  \`status\` VARCHAR(20) DEFAULT 'active',
  \`sort_order\` INT DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ==========================================================

-- Chèn Showrooms
`;

STORES.forEach(s => {
  sql += `INSERT INTO \`stores\` (\`id\`, \`code\`, \`name\`, \`type\`, \`address\`, \`ward\`, \`district\`, \`city\`, \`phone\`, \`email\`, \`opening_hours\`, \`is_flagship\`, \`latitude\`, \`longitude\`, \`services\`, \`image\`, \`status\`) VALUES (${escapeSql(s._id)}, ${escapeSql(s.code)}, ${escapeSql(s.name)}, ${escapeSql(s.type)}, ${escapeSql(s.address)}, ${escapeSql(s.ward)}, ${escapeSql(s.district)}, ${escapeSql(s.city)}, ${escapeSql(s.phone)}, ${escapeSql(s.email)}, ${escapeSql(s.openingHours)}, ${s.isFlagship ? 1 : 0}, ${s.coordinates.lat}, ${s.coordinates.lng}, ${escapeSql(s.services.join('; '))}, ${escapeSql(s.image)}, ${escapeSql(s.status)});\n`;
});

sql += `\n-- Chèn Categories\n`;
INITIAL_CATEGORIES.forEach(c => {
  sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`description\`, \`image\`, \`item_count\`, \`featured\`) VALUES (${escapeSql(c._id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.description)}, ${escapeSql(c.image)}, ${c.itemCount || 0}, ${c.featured ? 1 : 0});\n`;
});

sql += `\n-- Chèn Users\n`;
INITIAL_USERS.forEach(u => {
  const pwd = u.role === 'admin' ? 'Admin@123' : 'Customer@123';
  sql += `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password\`, \`role\`, \`address\`, \`avatar\`, \`is_phone_verified\`) VALUES (${escapeSql(u._id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.phone)}, ${escapeSql(pwd)}, ${escapeSql(u.role)}, ${escapeSql(u.address)}, ${escapeSql(u.avatar)}, 1);\n`;
});

sql += `\n-- Chèn Coupons\n`;
INITIAL_COUPONS.forEach(c => {
  sql += `INSERT INTO \`coupons\` (\`id\`, \`code\`, \`discount_type\`, \`discount_value\`, \`min_order_value\`, \`max_discount\`, \`expiry_date\`, \`usage_limit\`, \`used_count\`, \`status\`) VALUES (${escapeSql(c._id)}, ${escapeSql(c.code)}, ${escapeSql(c.discountType)}, ${c.discountValue}, ${c.minOrderValue || 0}, ${c.maxDiscount || 'NULL'}, ${escapeSql(c.expiryDate)}, ${c.usageLimit || 100}, ${c.usedCount || 0}, ${escapeSql(c.status)});\n`;
});

sql += `\n-- Chèn Products & Product Images\n`;
INITIAL_PRODUCTS.forEach(p => {
  sql += `INSERT INTO \`products\` (\`id\`, \`sku\`, \`name\`, \`slug\`, \`category_id\`, \`category_name\`, \`description\`, \`short_description\`, \`price\`, \`sale_price\`, \`material\`, \`size\`, \`diamond_shape\`, \`carat\`, \`color\`, \`clarity\`, \`cut\`, \`certificate\`, \`certificate_number\`, \`stock\`, \`sold\`, \`featured\`, \`is_best_seller\`, \`is_new_arrival\`, \`status\`, \`rating\`, \`review_count\`) VALUES (${escapeSql(p._id)}, ${escapeSql(p.sku)}, ${escapeSql(p.name)}, ${escapeSql(p.slug)}, ${escapeSql(p.categoryId)}, ${escapeSql(p.categoryName)}, ${escapeSql(p.description)}, ${escapeSql(p.shortDescription || '')}, ${p.price}, ${p.salePrice || 'NULL'}, ${escapeSql(p.material)}, ${escapeSql(p.size || '')}, ${escapeSql(p.diamondShape || '')}, ${p.carat || 'NULL'}, ${escapeSql(p.color || '')}, ${escapeSql(p.clarity || '')}, ${escapeSql(p.cut || '')}, ${escapeSql(p.certificate || 'GIA')}, ${escapeSql(p.certificateNumber || '')}, ${p.stock || 5}, ${p.sold || 0}, ${p.featured ? 1 : 0}, ${p.isBestSeller ? 1 : 0}, ${p.isNewArrival ? 1 : 0}, ${escapeSql(p.status || 'active')}, ${p.rating || 5.0}, ${p.reviewCount || 0});\n`;

  if (p.images && p.images.length > 0) {
    p.images.forEach((img, idx) => {
      sql += `INSERT INTO \`product_images\` (\`product_id\`, \`image_url\`, \`sort_order\`) VALUES (${escapeSql(p._id)}, ${escapeSql(img)}, ${idx});\n`;
    });
  }
});

sql += `\n-- Chèn Orders & Order Items\n`;
INITIAL_ORDERS.forEach(o => {
  const vatAmount = Math.round(((o.subtotal || 0) - (o.discount || 0)) * 0.10);
  sql += `INSERT INTO \`orders\` (\`id\`, \`order_code\`, \`user_id\`, \`customer_name\`, \`customer_phone\`, \`customer_email\`, \`province\`, \`district\`, \`ward\`, \`street_address\`, \`subtotal\`, \`vat_rate\`, \`vat_amount\`, \`discount\`, \`coupon_code\`, \`shipping_fee\`, \`total\`, \`payment_method\`, \`payment_status\`, \`order_status\`, \`note\`) VALUES (${escapeSql(o._id)}, ${escapeSql(o.orderCode)}, ${escapeSql(o.userId)}, ${escapeSql(o.customerInfo?.fullName)}, ${escapeSql(o.customerInfo?.phone)}, ${escapeSql(o.customerInfo?.email)}, ${escapeSql(o.shippingAddress?.province)}, ${escapeSql(o.shippingAddress?.district)}, ${escapeSql(o.shippingAddress?.ward)}, ${escapeSql(o.shippingAddress?.streetAddress)}, ${o.subtotal}, 10, ${vatAmount}, ${o.discount || 0}, ${escapeSql(o.couponCode || '')}, ${o.shippingFee || 0}, ${o.total}, ${escapeSql(o.paymentMethod)}, ${escapeSql(o.paymentStatus)}, ${escapeSql(o.orderStatus)}, ${escapeSql(o.note || '')});\n`;

  if (o.items && o.items.length > 0) {
    o.items.forEach(item => {
      sql += `INSERT INTO \`order_items\` (\`order_id\`, \`product_id\`, \`product_name\`, \`product_sku\`, \`product_image\`, \`price\`, \`quantity\`, \`size\`, \`material\`) VALUES (${escapeSql(o._id)}, ${escapeSql(item.productId)}, ${escapeSql(item.productName)}, ${escapeSql(item.productSku)}, ${escapeSql(item.productImage)}, ${item.price}, ${item.quantity}, ${escapeSql(item.size || '')}, ${escapeSql(item.material || '')});\n`;
    });
  }
});

sql += `\n-- Chèn Reviews\n`;
INITIAL_REVIEWS.forEach(r => {
  sql += `INSERT INTO \`reviews\` (\`id\`, \`product_id\`, \`user_id\`, \`user_name\`, \`user_avatar\`, \`rating\`, \`comment\`, \`is_verified_purchase\`, \`status\`) VALUES (${escapeSql(r._id)}, ${escapeSql(r.productId)}, ${escapeSql(r.userId)}, ${escapeSql(r.userName)}, ${escapeSql(r.userAvatar || '')}, ${r.rating}, ${escapeSql(r.comment)}, ${r.isVerifiedPurchase ? 1 : 0}, ${escapeSql(r.status)});\n`;
});

sql += `\n-- Chèn Banners\n`;
INITIAL_BANNERS.forEach((b, idx) => {
  sql += `INSERT INTO \`banners\` (\`id\`, \`title\`, \`subtitle\`, \`image\`, \`link\`, \`button_text\`, \`position\`, \`status\`, \`sort_order\`) VALUES (${escapeSql(b._id)}, ${escapeSql(b.title)}, ${escapeSql(b.subtitle || '')}, ${escapeSql(b.image)}, ${escapeSql(b.link)}, ${escapeSql(b.buttonText || '')}, ${escapeSql(b.position)}, ${escapeSql(b.status)}, ${b.order || idx});\n`;
});

sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n-- Kết thúc script import\n`;

fs.writeFileSync(path.join(dbDir, 'lumiere_jewelry.sql'), sql, 'utf8');
console.log('✅ Generated SQL file database/lumiere_jewelry.sql successfully!');
