const Offer = require('../models/Offer');
const { uploadImage } = require('../services/uploadService');

// 1. Create a Festival Offer (Admin only)
exports.createOffer = async (req, res, next) => {
  try {
    const offerData = { ...req.body };

    if (req.file) {
      const bannerUrl = await uploadImage(req.file);
      offerData.bannerUrl = bannerUrl;
    }

    const offer = await Offer.create(offerData);

    res.status(201).json({
      status: 'success',
      message: 'Festival offer created successfully',
      offer
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get active offers (Available for public/frontend)
exports.getOffers = async (req, res, next) => {
  try {
    const now = new Date();
    // Fetch offers where start date is past and end date is future, and isActive is true
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: offers.length,
      offers
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get all offers (Admin only)
exports.adminGetAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: offers.length,
      offers
    });
  } catch (error) {
    next(error);
  }
};

// 4. Update an Offer (Admin only)
exports.updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    let offer = await Offer.findById(id);
    if (!offer) {
      const err = new Error('Festival offer not found');
      err.statusCode = 404;
      return next(err);
    }

    if (req.file) {
      const bannerUrl = await uploadImage(req.file);
      updateData.bannerUrl = bannerUrl;
    }

    offer = await Offer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      message: 'Festival offer updated successfully',
      offer
    });
  } catch (error) {
    next(error);
  }
};

// 5. Delete an Offer (Admin only)
exports.deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) {
      const err = new Error('Festival offer not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Festival offer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
