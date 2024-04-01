const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const merchantCategoryController = require('../../controllers/Categories/merchant-category-controller');

const merchantCategoryRouter = express.Router();

merchantCategoryRouter.get(
  '/categories/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantCategoryController.getCategory
);

merchantCategoryRouter.get(
  '/categories',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantCategoryController.getAllCategories
);

module.exports = merchantCategoryRouter;
