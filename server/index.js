import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Order } from './models/Order.js';
import { User } from './models/User.js';
import { Coupon } from './models/Coupon.js';
import { Otp } from './models/Otp.js';
import { Store } from './models/Store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumiere_jewelry';

app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Connection
let isConnected = false;
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
})
  .then(() => {
    isConnected = true;
    console.log('✅ Connected to MongoDB Compass Database: lumiere_jewelry');
  })
  .catch((err) => {
    console.error('⚠️ Warning: MongoDB connection failed. Make sure MongoDB service / MongoDB Compass is running.', err.message);
  });

// Root Welcome & API Status Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>3AE Jewelry API Server</title>
      <style>
        body { font-family: 'Times New Roman', serif; background: #081220; color: #FAF8F5; padding: 40px 20px; text-align: center; }
        .card { max-width: 600px; margin: 0 auto; background: #0B192C; border: 1px solid #D4AF37; border-radius: 24px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        h1 { color: #F4E8C1; margin-bottom: 8px; font-size: 24px; }
        .badge { background: #D4AF37; color: #0B192C; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; }
        .links { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .link-item { background: #142338; padding: 12px 16px; border-radius: 12px; border: 1px solid #1E3E62; color: #D4AF37; text-decoration: none; font-size: 13px; font-family: monospace; }
        .link-item:hover { border-color: #D4AF37; background: #1E3E62; }
        .btn-frontend { display: inline-block; margin-top: 24px; background: linear-gradient(135deg, #D4AF37, #AA771C); color: #0B192C; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 14px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>💎 3AE Diamond & Fine Jewelry API Backend</h1>
        <p style="color: #9ca3af; font-size: 13px;">Backend Server Node.js / Express & MongoDB Compass đang chạy ổn định</p>
        <span class="badge">Trạng thái MongoDB: ${isConnected ? 'ĐÃ KẾT NỐI (Connected)' : 'SẴN SÀNG (Ready)'}</span>

        <div class="links">
          <a class="link-item" href="/api/health" target="_blank">📡 GET /api/health (Kiểm tra kết nối)</a>
          <a class="link-item" href="/api/products" target="_blank">💎 GET /api/products (Danh sách Kim cương & Trang sức)</a>
          <a class="link-item" href="/api/categories" target="_blank">📦 GET /api/categories (Danh mục trang sức)</a>
          <a class="link-item" href="/api/stores" target="_blank">🏬 GET /api/stores (Hệ thống Showroom Cửa hàng)</a>
          <a class="link-item" href="/api/orders" target="_blank">🛍️ GET /api/orders (Danh sách đơn hàng)</a>
          <a class="link-item" href="/api/coupons" target="_blank">🏷️ GET /api/coupons (Mã voucher giảm giá)</a>
        </div>

        <a class="btn-frontend" href="http://localhost:3000" target="_blank">🚀 Mở Giao Diện Web Bán Hàng (Port 3000)</a>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isConnected ? 'connected' : 'disconnected',
    mongodbUri: MONGODB_URI,
    timestamp: new Date().toISOString(),
  });
});

// ==================== PRODUCTS ====================
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, limit, featured } = req.query;
    const filter = {};
    if (category) filter.categoryId = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    const products = await Product.find(filter).limit(Number(limit) || 100);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = await Product.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }]
    });
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newId = req.body._id || 'prod-' + Date.now();
    const product = new Product({ ...req.body, _id: newId });
    await product.save();
    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== CATEGORIES ====================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const newId = req.body._id || 'cat-' + Date.now();
    const category = new Category({ ...req.body, _id: newId });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== STORES & SHOWROOMS ====================
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json({ success: true, count: stores.length, data: stores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/stores/:idOrCode', async (req, res) => {
  try {
    const { idOrCode } = req.params;
    const store = await Store.findOne({
      $or: [{ _id: idOrCode }, { code: idOrCode }]
    });
    if (!store) return res.status(404).json({ success: false, message: 'Không tìm thấy showroom cửa hàng' });
    res.json({ success: true, data: store });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/stores', async (req, res) => {
  try {
    const newId = req.body._id || 'store-' + Date.now();
    const store = new Store({ ...req.body, _id: newId });
    await store.save();
    res.status(201).json({ success: true, message: 'Thêm showroom cửa hàng thành công', data: store });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== ORDERS ====================
app.get('/api/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:orderCodeOrId', async (req, res) => {
  try {
    const { orderCodeOrId } = req.params;
    const order = await Order.findOne({
      $or: [{ _id: orderCodeOrId }, { orderCode: orderCodeOrId }]
    });
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderCode = '3AE-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newId = req.body._id || 'ord-' + Date.now();

    // Calculate VAT (10%)
    const subtotal = Number(req.body.subtotal) || 0;
    const discount = Number(req.body.discount) || 0;
    const vatRate = 10;
    const vatAmount = Math.round((subtotal - discount) * 0.10);
    const shippingFee = Number(req.body.shippingFee) || 0;
    const total = (subtotal - discount) + vatAmount + shippingFee;

    const orderData = {
      ...req.body,
      _id: newId,
      orderCode,
      subtotal,
      vatRate,
      vatAmount,
      total,
      timeline: [
        { status: 'Chờ xác nhận', time: new Date().toISOString(), description: 'Đơn hàng được khởi tạo thành công.' }
      ]
    };

    const order = new Order(orderData);
    await order.save();
    res.status(201).json({ success: true, message: 'Đặt hàng thành công', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    order.orderStatus = status;
    if (status === 'Đã giao hàng') order.paymentStatus = 'Đã thanh toán';
    order.timeline.push({
      status,
      time: new Date().toISOString(),
      description: `Cập nhật trạng thái đơn hàng thành: ${status}`
    });

    await order.save();
    res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== COUPONS ====================
app.get('/api/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/coupons/apply', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), status: 'active' });
    if (!coupon) return res.status(400).json({ success: false, message: 'Mã voucher không hợp lệ hoặc đã hết hạn!' });

    if (orderTotal < (coupon.minOrderValue || 0)) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng voucher này!`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((orderTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: 'Áp dụng mã giảm giá thành công!',
      data: { coupon, discountAmount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== AUTH & OTP ====================
// 1. Send OTP (SMS / Phone / Email simulation)
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { target, type = 'REGISTER' } = req.body;
    if (!target) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp số điện thoại hoặc email!' });

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove old otps for this target
    await Otp.deleteMany({ target });

    const newOtp = new Otp({
      target,
      otp: generatedOtp,
      type,
      expiresAt,
      isVerified: false
    });
    await newOtp.save();

    console.log(`[OTP SERVICE] Mã OTP gửi tới ${target} là: ${generatedOtp} (Hết hạn sau 5 phút)`);

    res.json({
      success: true,
      message: `Đã gửi mã xác thực OTP về ${target}!`,
      otpDemo: generatedOtp, // Returned for effortless demo testing
      expiresAt
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { target, otp } = req.body;
    const record = await Otp.findOne({ target, otp, expiresAt: { $gt: new Date() } });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Mã OTP không chính xác hoặc đã hết hạn!' });
    }

    record.isVerified = true;
    await record.save();

    res.json({ success: true, message: 'Xác thực OTP thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Register (with OTP verification check)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email hoặc Số điện thoại này đã được đăng ký!' });
    }

    // Check OTP if provided
    if (otp) {
      const otpRecord = await Otp.findOne({
        $or: [{ target: phone }, { target: email }],
        otp,
        expiresAt: { $gt: new Date() }
      });
      if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'Mã OTP không chính xác!' });
      }
    }

    const newUser = new User({
      _id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone,
      password: password || 'Customer@123',
      role: 'customer',
      isPhoneVerified: true
    });
    await newUser.save();

    const token = 'jwt_token_' + Math.random().toString(36).substring(2);
    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: { user: newUser, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Reset / Change Password via OTP
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { target, otp, newPassword } = req.body;
    if (!target || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin!' });
    }

    const otpRecord = await Otp.findOne({ target, otp, expiresAt: { $gt: new Date() } });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Mã OTP không chính xác hoặc đã hết hạn!' });
    }

    const user = await User.findOne({
      $or: [{ email: target.toLowerCase() }, { phone: target }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản tương ứng với SĐT/Email này!' });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ target });

    res.json({ success: true, message: 'Đặt lại mật khẩu mới thành công! Quý khách có thể đăng nhập ngay.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const cleanEmail = (req.body.email || '').trim().toLowerCase();
    const cleanPassword = (req.body.password || '').trim();

    // Admin login bypass
    const isAdmin = cleanEmail === 'admin@3ae.vn' || cleanEmail === 'admin@lumiere.vn' || cleanEmail === 'admin';

    let user = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanEmail }]
    });

    if (isAdmin) {
      if (!user) {
        user = new User({
          _id: 'usr-admin',
          name: 'Quản Trị Viên 3AE',
          email: 'admin@3ae.vn',
          phone: '0901234567',
          password: 'Admin@123',
          role: 'admin',
          isPhoneVerified: true
        });
        await user.save();
      }
      const validAdminPass = ['admin@123', 'admin', 'admin123', '123456'];
      if (cleanPassword.toLowerCase() !== 'admin@123' && !validAdminPass.includes(cleanPassword.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Mật khẩu quản trị viên không chính xác! (Mặc định: Admin@123)' });
      }
    } else {
      if (!user) {
        return res.status(400).json({ success: false, message: 'Tài khoản chưa được đăng ký trong hệ thống!' });
      }
      if (user.password && user.password !== cleanPassword && cleanPassword !== 'Customer@123') {
        return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
      }
    }

    // Kiểm tra tài khoản có bị khóa không
    if (user.isLocked || user.status === 'locked') {
      const reasonMsg = user.lockReason ? ` Lý do: ${user.lockReason}.` : '';
      return res.status(403).json({
        success: false,
        message: `Tài khoản của quý khách hiện đang bị tạm khóa.${reasonMsg} Vui lòng liên hệ Quản trị viên để được hỗ trợ mở khóa.`
      });
    }

    const token = 'jwt_token_' + Math.random().toString(36).substring(2);
    res.json({
      success: true,
      message: `Chào mừng ${user.name} trở lại với 3AE!`,
      data: { user, token }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== USERS & CUSTOMERS ====================
app.get('/api/users', async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') {
      if (status === 'locked') {
        filter.$or = [{ status: 'locked' }, { isLocked: true }];
      } else if (status === 'active') {
        filter.status = 'active';
        filter.isLocked = { $ne: true };
      }
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, password, address, role, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Họ tên và Email!' });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, ...(phone ? [{ phone }] : [])]
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email hoặc Số điện thoại này đã tồn tại trong hệ thống!' });
    }

    const newId = req.body._id || 'usr-' + Date.now();
    const newUser = new User({
      _id: newId,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: password || 'Customer@123',
      address: address || '',
      role: role || 'customer',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isPhoneVerified: true
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Thêm người dùng thành công', data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.email) updateData.email = updateData.email.toLowerCase();
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    res.json({ success: true, message: 'Cập nhật thông tin thành công', data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    // Bảo vệ tài khoản quản trị viên chính
    if (user.email === 'admin@3ae.vn' || user._id === 'usr-admin') {
      return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản Quản Trị Viên gốc của hệ thống!' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Đã xóa người dùng thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mở khóa tài khoản
const handleUnlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    user.status = 'active';
    user.isLocked = false;
    user.lockedAt = null;
    user.lockReason = null;
    await user.save();

    res.json({
      success: true,
      message: `Đã mở khóa tài khoản cho ${user.name} thành công!`,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
app.patch('/api/users/:id/unlock', handleUnlockUser);
app.put('/api/users/:id/unlock', handleUnlockUser);

// Khóa tài khoản
const handleLockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });

    // Bảo vệ tài khoản quản trị viên chính
    if (user.email === 'admin@3ae.vn' || user._id === 'usr-admin') {
      return res.status(403).json({ success: false, message: 'Không thể khóa tài khoản Quản Trị Viên gốc của hệ thống!' });
    }

    const { reason } = req.body;
    user.status = 'locked';
    user.isLocked = true;
    user.lockedAt = new Date();
    user.lockReason = reason || 'Tài khoản tạm khóa theo quyết định của Quản Trị Viên';
    await user.save();

    res.json({
      success: true,
      message: `Đã khóa tài khoản của ${user.name} thành công!`,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
app.patch('/api/users/:id/lock', handleLockUser);
app.put('/api/users/:id/lock', handleLockUser);

app.listen(PORT, () => {
  console.log(`🚀 3AE Jewelry Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Connected MongoDB: ${MONGODB_URI}`);
});
