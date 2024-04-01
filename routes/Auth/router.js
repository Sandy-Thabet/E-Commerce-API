const express = require('express');
const userRouter = require('./userRouter');
const merchantRouter = require('./merchantRouter');
const adminRouter = require('./admin-router');
const merchantProductRouter = require('../Products/merchant-product-router');
const adminProductRouter = require('../Products/admin-product-router');
const userProductRouter = require('../Products/user-product-router');
const adminCategoryRouter = require('../Categories/admin-category-router');
const merchantCategoryRouter = require('../Categories/merchant-category-router');
const userCategoryRouter = require('../Categories/user-category-router');

const authRouter = express.Router();

authRouter.use('/users', userRouter, userProductRouter, userCategoryRouter);
authRouter.use(
  '/merchants',
  merchantRouter,
  merchantProductRouter,
  merchantCategoryRouter
);
authRouter.use('/admins', adminRouter, adminProductRouter, adminCategoryRouter);

module.exports = authRouter;
