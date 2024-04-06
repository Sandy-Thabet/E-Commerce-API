const Joi = require('joi');

exports.validateCartItem = Joi.object({
  quantity: Joi.number().min(1).required(),
});
