import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema({
  headline: { type: String, required: true, default: 'AURA' },
  subheadline: { type: String, required: true, default: 'Crafted Luxury Fragrances' },
  tagline: { type: String, default: 'Pure Artisanal Essence' },
  ctaPrimary: { type: String, default: 'Explore Collection' },
  ctaSecondary: { type: String, default: 'Watch Film' },
  bgVideo: { type: String }, // Cloudinary video URL
  bgImage: { type: String } // Fallback image URL
}, {
  timestamps: true
});

const HeroContent = mongoose.model('HeroContent', heroContentSchema);
export default HeroContent;
