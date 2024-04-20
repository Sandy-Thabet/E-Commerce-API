const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const adminReviewController = require('../../controllers/Reviews/admin-review-controller');

const adminReviewRouter = express.Router();

adminReviewRouter.get(
  '/:productId',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminReviewController.getProductReviews
);

module.exports = adminReviewRouter;
