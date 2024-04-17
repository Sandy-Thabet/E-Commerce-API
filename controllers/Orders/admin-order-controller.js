const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const adminOrderService = require('../../services/Order/admin-order-service');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { totalOrders, orders } = await adminOrderService.getAllOrders(
    req.query
  );

  return res.status(200).json(
    new SuccessResponse({
      total: totalOrders.length,
      results: orders.length,
      orders,
    })
  );
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await adminOrderService.getOrder(req.params.id);

  return res.status(200).json(new SuccessResponse(order));
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await adminOrderService.updateOrder(
    req.params.id,
    req.query.status
  );

  return res.status(200).json(new SuccessResponse(order));
});
