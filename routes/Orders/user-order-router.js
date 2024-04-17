const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const validationMiddlewares = require('../../middlewares/validateSchema');
// const couponValidation = require('../../validationSchemas/Coupons/coupons-validation');
const userOrderController = require('../../controllers/Orders/user-order-controller');

const validation = validationMiddlewares.validateSchema;

const userOrderRouter = express.Router();

userOrderRouter.post(
  '/',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  //   validation(couponValidation.),
  userOrderController.placeOrder
);

userOrderRouter.get(
  '/',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userOrderController.getAllMyOrders
);

userOrderRouter.patch(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userOrderController.repayOrder
);

userOrderRouter.get(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userOrderController.getOrder
);

module.exports = userOrderRouter;
