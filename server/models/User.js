import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, default: 'Admin@123' },
  address: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isPhoneVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
  _id: false
});

export const User = mongoose.model('User', userSchema);
