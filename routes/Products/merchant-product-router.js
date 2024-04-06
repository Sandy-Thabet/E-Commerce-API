const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const productController = require('../../controllers/Products/merchant-product-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const productValidation = require('../../validationSchemas/Products/product-validation');
const { uploadProductImage } = require('../../middlewares/uploader');

const merchantProductRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Merchant

// create product
merchantProductRouter.post(
  '/product',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  uploadProductImage.array('product_Image', 10),
  validation(productValidation.createProduct),
  productController.createProduct
);

// update product
merchantProductRouter.patch(
  '/update-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  validation(productValidation.updateProduct),
  productController.updateProduct
);

// get product
merchantProductRouter.get(
  '/product-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getProduct
);

// get all products
merchantProductRouter.get(
  '/my-products',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getAllMyProducts
);

// delete product
merchantProductRouter.get(
  '/delete-product/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.deleteProduct
);

// get active products
merchantProductRouter.get(
  '/products/active/',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getActiveProducts
);

// get pending products
merchantProductRouter.get(
  '/products/pendingAdminApproval',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getPendnigProducts
);

// get blocked products
merchantProductRouter.get(
  '/products/blocked',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getBlockedProducts
);

module.exports = merchantProductRouter;
