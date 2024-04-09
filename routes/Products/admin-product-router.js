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

// block product
adminProductRouter.patch(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  adminProductController.blockProduct
);

// approve product
adminProductRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.approveProduct
);

// get product
adminProductRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getProduct
);

module.exports = adminProductRouter;
