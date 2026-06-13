import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all products (with filtering, searching, sorting, and pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    // Filter by Category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search query (name/tagline/description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let queryExec = Product.find(query);

    // Sorting
    if (sort) {
      if (sort === 'price-asc') queryExec = queryExec.sort('price');
      else if (sort === 'price-desc') queryExec = queryExec.sort('-price');
      else if (sort === 'rating') queryExec = queryExec.sort('-avgRating');
      else if (sort === 'newest') queryExec = queryExec.sort('-createdAt');
    } else {
      queryExec = queryExec.sort('-createdAt'); // Default sorting
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skipNum = (pageNum - 1) * limitNum;

    queryExec = queryExec.skip(skipNum).limit(limitNum);

    const products = await queryExec;
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      totalProducts: total,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID (for admin/direct loads)
// @route   GET /api/products/id/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product (Admin Only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, tagline, description, price, stock, scentNotes, isFeatured } = req.body;

    // Parse scentNotes if they come as JSON strings from frontend Form-Data
    let parsedNotes = scentNotes;
    if (typeof scentNotes === 'string') {
      parsedNotes = JSON.parse(scentNotes);
    }

    const images = [];
    let video = '';
    let model3D = '';

    // Handle file uploads to Cloudinary
    if (req.files) {
      if (req.files.images) {
        req.files.images.forEach(file => images.push(file.path));
      }
      if (req.files.video) {
        video = req.files.video[0].path;
      }
      if (req.files.model3D) {
        model3D = req.files.model3D[0].path;
      }
    }

    const product = await Product.create({
      name,
      category,
      tagline,
      description,
      price: Number(price),
      stock: Number(stock || 0),
      scentNotes: parsedNotes,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      images,
      video,
      model3D
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product details (Admin Only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { name, category, tagline, description, price, stock, scentNotes, isFeatured, isActive } = req.body;

    let parsedNotes = scentNotes;
    if (typeof scentNotes === 'string') {
      parsedNotes = JSON.parse(scentNotes);
    }

    const updateFields = {
      name: name || product.name,
      category: category || product.category,
      tagline: tagline || product.tagline,
      description: description || product.description,
      price: price ? Number(price) : product.price,
      stock: stock !== undefined ? Number(stock) : product.stock,
      scentNotes: parsedNotes || product.scentNotes,
      isFeatured: isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : product.isActive
    };

    // If new files are uploaded, update URLs
    if (req.files) {
      if (req.files.images) {
        // Option: Delete previous images from Cloudinary before overwriting
        const newImages = [];
        req.files.images.forEach(file => newImages.push(file.path));
        updateFields.images = newImages;
      }
      if (req.files.video) {
        updateFields.video = req.files.video[0].path;
      }
      if (req.files.model3D) {
        updateFields.model3D = req.files.model3D[0].path;
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete images from Cloudinary (clean-up)
    for (const imgUrl of product.images) {
      const publicId = imgUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`aura_perfumes/${publicId}`).catch(() => {});
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted from catalog'
    });
  } catch (err) {
    next(err);
  }
};
