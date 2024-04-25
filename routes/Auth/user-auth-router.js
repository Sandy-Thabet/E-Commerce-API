const express = require('express');
const userAuthController = require('../../controllers/Auth/user-controller');
const validationMiddlewares = require('../../middlewares/validateSchema');
const userValidations = require('../../validationSchemas/Auth/userValidationLayer');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const { uploadUserImage } = require('../../middlewares/uploader');

const userAuthRouter = express.Router();
const validation = validationMiddlewares.validateSchema; //Delegate

// signup
userAuthRouter.post(
  '/signup',
  uploadUserImage.single('profile_Photo'),
  validation(userValidations.signUp, 'body'),
  userAuthController.signUp
);

// verify validation code
userAuthRouter.post(
  '/verify-code',
  authorization.verifyTokenUser,
  validation(userValidations.validateCode, 'body'),
  userAuthController.validateCode
);

// resend validation code
userAuthRouter.get(
  '/verify-code',
  authorization.verifyTokenUser,
  userAuthController.resendValidationCode
);

// login
userAuthRouter.post(
  '/login',
  validation(userValidations.login, 'body'),
  userAuthController.login
);

// forget password 3 APIs
userAuthRouter.post(
  '/forget-password',
  validation(userValidations.checkUser),
  userAuthController.forgetPassword
);

userAuthRouter.post(
  '/verify-code',
  validation(userValidations.validateUserCode),
  userAuthController.validateUserCode
);

userAuthRouter.post(
  '/set-new-password',
  validation(userValidations.setNewPassword),
  userAuthController.setNewPassword
);

// view profile
userAuthRouter.get(
  '/me',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userAuthController.getMe
);

// update profile
userAuthRouter.patch(
  '/update-me',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userAuthController.updateMe
);

// logout
userAuthRouter.delete(
  '/logout',
  authorization.verifyTokenUser,
  accessMiddleware('user'),
  userAuthController.logout
);

module.exports = userAuthRouter;
