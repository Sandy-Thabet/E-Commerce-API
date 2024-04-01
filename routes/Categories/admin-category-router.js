const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const adminCategoryController = require('../../controllers/Categories/admin-category-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const categoryValidation = require('../../validationSchemas/Categories/category-validation');

const adminCategoryRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// create category
adminCategoryRouter.post(
  '/create-category',
  validation(categoryValidation.createCategory),
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCategoryController.createCategory
);

adminCategoryRouter.get(
  '/categories/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminCategoryController.getCategory
);

module.exports = adminCategoryRouter;
