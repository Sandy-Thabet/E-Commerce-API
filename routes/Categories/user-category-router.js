const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const userCategoryController = require('../../controllers/Categories/user-category-controller');

const userCategoryRouter = express.Router();

userCategoryRouter.get(
  '/',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userCategoryController.getAllCategories
);

userCategoryRouter.get(
  '/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userCategoryController.getCategory
);

module.exports = userCategoryRouter;
