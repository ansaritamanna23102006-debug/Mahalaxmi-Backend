const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/paymentService');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// 1. Create a New Order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, guestEmail } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!userId && !guestEmail) {
      const err = new Error('Please log in or provide a guest email to complete checkout');
      err.statusCode = 400;
      return next(err);
    }

    // Resolve items, check stock and compile pricing
    let subtotal = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        const err = new Error(`Product not found: ${item.product}`);
        err.statusCode = 404;
        return next(err);
      }

      // Check stock limit
      if (product.stock < item.quantity) {
        const err = new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}`);
        err.statusCode = 400;
        return next(err);
      }

      const activePrice = (product.discountPrice && product.discountPrice > 0) 
        ? product.discountPrice 
        : product.price;

      resolvedItems.push({
        product: product._id,
        name: product.name,
        weight: item.weight,
        quantity: item.quantity,
        price: activePrice
      });

      subtotal += activePrice * item.quantity;
    }

    // Apply Coupon Code details
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: Date.now() }
      });

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round(subtotal * (coupon.discountValue / 100));
        } else {
          discountAmount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    // Shipping calculations (free above 1000, else 80)
    const shippingCharge = subtotal > 1000 ? 0 : 80;
    const total = subtotal - discountAmount + shippingCharge;

    // Create Order in Database
    const orderData = {
      user: userId,
      guestEmail: userId ? req.user.email : guestEmail,
      items: resolvedItems,
      shippingAddress,
      subtotal,
      discountAmount,
      shippingCharge,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    };

    let order = new Order(orderData);
    await order.validate(); // Ensure model hooks generate orderId MM-XXXXXX

    // Handle Payment Integration options
    if (paymentMethod === 'cod') {
      // Direct placement
      order.paymentStatus = 'pending';
      order.orderStatus = 'confirmed'; // COD goes straight to confirmed list
      await order.save();

      // Reduce Inventory Stock
      for (const item of resolvedItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // Clear the Cart
      if (userId) {
        await Cart.findOneAndDelete({ user: userId });
      }

      // Send Invoice Email
      try {
        await sendOrderConfirmationEmail(order.guestEmail, order);
      } catch (mailErr) {
        console.error('COD confirmation email failed to send:', mailErr.message);
      }

      return res.status(201).json({
        status: 'success',
        message: 'Order placed successfully (Cash on Delivery)',
        order
      });
    } else {
      // Create Razorpay Order
      const rzpOrder = await createRazorpayOrder(order.orderId, total);
      
      order.razorpayOrderId = rzpOrder.id;
      await order.save();

      // Clear Cart
      if (userId) {
        await Cart.findOneAndDelete({ user: userId });
      }

      return res.status(201).json({
        status: 'success',
        message: 'Razorpay order generated. Proceed to checkout gateway.',
        orderId: order._id,
        orderIdCode: order.orderId,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key'
      });
    }
  } catch (error) {
    next(error);
  }
};

// 2. Verify Online Payment Signature
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      const err = new Error('Order matching this payment transaction was not found');
      err.statusCode = 404;
      return next(err);
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (isValid) {
      // Update order to Confirmed and Paid
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      order.paidAt = Date.now();
      await order.save();

      // Decrease Inventory Stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      // Send Invoice Email
      try {
        await sendOrderConfirmationEmail(order.guestEmail, order);
      } catch (mailErr) {
        console.error('Invoice email failed to send:', mailErr.message);
      }

      res.status(200).json({
        status: 'success',
        message: 'Payment verified and order confirmed!',
        order
      });
    } else {
      order.paymentStatus = 'failed';
      order.orderStatus = 'pending'; // keep pending or set to cancelled? Pending lets user retry payment
      await order.save();

      const err = new Error('Cryptographic signature verification failed');
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// 3. Webhook Integration (Payment events pushed directly by Razorpay API)
exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret';

    // Verify webhook source signature
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature && webhookSecret !== 'mock_webhook_secret') {
      return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    console.log('[RAZORPAY WEBHOOK] Received event:', event);

    if (event === 'payment.captured') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.razorpayPaymentId = razorpayPaymentId;
        order.paidAt = Date.now();
        await order.save();

        // Reduce stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }

        // Send Invoice Email
        try {
          await sendOrderConfirmationEmail(order.guestEmail, order);
        } catch (mailErr) {
          // ignore
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 4. Retrieve Current User's Orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// 5. Track Order (Both registered users and guests)
exports.trackOrder = async (req, res, next) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      const err = new Error('Please provide orderId (e.g. MM-123456) and guest email to track');
      err.statusCode = 400;
      return next(err);
    }

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
      guestEmail: email.toLowerCase()
    }).populate('items.product');

    if (!order) {
      const err = new Error('Order not found with provided ID and email');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get Order by ID (Self owner or Admin only)
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    // Access control: only owner or administrator can view details
    const isOwner = order.user && order.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const err = new Error('You do not have permission to view this order');
      err.statusCode = 403;
      return next(err);
    }

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

// 7. Cancel Order (Self owner)
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    // Confirm ownership
    if (order.user && order.user.toString() !== req.user.id) {
      const err = new Error('You do not have permission to cancel this order');
      err.statusCode = 403;
      return next(err);
    }

    // Order status must be pending or confirmed to allow cancellations
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      const err = new Error('Order cannot be cancelled because preparation/shipping has already begun.');
      err.statusCode = 400;
      return next(err);
    }

    order.orderStatus = 'cancelled';
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'failed'; // Mark payment failed/refund pending
    }
    await order.save();

    // Restock Products back into inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN FUNCTIONS =================

// 8. Admin View All Orders
exports.adminGetOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    const queryObj = {};

    if (status) queryObj.orderStatus = status;
    if (paymentStatus) queryObj.paymentStatus = paymentStatus;

    const orders = await Order.find(queryObj)
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email mobileNumber');

    res.status(200).json({
      status: 'success',
      results: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// 9. Admin Update Order Status
exports.adminUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
      order.paymentStatus = 'paid'; // COD orders get marked paid upon delivery
    }

    // If cancelling, restock products
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    await order.save();

    res.status(200).json({
      status: 'success',
      message: `Order status updated to ${status} successfully`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// 10. Admin Process Razorpay Refund
exports.adminProcessRefund = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const err = new Error('Order not found');
      err.statusCode = 404;
      return next(err);
    }

    if (order.paymentStatus !== 'paid') {
      const err = new Error('Order payment is not marked as paid, unable to refund.');
      err.statusCode = 400;
      return next(err);
    }

    // Mock Razorpay Refund trigger
    console.log(`[MOCK REFUND] Triggering refund for payment: ${order.razorpayPaymentId} of amount: ₹${order.total}`);
    
    order.paymentStatus = 'refunded';
    order.orderStatus = 'refunded';
    await order.save();

    // Restock catalog products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
