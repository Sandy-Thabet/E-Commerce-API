const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const adminValidation = require('../../validationSchemas/Auth/admin-validation');
const adminAuthController = require('../../controllers/Auth/admin-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const adminAuthRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Auth

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

// #Managment

/* User */

// get all users
adminAuthRouter.get(
  '/users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getAllUsers
);

// get user
adminAuthRouter.get(
  '/user/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getUser
);

adminAuthRouter.get(
  '/pending-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getPendingUsers
);

adminAuthRouter.get(
  '/active-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getActiveUsers
);

adminAuthRouter.get(
  '/blocked-users',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getBlockedUsers
);

adminAuthRouter.get(
  '/:id/block-user',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.blockUser
);

adminAuthRouter.get(
  '/:id/delete-user',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.deleteUser
);

/* Merchant */

// approve merchant
adminAuthRouter.get(
  '/approve/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.approveMerchant
);

// get all merchants
adminAuthRouter.get(
  '/merchants',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getAllMerchants
);

//get merchant
adminAuthRouter.get(
  '/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.getMerchant
);

// // get pending merchants
// adminAuthRouter.get(
//   '/pending-merchants',
//   authorization.verifyTokenAdmin,
//   accessMiddleware('admin'),
//   adminAuthController.getPendingMerchants
// );

// adminAuthRouter.get(
//   '/pending-approval-merchants',
//   authorization.verifyTokenAdmin,
//   accessMiddleware('admin'),
//   adminAuthController.getPendingApprovalMerchants
// );

// adminAuthRouter.get(
//   '/active-merchants',
//   authorization.verifyTokenAdmin,
//   accessMiddleware('admin'),
//   adminAuthController.getActiveMerchant
// );

adminAuthRouter.patch(
  '/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.blockMerchant
);

adminAuthRouter.delete(
  '/merchant/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  adminAuthController.deleteMerchant
);

module.exports = adminAuthRouter;
