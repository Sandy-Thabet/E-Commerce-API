const Joi = require('joi');

exports.createProduct = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().min(5).max(50).required(),
  price: Joi.number().min(1).max(100000).required(),
  category: Joi.string().required(),
});

exports.updateProduct = Joi.object({
  name: Joi.string().min(3).max(20),
  description: Joi.string().min(5).max(50),
  price: Joi.number().min(1).max(100000),
  category: Joi.string(),
});
