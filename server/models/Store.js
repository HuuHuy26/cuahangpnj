import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Showroom' },
  address: { type: String, required: true },
  ward: { type: String },
  district: { type: String },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  openingHours: { type: String, default: '08:30 - 21:30' },
  isFlagship: { type: Boolean, default: false },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  services: [{ type: String }],
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true,
  _id: false
});

export const Store = mongoose.model('Store', storeSchema);
