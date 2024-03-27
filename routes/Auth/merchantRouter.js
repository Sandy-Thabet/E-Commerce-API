const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const merchantValidation = require('../../validationSchemas/Auth/merchantValidationLayer');
const merchantAuthController = require('../../controllers/Auth/merchantController');
const authorization = require('../../middlewares/authorization');
const MerchantNationalDataValidatin = require('../../validationSchemas/Auth/merchant-national-data-validation');
const Uploader = require('../../middlewares/uploader');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const productValidation = require('../../validationSchemas/Auth/product-validation');

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

// #Products

// create product
merchantRouter.post(
  '/create-product',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  validation(productValidation.createProduct),
  merchantAuthController.createProduct
);

// update product
merchantRouter.patch(
  '/update-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  validation(productValidation.updateProduct),
  merchantAuthController.updateProduct
);

// get product
merchantRouter.get(
  '/product-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.getProduct
);

// get all products
merchantRouter.get(
  '/products',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.getAllProducts
);

// delete product
merchantRouter.get(
  '/delete-product/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.deleteProduct
);

// !should be in admin routes
// // block product
// merchantRouter.get(
//   '/products/block/:id',
//   authorization.verifyTokenMerchant,
//   accessMiddleware('merchant', ['active']),
//   merchantAuthController.blockProduct
// );

// get active products
merchantRouter.get(
  '/products/active',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.getActiveProducts
);

// get pending products
merchantRouter.get(
  '/products/pendingAdminApproval',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.getPendnigProducts
);

// get blocked products
merchantRouter.get(
  '/products/blocked',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  merchantAuthController.getBlockedProducts
);

module.exports = merchantRouter;
