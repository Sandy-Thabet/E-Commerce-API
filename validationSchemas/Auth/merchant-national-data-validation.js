const Joi = require('joi');

exports.merchantNationalData = Joi.object({
  fullName: Joi.string().min(9).max(32).required(),
  national_ID: Joi.string().length(14).required(),
});
