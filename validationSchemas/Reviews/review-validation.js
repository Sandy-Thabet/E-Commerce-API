const Joi = require('joi');

exports.createReview = Joi.object({
  review: Joi.string().min(3).max(30).required(),
  rating: Joi.number().min(1).max(5).required(),
});
