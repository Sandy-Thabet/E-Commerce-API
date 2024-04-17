const { catchAsync } = require('../../utils/catchAsync');
const userOrderService = require('../../services/Order/user-order-service');
const SuccessResponse = require('../../utils/successResponse');

exports.placeOrder = catchAsync(async (req, res, next) => {
  const order = await userOrderService.placeOrder(req.user, req.body.code);

  return res.status(201).json(new SuccessResponse(order));
});

exports.getAllMyOrders = catchAsync(async (req, res, next) => {
  const orders = await userOrderService.getAllMyOrders(req.user.id, req.query);

  return res
    .status(200)
    .json(new SuccessResponse({ results: orders.length, orders }));
});

exports.repayOrder = catchAsync(async (req, res, next) => {
  const order = await userOrderService.repayOrder(req.user, req.params.id);

  return res.status(200).json(new SuccessResponse(order));
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await userOrderService.getOrder(req.user.id, req.params.id);

  return res.status(200).json(new SuccessResponse(order));
});
