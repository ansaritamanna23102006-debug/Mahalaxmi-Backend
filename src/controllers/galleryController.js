const Gallery = require('../models/Gallery');
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
