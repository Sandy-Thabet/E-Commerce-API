const express = require('express');
const userAuthController = require('../../controllers/Auth/userController');
const validationMiddlewares = require('../../middlewares/validateSchema');
const userValidations = require('../../validationSchemas/Auth/userValidationLayer');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const User = require('../../database/models/userModel');

const userRouter = express.Router();
const validation = validationMiddlewares.validateSchema; //Delegate

// signup
userRouter.post(
  '/signup',
  validation(userValidations.signUp, 'body'),
  userAuthController.signUp
);

// verify validation code
userRouter.post(
  '/verify-code',
  authorization.verifyTokenUser,
  validation(userValidations.validateCode, 'body'),
  userAuthController.validateCode
);

// resend validation code
userRouter.get(
  '/verify-code',
  authorization.verifyTokenUser,
  userAuthController.resendValidationCode
);

// login
userRouter.post(
  '/login',
  validation(userValidations.login, 'body'),
  userAuthController.login
);

// forget password 3 APIs
userRouter.post(
  '/forget-password',
  validation(userValidations.checkUser),
  userAuthController.forgetPassword
);

userRouter.post(
  '/verify-reset-code',
  validation(userValidations.validateUserCode),
  userAuthController.validateUserCode
);

userRouter.post(
  '/set-new-password',
  validation(userValidations.setNewPassword),
  userAuthController.setNewPassword
);

// view profile
userRouter.get(
  '/me',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userAuthController.getMe
);

userRouter.patch(
  '/update-me',
  authorization.verifyTokenUser,
  accessMiddleware('user', ['active', 'pending']),
  userAuthController.updateMe
);

module.exports = userRouter;
