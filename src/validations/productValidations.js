const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Product name is required'
  }),
  category: Joi.string().required().messages({
    'any.required': 'Product category is required'
  }),
  description: Joi.string().required().messages({
    'any.required': 'Product description is required'
  }),
  shortDescription: Joi.string().required().messages({
    'any.required': 'Product short description is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Product price is required'
  }),
  discountPrice: Joi.number().min(0).less(Joi.ref('price')).optional().messages({
    'number.min': 'Discount price cannot be negative',
    'number.less': 'Discount price must be less than regular price'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.min': 'Stock cannot be negative',
    'any.required': 'Product stock is required'
  }),
  sku: Joi.string().required().messages({
    'any.required': 'Product SKU is required'
  }),
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string().uri()
  ).optional(),
  imageUrlsJson: Joi.string().optional(),
  weightOptions: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  weightOptionsJson: Joi.string().optional(),
  isFeatured: Joi.boolean().optional(),
  isBestSeller: Joi.boolean().optional(),
  isFestivalOffer: Joi.boolean().optional(),
  isNewArrival: Joi.boolean().optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string().optional(),
  description: Joi.string().optional(),
  shortDescription: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).when('price', {
    is: Joi.number().required(),
    then: Joi.number().less(Joi.ref('price')),
    otherwise: Joi.number()
  }).optional(),
  stock: Joi.number().integer().min(0).optional(),
  sku: Joi.string().optional(),
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string().uri()
  ).optional(),
  imageUrlsJson: Joi.string().optional(),
  weightOptions: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  weightOptionsJson: Joi.string().optional(),
  isFeatured: Joi.boolean().optional(),
  isBestSeller: Joi.boolean().optional(),
  isFestivalOffer: Joi.boolean().optional(),
  isNewArrival: Joi.boolean().optional()
});

module.exports = {
  createProductSchema,
  updateProductSchema
};

