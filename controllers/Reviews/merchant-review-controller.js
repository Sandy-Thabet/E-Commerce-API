const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const merchantReviewService = require('../../services/Reviews/merchant-review-service');

exports.getMyProductReviews = catchAsync(async (req, res, next) => {
  const { totalReviews, reviews } =
    await merchantReviewService.getMyProductReviews(
      req.merchant.id,
      req.params.id,
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
