const express = require('express');
const userAuthController = require('../../controllers/Auth/userController');
const validationMiddlewares = require('../../middlewares/validateSchema');
const userValidations = require('../../validationSchemas/Auth/userValidationLayer');
const authorization = require('../../middlewares/authorization');

const userRouter = express.Router();
const validation = validationMiddlewares.validateSchema; //Delegate

userRouter.post(
  '/signup',
  validation(userValidations.signUp, 'body'),
  userAuthController.signUp
);

userRouter.post(
  '/verify-code',
  authorization.verifyTokenUser,
  validation(userValidations.validateCode, 'body'),
  userAuthController.validateCode
);

userRouter.get(
  '/verify-code',
  authorization.verifyTokenUser,
  userAuthController.resendValidationCode
);

userRouter.post(
  '/login',
  validation(userValidations.login, 'body'),
  userAuthController.login
);

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

module.exports = userRouter;
