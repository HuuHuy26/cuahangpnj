import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  target: { type: String, required: true }, // Phone or email
  otp: { type: String, required: true },
  type: { type: String, enum: ['REGISTER', 'RESET_PASSWORD', 'LOGIN'], default: 'REGISTER' },
  expiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Otp = mongoose.model('Otp', otpSchema);
