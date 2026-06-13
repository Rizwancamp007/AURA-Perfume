import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a product name'], unique: true },
  slug: { type: String, unique: true },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['man', 'woman', 'unisex']
  },
  tagline: { type: String },
  description: { type: String, required: [true, 'Please add a description'] },
  price: { type: Number, required: [true, 'Please add a price'] },
  dealPrice: { type: Number, default: null },
  dealExpiry: { type: Date },
  images: [{ type: String }], // Cloudinary URLs
  video: { type: String }, // Cloudinary showreel URL
  model3D: { type: String }, // Cloudinary GLB URL
  scentNotes: {
    top: [{ type: String }],
    heart: [{ type: String }],
    base: [{ type: String }]
  },
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Auto-generate slug before save
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
