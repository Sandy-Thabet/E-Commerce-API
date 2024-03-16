const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const merchantValidation = require('../../validationSchemas/Auth/merchantValidationLayer');
const merchantAuthController = require('../../controllers/Auth/merchantController');
const authorization = require('../../middlewares/authorization');

const merchantRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

merchantRouter.post(
  '/signup',
  validation(merchantValidation.signUp, 'body'),
  merchantAuthController.signup
);

merchantRouter.post(
  '/verify-code',
  authorization.verifyTokenMerchant,
  validation(merchantValidation.validateCode, 'body'),
  merchantAuthController.validateCode
);

module.exports = merchantRouter;
