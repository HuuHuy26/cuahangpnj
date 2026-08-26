import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  discountPercent: { type: Number, default: 0 },
  images: [{ type: String }],
  description: { type: String },
  details: { type: String },
  carat: { type: Number },
  cut: { type: String },
  color: { type: String },
  clarity: { type: String },
  certificate: { type: String, default: 'GIA' },
  material: { type: String },
  gender: { type: String, enum: ['unisex', 'men', 'women'], default: 'women' },
  collectionType: { type: String },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 10 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  sizes: [{ type: String }],
}, {
  timestamps: true,
  _id: false
});

export const Product = mongoose.model('Product', productSchema);
