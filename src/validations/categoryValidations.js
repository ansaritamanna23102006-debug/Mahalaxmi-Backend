const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Category name is required'
  }),
  description: Joi.string().allow('').optional(),
  image: Joi.string().uri().allow('').optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  image: Joi.string().uri().allow('').optional()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
