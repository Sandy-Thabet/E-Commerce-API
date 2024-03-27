const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const merchantValidation = require('../../validationSchemas/Auth/merchantValidationLayer');
const merchantAuthController = require('../../controllers/Auth/merchantController');
const authorization = require('../../middlewares/authorization');
const MerchantNationalDataValidatin = require('../../validationSchemas/Auth/merchant-national-data-validation');
const Uploader = require('../../middlewares/uploader');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const merchantRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Auth

// signup
merchantRouter.post(
  '/signup',
  Uploader.uploadImage.single('national_ID_Image'),
  validation(merchantValidation.signUp, 'body'),
  validation(MerchantNationalDataValidatin.merchantNationalData),
  merchantAuthController.signup
);

// verify validation code
merchantRouter.post(
  '/verify-code',
  authorization.verifyTokenMerchant,
  // accessMiddleware.accessMiddleware('merchant', ['pending']),
  validation(merchantValidation.validateCode, 'body'),
  merchantAuthController.validateCode
);

// resend validation code
merchantRouter.get(
  '/verify-code',
  authorization.verifyTokenMerchant,
  merchantAuthController.resendValidationCode
);

// login
merchantRouter.post(
  '/login',
  validation(merchantValidation.login),
  merchantAuthController.login
);

// forget password 3 APIs
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

// view profile
merchantRouter.get(
  '/me',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active', 'pending']),
  merchantAuthController.getMe
);

// update profile
merchantRouter.patch(
  '/update-me',
  validation(merchantValidation.updateMe),
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active', 'pending']),
  merchantAuthController.updateMe
);

module.exports = merchantRouter;
