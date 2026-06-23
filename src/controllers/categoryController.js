const Category = require('../models/Category');
const { uploadImage } = require('../services/uploadService');

// 1. Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      status: 'success',
      results: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get single category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({
      status: 'success',
      category
    });
  } catch (error) {
    next(error);
  }
};

// 3. Create a category (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const categoryData = { ...req.body };

    // Check if category already exists with this name
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') } });
    if (existing) {
      const err = new Error('Category name already exists');
      err.statusCode = 400;
      return next(err);
    }

    // Handle image file upload if present
    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      categoryData.image = imageUrl;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update a category (Admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findById(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }

    const updateData = { ...req.body };

    // Check duplicate name on rename
    if (updateData.name && updateData.name.toLowerCase() !== category.name.toLowerCase()) {
      const existing = await Category.findOne({ name: { $regex: new RegExp(`^${updateData.name}$`, 'i') } });
      if (existing) {
        const err = new Error('Category name already exists');
        err.statusCode = 400;
        return next(err);
      }
    }

    // Handle new image upload
    if (req.file) {
      const imageUrl = await uploadImage(req.file);
      updateData.image = imageUrl;
    }

    category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete a category (Admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
