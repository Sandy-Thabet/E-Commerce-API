const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const adminValidation = require('../../validationSchemas/Auth/admin-validation');
const adminAuthController = require('../../controllers/Auth/admin-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const adminAuthRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// signup
adminAuthRouter.post(
  '/signup',
  validation(adminValidation.signup, 'body'),
  adminAuthController.signup
);

// login
adminAuthRouter.post(
  '/login',
  validation(adminValidation.login),
  adminAuthController.login
);

// forget password 3 APIs
adminAuthRouter.post(
  '/forget-password',
  validation(adminValidation.forgetPassword),
  adminAuthController.forgetPassword
);

adminAuthRouter.post(
  '/verify-reset-code',
  validation(adminValidation.validateAdminCode),
  adminAuthController.validateAdminCode
);

adminAuthRouter.post(
  '/set-new-password',
  validation(adminValidation.setNewPassword),
  adminAuthController.setNewPassword
);

// view profile
adminAuthRouter.get(
  '/me',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getMe
);

// update profile
adminAuthRouter.patch(
  '/update-me',
  validation(adminValidation.updateMe),
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.updateMe
);
adminAuthRouter.delete(
  '/logout',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.logout
);

module.exports = adminAuthRouter;
