const Gallery = require('../models/Gallery');
const GalleryCategory = require('../models/GalleryCategory');
const { uploadImage } = require('../services/uploadService');
const { cloudinary } = require('../config/cloudinary');

exports.getAllGalleryImages = async (req, res, next) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: images.length,
      images
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadGalleryImage = async (req, res, next) => {
  try {
    const { title, category } = req.body;

    if (!req.file) {
      const err = new Error('Please upload an image file');
      err.statusCode = 400;
      return next(err);
    }

    const imageUrl = await uploadImage(req.file);

    const newImage = await Gallery.create({
      title: title || '',
      category: category || 'Shop Interior',
      imageUrl: imageUrl
    });

    res.status(201).json({
      status: 'success',
      image: newImage
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      const err = new Error('Gallery image not found');
      err.statusCode = 404;
      return next(err);
    }

    // Attempt to delete from cloudinary if applicable
    if (image.imageUrl && image.imageUrl.includes('cloudinary')) {
      const urlParts = image.imageUrl.split('/');
      const filename = urlParts.pop();
      const folder = urlParts.pop();
      const publicId = `${folder}/${filename.split('.')[0]}`;
      if (cloudinary) {
        await cloudinary.uploader.destroy(publicId).catch(e => console.error('Cloudinary deletion error:', e));
      }
    }

    await image.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getGalleryCategories = async (req, res, next) => {
  try {
    const categories = await GalleryCategory.find().sort({ name: 1 });
    res.status(200).json({
      status: 'success',
      results: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

exports.createGalleryCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      const err = new Error('Please enter a category name');
      err.statusCode = 400;
      return next(err);
    }
    const category = await GalleryCategory.create({ name });
    res.status(201).json({
      status: 'success',
      category
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGalleryCategory = async (req, res, next) => {
  try {
    const category = await GalleryCategory.findById(req.params.id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }
    await category.deleteOne();
    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
