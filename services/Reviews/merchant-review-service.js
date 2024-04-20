const Review = require('../../database/models/review-model');
const Product = require('../../database/models/product-model');
const AppError = require('../../utils/appError');

exports.getMyProductReviews = async (merchantId, productId, filter) => {
  try {
    const products = await Product.findOne({
      _id: productId,
      merchant: merchantId,
    });

    if (!products) {
      throw new AppError('No products found for this merchant.', 404);
    }

    const { sort, page, size, ...filters } = filter;

    const totalReviews = await Review.countDocuments({ product: productId });

    const reviews = await Review.find({ product: productId })
      .populate({ path: 'user', select: 'firstName lastName profile_Photo' })
      .skip((page - 1) * size)
      .limit(size)
      .sort(sort);

    return { totalReviews, reviews };
  } catch (err) {
    throw err;
  }
};
