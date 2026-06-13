import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';

dotenv.config();

const mockProducts = [
  {
    name: 'OUD DE KARACHI',
    category: 'unisex',
    tagline: 'Artisanal Golden Saffron & Warm Oud Wood',
    description: 'An opulent fragrance capturing the spirit of heritage. Rich organic Agarwood blended with warm spices, amberwoods, and local saffron strands.',
    price: 8500,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop'],
    scentNotes: {
      top: ['Saffron', 'Nutmeg', 'Lavender'],
      heart: ['Agarwood (Oud)', 'Patchouli'],
      base: ['Musk', 'Amberwood', 'Sandalwood']
    },
    isFeatured: true,
    isActive: true
  },
  {
    name: 'ROSE IMPÉRIAL',
    category: 'woman',
    tagline: 'Delicate Bulgarian Rose & Soft White Musk',
    description: 'A romantic walk in a blooming garden. Blends velvet red rose petals with sweet lychee heart notes, settling into a long-lasting cashmere musk base.',
    price: 7200,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'],
    scentNotes: {
      top: ['Lychee', 'Bergamot', 'Nutmeg'],
      heart: ['Turkish Rose', 'Peony', 'Petalia'],
      base: ['Cashmere Wood', 'Musk', 'Incense']
    },
    isFeatured: true,
    isActive: true
  },
  {
    name: 'NIGHT ODYSSEY',
    category: 'man',
    tagline: 'Mysterious Midnight Leather & Spiced Cardamom',
    description: 'A bold statement of power and mystery. Dynamic fresh citrus openings contrasted with heavy dry leather, vetiver, and dark wood blends.',
    price: 6800,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop'],
    scentNotes: {
      top: ['Cardamom', 'Pink Pepper', 'Bergamot'],
      heart: ['Lavender', 'Vetiver', 'Sage'],
      base: ['Leather', 'Cedarwood', 'Patchouli']
    },
    isFeatured: true,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfume_brand';
    console.log(`Connecting to database: ${connStr}...`);
    
    await mongoose.connect(connStr);
    console.log('Connected to MongoDB successfully.');

    // 1. Clean existing records
    await User.deleteMany({});
    await Product.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('Cleared existing Users, Products, and Coupons.');

    // 2. Seed Default Administrator Account
    const adminUser = await User.create({
      name: 'Aura Administrator',
      email: 'admin@auraperfumes.com',
      password: 'adminpassword123', // Will be hashed via User pre-save hook
      phone: '03001234567',
      role: 'admin'
    });
    console.log('--- ADMIN ACCOUNT SEEDED ---');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: adminpassword123');
    console.log('----------------------------');

    // 3. Seed Default Test User Account
    const standardUser = await User.create({
      name: 'Customer Test',
      email: 'user@example.com',
      password: 'userpassword123',
      phone: '03217654321',
      role: 'user'
    });
    console.log('--- CUSTOMER ACCOUNT SEEDED ---');
    console.log(`Email: ${standardUser.email}`);
    console.log('Password: userpassword123');
    console.log('-------------------------------');

    // 4. Seed Products
    await Product.insertMany(mockProducts);
    console.log(`Seeded ${mockProducts.length} luxury fragrances successfully.`);

    // 5. Seed a default promo coupon
    await PromoCode.create({
      code: 'AURA10',
      type: 'percent',
      value: 10,
      minOrder: 5000,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    console.log('Seeded active coupon: AURA10 (10% off for orders over Rs. 5000)');

    console.log('Database seeding completed. Closing database connection.');
    await mongoose.connection.close();
    process.exit(0);

  } catch (err) {
    console.error('Seeding crashed with error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
