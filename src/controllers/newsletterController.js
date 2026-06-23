const Newsletter = require('../models/Newsletter');

// 1. Subscribe to Newsletter
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(200).json({
          status: 'success',
          message: 'You are already subscribed to our newsletter updates.'
        });
      } else {
        subscriber.isActive = true;
        await subscriber.save();
        return res.status(200).json({
          status: 'success',
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    subscriber = await Newsletter.create({ email });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for subscribing to Mahalaxmi Mithaiwala updates!'
    });
  } catch (error) {
    next(error);
  }
};

// 2. Unsubscribe from Newsletter
exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber || !subscriber.isActive) {
      const err = new Error('Email address was not found in our active subscriptions');
      err.statusCode = 404;
      return next(err);
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.status(200).json({
      status: 'success',
      message: 'You have been successfully unsubscribed from our updates list.'
    });
  } catch (error) {
    next(error);
  }
};

// 3. Export Subscribers as CSV (Admin only)
exports.exportSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).select('email createdAt');

    // Create CSV content
    let csvContent = 'Email,SubscriptionDate\n';
    subscribers.forEach(sub => {
      csvContent += `${sub.email},${sub.createdAt.toISOString()}\n`;
    });

    // Send as downloadable file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=mahalaxmi_newsletter_subscribers.csv');
    
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// 4. View Subscribers JSON list (Admin only)
exports.getSubscribersList = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: subscribers.length,
      subscribers
    });
  } catch (error) {
    next(error);
  }
};
