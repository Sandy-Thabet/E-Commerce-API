const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const adminValidation = require('../../validationSchemas/Auth/admin-validation');
const adminAuthController = require('../../controllers/Auth/admin-controller');
const authorization = require('../../middlewares/authorization');

const adminRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

adminRouter.post(
  '/signup',
  validation(adminValidation.signup, 'body'),
  adminAuthController.signup
);

adminRouter.post(
  '/login',
  authorization.verifyTokenAdmin,
  validation(adminValidation.login),
  adminAuthController.login
);

adminRouter.post(
  '/forget-password',
  validation(adminValidation.forgetPassword),
  adminAuthController.forgetPassword
);

adminRouter.post(
  '/verify-reset-code',
  validation(adminValidation.validateAdminCode),
  adminAuthController.validateAdminCode
);

adminRouter.post(
  '/set-new-password',
  validation(adminValidation.setNewPassword),
  adminAuthController.setNewPassword
);

module.exports = adminRouter;
