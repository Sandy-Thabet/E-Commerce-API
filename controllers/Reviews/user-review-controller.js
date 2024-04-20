const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const userReviewService = require('../../services/Reviews/user-review-service');

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await userReviewService.createReview(
    req.user.id,
    req.params.id,
    req.body.review,
    req.body.rating
  );

  return res.status(201).json(new SuccessResponse(review));
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
  const reviews = await userReviewService.getProductReviews(req.params.id);

  return res
    .status(201)
    .json(new SuccessResponse({ results: reviews.length, reviews }));
});
