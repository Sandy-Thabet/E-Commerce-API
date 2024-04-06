const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const userCartController = require('../../controllers/Carts/user-cart-controller');
const validationMiddlewares = require('../../middlewares/validateSchema');
const cartValidation = require('../../validationSchemas/Carts/cart-validation');

const userCartRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

userCartRouter.post(
  '/',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  validation(cartValidation.validateCartItem),
  userCartController.addProduct
);

userCartRouter.get(
  '/',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userCartController.getCart
);

userCartRouter.patch(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  validation(cartValidation.validateCartItem),
  userCartController.modifyProductQuantity
);

userCartRouter.delete(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active']),
  userCartController.removeCartProduct
);

module.exports = userCartRouter;
