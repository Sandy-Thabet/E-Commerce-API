const Review = require('../../database/models/review-model');

exports.getProductReviews = async (productId, filter) => {
  try {
    const { size, page, sort, ...filters } = filter;

    const totalReviews = await Review.countDocuments({ product: productId });

    const reviews = await Review.find({ product: productId })
      .populate({
        path: 'user',
        select: 'firstName lastName profile_Photo',
      })
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { totalReviews, reviews };
  } catch (err) {
    throw err;
  }
};
