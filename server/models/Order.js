import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productSku: { type: String },
  productImage: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  material: { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  orderCode: { type: String, required: true, unique: true },
  userId: { type: String },
  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  shippingAddress: {
    fullName: { type: String },
    phone: { type: String },
    email: { type: String },
    streetAddress: { type: String },
    ward: { type: String },
    district: { type: String },
    province: { type: String },
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  vatAmount: { type: Number, default: 0 },
  vatRate: { type: Number, default: 10 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'BANK_TRANSFER', 'MOMO', 'ZALOPAY', 'VNPAY'], 
    default: 'BANK_TRANSFER' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Chưa thanh toán', 'Đã thanh toán', 'Đã hoàn tiền'], 
    default: 'Chưa thanh toán' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang chuẩn bị', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'], 
    default: 'Chờ xác nhận' 
  },
  isCompanyInvoiceRequested: { type: Boolean, default: false },
  companyInvoice: {
    companyName: { type: String },
    taxCode: { type: String },
    companyAddress: { type: String },
    invoiceEmail: { type: String },
  },
  note: { type: String },
  timeline: [{
    status: { type: String },
    time: { type: String },
    description: { type: String },
  }],
}, {
  timestamps: true,
  _id: false
});

export const Order = mongoose.model('Order', orderSchema);
