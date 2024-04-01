const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const productController = require('../../controllers/Products/user-product-controller');

const userProductRouter = express.Router();

userProductRouter.get(
  '/products',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  productController.getAllProducts
);

userProductRouter.get(
  '/product/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  productController.getProduct
);

module.exports = userProductRouter;
