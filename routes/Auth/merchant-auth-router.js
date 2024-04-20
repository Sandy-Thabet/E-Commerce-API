const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const merchantValidation = require('../../validationSchemas/Auth/merchantValidationLayer');
const merchantAuthController = require('../../controllers/Auth/merchant-controller');
const authorization = require('../../middlewares/authorization');
const MerchantNationalDataValidatin = require('../../validationSchemas/Auth/merchant-national-data-validation');
const Uploader = require('../../middlewares/uploader');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const merchantAuthRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Auth

// signup
merchantAuthRouter.post(
  '/signup',
  Uploader.uploadNationalImage.single('national_ID_Image'),
  validation(merchantValidation.signUp, 'body'),
  validation(MerchantNationalDataValidatin.merchantNationalData),
  merchantAuthController.signup
);

// verify validation code
merchantAuthRouter.post(
  '/verify-code',
  authorization.verifyTokenMerchant,
  // accessMiddleware.accessMiddleware('merchant', ['pending']),
  validation(merchantValidation.validateCode, 'body'),
  merchantAuthController.validateCode
);

// resend validation code
merchantAuthRouter.get(
  '/verify-code',
  authorization.verifyTokenMerchant,
  merchantAuthController.resendValidationCode
);

// login
merchantAuthRouter.post(
  '/login',
  validation(merchantValidation.login),
  merchantAuthController.login
);

// forget password 3 APIs
merchantAuthRouter.post(
  '/forget-password',
  validation(merchantValidation.checkMerchant),
  merchantAuthController.forgetPassword
);

merchantAuthRouter.post(
  '/verify-reset-code',
  validation(merchantValidation.validateMerchantCode),
  merchantAuthController.validateMerchantCode
);

merchantAuthRouter.post(
  '/set-new-password',
  validation(merchantValidation.setNewPassword),
  merchantAuthController.setNewPassword
);

// view profile
merchantAuthRouter.get(
  '/me',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active', 'pending']),
  merchantAuthController.getMe
);

// update profile
merchantAuthRouter.patch(
  '/update-me',
  validation(merchantValidation.updateMe),
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active', 'pending']),
  merchantAuthController.updateMe
);

merchantAuthRouter.delete(
  '/logout',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant'),
  merchantAuthController.logout
);

module.exports = merchantAuthRouter;
