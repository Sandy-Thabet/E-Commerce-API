const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const userPaymentController = require('../../controllers/Payment/user-payment-controller');

const userPaymentRouter = express.Router();

userPaymentRouter.get(
  '/checkout',
  authorization.verifyTokenUser,
  accessMiddleware('user', 'active'),
  userPaymentController.getCheckout
);

module.exports = userPaymentRouter;
