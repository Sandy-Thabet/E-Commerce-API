const Joi = require('joi');

exports.signup = Joi.object({
  firstName: Joi.string().min(3).max(10).required(),
  lastName: Joi.string().min(3).max(10).required(),
  gender: Joi.string().valid('male', 'female').required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(24).required(),
});

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(24).required(),
});

exports.forgetPassword = Joi.object({
  email: Joi.string().email().required(),
});

exports.validateAdminCode = Joi.object({
  email: Joi.string().email().required(),
  validationCode: Joi.string().length(6).required(),
});

exports.setNewPassword = Joi.object({
  email: Joi.string().email().required(),
  validationCode: Joi.string().length(6).required(),
  password: Joi.string().min(8).max(24).required(),
});
