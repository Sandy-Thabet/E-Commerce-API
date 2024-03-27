const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const adminValidation = require('../../validationSchemas/Auth/admin-validation');
const adminAuthController = require('../../controllers/Auth/admin-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const categoryValidation = require('../../validationSchemas/Auth/category-validation');

const adminRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Auth

// signup
adminRouter.post(
  '/signup',
  validation(adminValidation.signup, 'body'),
  adminAuthController.signup
);

// login
adminRouter.post(
  '/login',
  validation(adminValidation.login),
  adminAuthController.login
);

// forget password 3 APIs
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

// view profile
adminRouter.get(
  '/me',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getMe
);

// update profile
adminRouter.patch(
  '/update-me',
  validation(adminValidation.updateMe),
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.updateMe
);

// #Products

// create category
adminRouter.post(
  '/create-category',
  validation(categoryValidation.createCategory),
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.createCategory
);

// #Managment

/* User */

// get all users
adminRouter.get(
  '/users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getAllUsers
);

// get user
adminRouter.get(
  '/user/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getUser
);

adminRouter.get(
  '/pending-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getPendingUsers
);

adminRouter.get(
  '/active-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getActiveUsers
);

adminRouter.get(
  '/blocked-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getBlockedUsers
);

adminRouter.get(
  '/:id/block-user',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.blockUser
);

adminRouter.get(
  '/:id/delete-user',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.deleteUser
);

/* Merchant */

// approve merchant
adminRouter.get(
  '/approve/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.approveMerchant
);

// get all merchants
adminRouter.get(
  '/merchants',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getAllMerchants
);

//get merchant
adminRouter.get(
  '/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getMerchant
);

// get pending merchants
adminRouter.get(
  '/pending-merchants',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getPendingMerchants
);

adminRouter.get(
  '/pending-approval-merchants',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getPendingApprovalMerchants
);

adminRouter.get(
  '/active-merchants',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getActiveMerchant
);

adminRouter.get(
  //!
  '/:id/block-merchant',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.blockMerchant
);

adminRouter.get(
  '/:id/delete-merchant',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.deleteMerchant
);

// #Products

// approve product
adminRouter.get('');

module.exports = adminRouter;
