const Joi = require('joi');

exports.createCoupon = Joi.object({
  discount_percentage: Joi.number().required(),
});

exports.updateCoupon = Joi.object({
  discount_percentage: Joi.number(),
});
