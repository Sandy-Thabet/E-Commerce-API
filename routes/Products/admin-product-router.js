const express = require('express');
const adminProductController = require('../../controllers/Products/admin-product-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const adminProductRouter = express.Router();

// get all products
adminProductRouter.get(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getAllProducts
);

// get merchant's products
adminProductRouter.get(
  '/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getMerchantProducts
);

// get product
adminProductRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getProduct
);

// block product
adminProductRouter.patch(
  '/:id/block',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.blockProduct
);

// unblock product
adminProductRouter.patch(
  '/:id/unblock',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.unblockProduct
);

// approve product
adminProductRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.approveProduct
);

module.exports = adminProductRouter;
