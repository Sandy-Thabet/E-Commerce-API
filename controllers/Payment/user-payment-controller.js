const { catchAsync } = require('../../utils/catchAsync');
const userPaymentService = require('../../services/Payment/user-payment-service');
const SuccessResponse = require('../../utils/successResponse');

exports.getCheckout = catchAsync(async (req, res, next) => {
  const checkout = await userPaymentService.getCheckout(
    req.user.id,
    req.body.code
  );

  return res.status(200).json(new SuccessResponse(checkout));
});
