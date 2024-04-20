const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const validationMiddlewares = require('../../middlewares/validateSchema');
const reviewValidation = require('../../validationSchemas/Reviews/review-validation');
const userReviewController = require('../../controllers/Reviews/user-review-controller');

const userReviewRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

userReviewRouter.post(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  validation(reviewValidation.createReview),
  userReviewController.createReview
);
userReviewRouter.get(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userReviewController.getProductReviews
);

module.exports = userReviewRouter;
