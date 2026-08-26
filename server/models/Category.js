import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
}, {
  timestamps: true,
  _id: false
});

export const Category = mongoose.model('Category', categorySchema);
