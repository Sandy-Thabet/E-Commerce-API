const { catchAsync } = require('../../utils/catchAsync');
const adminCouponService = require('../../services/Coupons/admin-coupon-service');
const SuccessResponse = require('../../utils/successResponse');

exports.createCoupon = catchAsync(async (req, res, next) => {
  const coupon = await adminCouponService.createCoupon(req.body);

  return res.status(201).json(new SuccessResponse(coupon));
});

exports.getCoupon = catchAsync(async (req, res, next) => {
  const coupon = await adminCouponService.getCoupon(req.params.id);

  return res.status(200).json(new SuccessResponse(coupon));
});

exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const { totalCoupons, coupons } = await adminCouponService.getAllCoupons(
    req.query
  );

  return res.status(200).json(
    new SuccessResponse({
      total: totalCoupons,
      results: coupons.length,
      coupons,
    })
  );
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { discount_percentage, code } = req.body;
  const data = { discount_percentage, code };

  const coupon = await adminCouponService.updateCoupon(data, req.params.id);

  return res.status(200).json(new SuccessResponse(coupon));
});

exports.enableCoupon = catchAsync(async (req, res, next) => {
  const coupon = await adminCouponService.enableCoupon(req.params.id);

  return res.status(200).json(new SuccessResponse(coupon));
});

exports.disableCoupon = catchAsync(async (req, res, next) => {
  const coupon = await adminCouponService.disableCoupon(req.params.id);

  return res.status(200).json(new SuccessResponse(coupon));
});
