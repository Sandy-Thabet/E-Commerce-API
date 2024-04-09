const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const merchantCategoryController = require('../../controllers/Categories/merchant-category-controller');

const merchantCategoryRouter = express.Router();

merchantCategoryRouter.get(
  '/',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantCategoryController.getAllCategories
);

merchantCategoryRouter.get(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantCategoryController.getCategory
);

module.exports = merchantCategoryRouter;
