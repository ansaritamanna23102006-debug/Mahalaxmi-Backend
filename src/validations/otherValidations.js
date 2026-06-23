const Joi = require('joi');

const orderCreateSchema = Joi.object({
  guestEmail: Joi.string().email().optional().messages({
    'string.email': 'Please enter a valid guest email'
  }),
  couponCode: Joi.string().optional().allow(''),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().hex().length(24).required().messages({
        'string.length': 'Product ID must be a valid 24-character hex ID'
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.min': 'Quantity must be at least 1'
      }),
      weight: Joi.string().required().messages({
        'any.required': 'Item weight option is required'
      })
    })
  ).min(1).required().messages({
    'array.min': 'At least one item is required to check out'
  }),
  shippingAddress: Joi.object({
    name: Joi.string().required().messages({ 'any.required': 'Recipient name is required' }),
    mobile: Joi.string().required().messages({ 'any.required': 'Contact mobile number is required' }),
    addressLine: Joi.string().required().messages({ 'any.required': 'Street address line is required' }),
    landmark: Joi.string().optional().allow(''),
    city: Joi.string().optional().default('Mumbai'),
    state: Joi.string().optional().default('Maharashtra'),
    pincode: Joi.string().required().messages({ 'any.required': 'Pincode is required' })
  }).required().messages({
    'any.required': 'Shipping address is required'
  }),
  paymentMethod: Joi.string().valid('upi', 'card', 'net', 'cod').required().messages({
    'any.only': 'Payment method must be one of: upi, card, net, cod',
    'any.required': 'Payment method is required'
  })
});

const contactSubmitSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  mobile: Joi.string().required().messages({
    'any.required': 'Mobile phone number is required'
  }),
  subject: Joi.string().min(3).required().messages({
    'any.required': 'Subject line is required'
  }),
  message: Joi.string().min(10).required().messages({
    'string.min': 'Message must be at least 10 characters long',
    'any.required': 'Message body is required'
  })
});

const newsletterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

const couponCreateSchema = Joi.object({
  code: Joi.string().uppercase().required().messages({
    'any.required': 'Coupon code is required'
  }),
  discountType: Joi.string().valid('percentage', 'flat').optional().default('percentage'),
  discountValue: Joi.number().min(0).required().messages({
    'number.min': 'Discount value cannot be negative',
    'any.required': 'Discount value is required'
  }),
  minOrderAmount: Joi.number().min(0).optional().default(0),
  expiryDate: Joi.date().greater('now').required().messages({
    'date.greater': 'Expiry date must be in the future',
    'any.required': 'Expiry date is required'
  })
});

module.exports = {
  orderCreateSchema,
  contactSubmitSchema,
  newsletterSchema,
  couponCreateSchema
};
