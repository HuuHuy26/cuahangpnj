import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';
import { Coupon } from './models/Coupon.js';
import { Store } from './models/Store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '..', 'database');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumiere_jewelry';

function loadJson(fileName) {
  const filePath = path.join(dbDir, fileName);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
}

async function seed() {
  try {
    console.log(`📡 Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected successfully!');

    // Load data from database/ folder
    const stores = loadJson('stores.json');
    const categories = loadJson('categories.json');
    const products = loadJson('products.json');
    const users = loadJson('users.json');
    const orders = loadJson('orders.json');
    const coupons = loadJson('coupons.json');

    // Clear existing collections
    console.log('🧹 Cleaning old collections in database "lumiere_jewelry"...');
    await Promise.all([
      Store.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // Insert seeds
    console.log('📥 Inserting fresh jewelry store dataset...');
    await Promise.all([
      stores.length ? Store.insertMany(stores) : Promise.resolve(),
      products.length ? Product.insertMany(products) : Promise.resolve(),
      categories.length ? Category.insertMany(categories) : Promise.resolve(),
      orders.length ? Order.insertMany(orders) : Promise.resolve(),
      users.length ? User.insertMany(users) : Promise.resolve(),
      coupons.length ? Coupon.insertMany(coupons) : Promise.resolve()
    ]);

    console.log('================================================================');
    console.log('🎉 Seeded Complete Store Database into MongoDB "lumiere_jewelry"!');
    console.log('================================================================');
    console.log(`🏬 Stores / Showrooms: ${stores.length} chi nhánh (Hà Đông, Landmark 72, HCM)`);
    console.log(`📦 Categories:         ${categories.length} danh mục trang sức`);
    console.log(`💎 Products:           ${products.length} sản phẩm kim cương cao cấp`);
    console.log(`👥 Users:              ${users.length} tài khoản (Admin: admin@3ae.vn / Admin@123)`);
    console.log(`🛍️ Orders:             ${orders.length} đơn hàng mẫu`);
    console.log(`🏷️ Coupons:            ${coupons.length} mã voucher giảm giá`);
    console.log('----------------------------------------------------------------');
    console.log('👉 Bạn có thể mở MongoDB Compass và kết nối: mongodb://127.0.0.1:27017');
    console.log('👉 Chọn Database: "lumiere_jewelry" để xem toàn bộ collections.');
    console.log('================================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding MongoDB:', err);
    process.exit(1);
  }
}

seed();
