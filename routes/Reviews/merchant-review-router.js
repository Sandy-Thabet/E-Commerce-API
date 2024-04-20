const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const merchantReviewController = require('../../controllers/Reviews/merchant-review-controller');

const merchantReviewRouter = express.Router();

merchantReviewRouter.get(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantReviewController.getMyProductReviews
);

module.exports = merchantReviewRouter;
