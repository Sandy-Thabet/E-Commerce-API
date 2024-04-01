const express = require('express');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const userCategoryController = require('../../controllers/Categories/user-category-controller');

const userCategoryRouter = express.Router();

userCategoryRouter.get(
  '/categories/:id',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userCategoryController.getCategory
);

userCategoryRouter.get(
  '/categories',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userCategoryController.getAllCategory
);

module.exports = userCategoryRouter;
