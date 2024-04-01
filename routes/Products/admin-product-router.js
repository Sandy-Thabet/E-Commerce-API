const express = require('express');
const adminProductController = require('../../controllers/Products/admin-product-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const adminProductRouter = express.Router();

// #Admins

// block product
adminProductRouter.get(
  '/products/block/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  adminProductController.blockProduct
);

// // get all active products
// adminProductRouter.get(
//   '/products/active',
//   authorization.verifyTokenAdmin,
//   accessMiddleware('admin'),
//   adminProductController.getAllActiveProducts
// );

// approve product
adminProductRouter.patch(
  '/products/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.approveProduct
);

// get product
adminProductRouter.get(
  '/products/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getProduct
);

// get all products
adminProductRouter.get(
  '/products',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getAllProducts
);

// get merchant's products
adminProductRouter.get(
  '/products/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminProductController.getMerchantProducts
);

// // get merchant's active products
// adminProductRouter.get(
//   '/products/active/merchant/:id',
//   authorization.verifyTokenAdmin,
//   accessMiddleware('admin'),
//   adminProductController.getMerchantActiveProducts
// );

module.exports = adminProductRouter;
