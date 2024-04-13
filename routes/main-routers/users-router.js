const express = require('express');
const userAuthRouter = require('../Auth/user-auth-router');
const userProductRouter = require('../Products/user-product-router');
const userCartRouter = require('../Carts/user-cart-router');
const userCategoryRouter = require('../Categories/user-category-router');
const userPaymentRouter = require('../Payment/user-payment-router');
const userOrderRouter = require('../Orders/user-order-router');

const usersRouter = express.Router();

usersRouter.use('/auth', userAuthRouter);
usersRouter.use('/products', userProductRouter);
usersRouter.use('/carts', userCartRouter);
usersRouter.use('/categories', userCategoryRouter);
usersRouter.use('/payment', userPaymentRouter);
usersRouter.use('/orders', userOrderRouter);

module.exports = usersRouter;
