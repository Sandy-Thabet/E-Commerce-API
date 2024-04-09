const express = require('express');
const authorization = require('../../middlewares/authorization');
const validationMiddlewares = require('../../middlewares/validateSchema');
const couponValidation = require('../../validationSchemas/Coupons/coupons-validation');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const adminCouponController = require('../../controllers/Coupons/admin-coupon-controller');

const adminCouponRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

adminCouponRouter.post(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  validation(couponValidation.createCoupon),
  adminCouponController.createCoupon
);

adminCouponRouter.get(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCouponController.getAllCoupons
);

adminCouponRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCouponController.getCoupon
);

adminCouponRouter.patch(
  '/:id/enable',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCouponController.enableCoupon
);

adminCouponRouter.patch(
  '/:id/disable',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCouponController.disableCoupon
);

adminCouponRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  validation(couponValidation.updateCoupon),
  adminCouponController.updateCoupon
);

module.exports = adminCouponRouter;
