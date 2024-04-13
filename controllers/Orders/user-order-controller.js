const { catchAsync } = require('../../utils/catchAsync');
const userOrderService = require('../../services/Order/user-order-service');
const SuccessResponse = require('../../utils/successResponse');

exports.placeOrder = catchAsync(async (req, res, next) => {
  const order = await userOrderService.placeOrder(req.user.id, req.body.code);

  return res.status(201).json(new SuccessResponse(order));
});
