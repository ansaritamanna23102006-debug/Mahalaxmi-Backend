const Product = require('../models/Product');
const { uploadMultipleImages } = require('../services/uploadService');

// 1. Create a Product (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Parse weightOptions if passed as JSON string
    if (req.body.weightOptionsJson) {
      try {
        productData.weightOptions = JSON.parse(req.body.weightOptionsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.weightOptions) {
      productData.weightOptions = Array.isArray(req.body.weightOptions)
        ? req.body.weightOptions
        : [req.body.weightOptions];
    }

    // Parse images if passed as JSON string
    let images = [];
    if (req.body.imageUrlsJson) {
      try {
        images = JSON.parse(req.body.imageUrlsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    // Handle multiple file uploads if present
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadMultipleImages(req.files);
      images = [...images, ...imageUrls];
    }

    productData.images = images;

    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update a Product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Find the product
    let product = await Product.findById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    // Parse weightOptions if passed as JSON string
    if (req.body.weightOptionsJson) {
      try {
        updateData.weightOptions = JSON.parse(req.body.weightOptionsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.weightOptions) {
      updateData.weightOptions = Array.isArray(req.body.weightOptions)
        ? req.body.weightOptions
        : [req.body.weightOptions];
    }

    // Handle images: URL list vs new files
    let images = [];
    if (req.body.imageUrlsJson) {
      try {
        images = JSON.parse(req.body.imageUrlsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      // Default to existing product images if not explicitly sent/modified
      images = product.images || [];
    }

    // Handle new images upload
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadMultipleImages(req.files);
      images = [...images, ...newImageUrls];
    }

    updateData.images = images;

    // Save changes
    product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// 3. Delete a Product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 4. Query Catalog (Get All with filters, pagination, sort, search)
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
      weight,
      search,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const queryObj = {};

    // A. Category Filter
    if (category) {
      queryObj.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // B. Price Filter (checking regular price or discount price)
    if (minPrice || maxPrice) {
      queryObj.$or = [
        {
          discountPrice: { $gt: 0 },
          $expr: {
            $and: [
              minPrice ? { $gte: ['$discountPrice', parseFloat(minPrice)] } : true,
              maxPrice ? { $lte: ['$discountPrice', parseFloat(maxPrice)] } : true
            ].filter(v => v !== true)
          }
        },
        {
          discountPrice: 0,
          price: {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) })
          }
        }
      ];
    }

    // C. Rating Filter
    if (rating) {
      queryObj.ratings = { $gte: parseFloat(rating) };
    }

    // D. Weight Options Filter
    if (weight) {
      queryObj.weightOptions = { $in: [weight] };
    }

    // E. Search Filter
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // F. Sorting Logic
    let sortQuery = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'priceAsc') sortQuery = { price: 1 };
      else if (sort === 'priceDesc') sortQuery = { price: -1 };
      else if (sort === 'rating') sortQuery = { ratings: -1 };
      else if (sort === 'oldest') sortQuery = { createdAt: 1 };
    }

    // G. Pagination Calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Execute query
    const totalProducts = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      status: 'success',
      results: products.length,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      totalProducts,
      products
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get Product By Slug or ID
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const mongoose = require('mongoose');
    let product;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await Product.findById(slug);
    }

    if (!product) {
      product = await Product.findOne({ slug });
    }

    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      product
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Related Products (Same category, excluding current product)
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const mongoose = require('mongoose');
    let currentProduct;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      currentProduct = await Product.findById(slug);
    }

    if (!currentProduct) {
      currentProduct = await Product.findOne({ slug });
    }

    if (!currentProduct) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    const related = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id }
    })
      .limit(4)
      .sort({ ratings: -1 });

    res.status(200).json({
      status: 'success',
      related
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get Featured Products
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true });
    res.status(200).json({
      status: 'success',
      results: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// 8. Get Best Sellers
exports.getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true });
    res.status(200).json({
      status: 'success',
      results: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// 9. Get Festival Products
exports.getFestivalProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFestivalOffer: true });
    res.status(200).json({
      status: 'success',
      results: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};
