const Address = require('../models/Address');

// Get all addresses for logged in user
exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: addresses.length,
      addresses
    });
  } catch (error) {
    next(error);
  }
};

// Add a new address
exports.addAddress = async (req, res, next) => {
  try {
    const { name, mobile, addressLine, landmark, city, state, pincode, isDefault = false } = req.body;

    // If setting as default, reset other user addresses default flags
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user.id,
      name,
      mobile,
      addressLine,
      landmark,
      city,
      state,
      pincode,
      isDefault
    });

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      address
    });
  } catch (error) {
    next(error);
  }
};

// Update an address
exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, mobile, addressLine, landmark, city, state, pincode, isDefault } = req.body;

    let address = await Address.findOne({ _id: id, user: req.user.id });
    if (!address) {
      const err = new Error('Address not found');
      err.statusCode = 404;
      return next(err);
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    if (name !== undefined) address.name = name;
    if (mobile !== undefined) address.mobile = mobile;
    if (addressLine !== undefined) address.addressLine = addressLine;
    if (landmark !== undefined) address.landmark = landmark;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    next(error);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, user: req.user.id });
    if (!address) {
      const err = new Error('Address not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
