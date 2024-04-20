const Review = require('../../database/models/review-model');
const Product = require('../../database/models/product-model');
const AppError = require('../../utils/appError');

exports.createReview = async (userId, productId, review, rating) => {
  try {
    const product = await Product.findById(productId);

    if (!product || product.status !== 'active') {
      throw new AppError('No Product found by this id.', 404);
    }

    const newReview = await Review.create({
      review,
      rating,
      product: productId,
      user: userId,
    });

    return newReview;
  } catch (err) {
    throw err;
  }
};

exports.getProductReviews = async (productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product || product.status !== 'active') {
      throw new AppError('No Product found by this id.', 404);
    }

    const reviews = await Review.findOne({ product: productId });

    return reviews;
  } catch (err) {
    throw err;
  }
};
