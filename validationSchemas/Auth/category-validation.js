const Joi = require('joi');

exports.createCategory = Joi.object({
  name: Joi.string().min(2).max(10).required(),
});
