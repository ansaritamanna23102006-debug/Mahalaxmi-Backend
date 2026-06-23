const Contact = require('../models/Contact');
const { sendContactFormNotification } = require('../services/emailService');

// 1. Submit contact form inquiry
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    const inquiry = await Contact.create({
      name,
      email,
      mobile,
      subject,
      message
    });

    // Notify Administrator via SMTP
    try {
      await sendContactFormNotification(inquiry);
    } catch (mailErr) {
      console.error('Failed to notify administrator of contact inquiry:', mailErr.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Your inquiry has been submitted successfully! We will contact you soon.',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// 2. Fetch all inquiries (Admin only)
exports.getInquiries = async (req, res, next) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: inquiries.length,
      inquiries
    });
  } catch (error) {
    next(error);
  }
};

// 3. Mark Inquiry as resolved (Admin only)
exports.resolveInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Contact.findById(id);

    if (!inquiry) {
      const err = new Error('Inquiry ticket not found');
      err.statusCode = 404;
      return next(err);
    }

    inquiry.isResolved = true;
    await inquiry.save();

    res.status(200).json({
      status: 'success',
      message: 'Inquiry ticket marked as resolved',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};
