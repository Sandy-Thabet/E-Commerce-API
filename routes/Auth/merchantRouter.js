const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const merchantValidation = require('../../validationSchemas/Auth/merchantValidationLayer');
const merchantAuthController = require('../../controllers/Auth/merchantController');
const authorization = require('../../middlewares/authorization');
const MerchantNationalDataValidatin = require('../../validationSchemas/Auth/merchant-national-data-validation');
const Uploader = require('../../middlewares/uploader');

const merchantRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

merchantRouter.post(
  '/signup',
  Uploader.uploadImage.single('national_ID_Image'),
  validation(merchantValidation.signUp, 'body'),
  validation(MerchantNationalDataValidatin.merchantNationalData),
  merchantAuthController.signup
);

merchantRouter.post(
  '/verify-code',
  authorization.verifyTokenMerchant,
  validation(merchantValidation.validateCode, 'body'),
  merchantAuthController.validateCode
);

merchantRouter.get(
  '/verify-code',
  authorization.verifyTokenMerchant,
  merchantAuthController.resendValidationCode
);

merchantRouter.post(
  '/login',
  authorization.verifyTokenMerchant,
  validation(merchantValidation.login),
  merchantAuthController.login
);

merchantRouter.post(
  '/forget-password',
  validation(merchantValidation.checkMerchant),
  merchantAuthController.forgetPassword
);

merchantRouter.post(
  '/verify-reset-code',
  validation(merchantValidation.validateMerchantCode),
  merchantAuthController.validateMerchantCode
);

merchantRouter.post(
  '/set-new-password',
  validation(merchantValidation.setNewPassword),
  merchantAuthController.setNewPassword
);

module.exports = merchantRouter;
