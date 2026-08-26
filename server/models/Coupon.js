import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  expiryDate: { type: String },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'expired', 'disabled'], default: 'active' },
}, {
  timestamps: true,
  _id: false
});

export const Coupon = mongoose.model('Coupon', couponSchema);
