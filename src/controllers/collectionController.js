const Collection = require('../models/Collection');
const { uploadImage } = require('../services/uploadService');

// 1. Create a Collection (Admin only)
exports.createCollection = async (req, res, next) => {
  try {
    const { title, tagline, description, isActive } = req.body;
    let productsList = [];

    if (req.body.productsJson) {
      try {
        productsList = JSON.parse(req.body.productsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.products) {
      productsList = Array.isArray(req.body.products) ? req.body.products : [req.body.products];
    }

    let imageUrl = req.body.image || '';
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const collection = await Collection.create({
      title,
      tagline,
      description,
      image: imageUrl,
      products: productsList,
      isActive: isActive === 'true' || isActive === true
    });

    res.status(201).json({
      status: 'success',
      message: 'Collection created successfully',
      collection
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update a Collection (Admin only)
exports.updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    let collection = await Collection.findById(id);
    if (!collection) {
      const err = new Error('Collection not found');
      err.statusCode = 404;
      return next(err);
    }

    const { title, tagline, description, isActive } = req.body;
    let productsList = [];

    if (req.body.productsJson) {
      try {
        productsList = JSON.parse(req.body.productsJson);
      } catch (err) {
        // ignore
      }
    } else if (req.body.products) {
      productsList = Array.isArray(req.body.products) ? req.body.products : [req.body.products];
    } else {
      productsList = collection.products || [];
    }

    let imageUrl = req.body.image || collection.image || '';
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    collection = await Collection.findByIdAndUpdate(
      id,
      {
        title,
        tagline,
        description,
        image: imageUrl,
        products: productsList,
        isActive: isActive === 'true' || isActive === true
      },
      { new: true, runValidators: true }
    );

    if (!collection) {
      const err = new Error('Collection not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Collection updated successfully',
      collection
    });
  } catch (error) {
    next(error);
  }
};

// 3. Delete a Collection (Admin only)
exports.deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      const err = new Error('Collection not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get All Collections (Public)
exports.getAllCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find().populate('products');

    res.status(200).json({
      status: 'success',
      results: collections.length,
      collections
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get Single Collection (Public)
exports.getCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id).populate('products');

    if (!collection) {
      const err = new Error('Collection not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      collection
    });
  } catch (error) {
    next(error);
  }
};
