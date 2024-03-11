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
  authorization,
  validation(userValidations.validateCode, 'body'),
  userAuthController.verificationCode
);

module.exports = userRouter;
