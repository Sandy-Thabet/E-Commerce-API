const Joi = require('joi');

exports.signUp = Joi.object({
  firstName: Joi.string().min(3).max(10).required(),
  lastName: Joi.string().min(3).max(10).required(),
  gender: Joi.string().valid('male', 'female', 'ratherNotToSay').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(24).required(),
});

exports.validateCode = Joi.object({
  validationCode: Joi.string().length(6).required(),
});
