const express = require('express');
const merchantProductRouter = require('../Products/merchant-product-router');
const merchantAuthRouter = require('../Auth/merchant-auth-router');
const merchantCategoryRouter = require('../Categories/merchant-category-router');
const merchantReviewRouter = require('../Reviews/merchant-review-router');

const merchantsRouter = express.Router();

merchantsRouter.use('/auth', merchantAuthRouter);
merchantsRouter.use('/products', merchantProductRouter);
merchantsRouter.use('/categories', merchantCategoryRouter);
merchantsRouter.use('/reviews', merchantReviewRouter);

module.exports = merchantsRouter;
