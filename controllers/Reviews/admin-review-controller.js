const { catchAsync } = require('../../utils/catchAsync');
const adminReviewService = require('../../services/Reviews/admin-review-service');
const SuccessResponse = require('../../utils/successResponse');

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const { totalReviews, reviews } = await adminReviewService.getProductReviews(
    req.params.productId,
    req.query
  );

  return res.status(200).json(
    new SuccessResponse({
      total: totalReviews,
      results: reviews.length,
      reviews,
    })
  );
});
