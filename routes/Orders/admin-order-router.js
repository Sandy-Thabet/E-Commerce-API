const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const adminOrderController = require('../../controllers/Orders/admin-order-controller');

const adminOrderRouter = express.Router();

adminOrderRouter.get(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminOrderController.getAllOrders
);

adminOrderRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminOrderController.getOrder
);
adminOrderRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminOrderController.updateOrder
);

module.exports = adminOrderRouter;
