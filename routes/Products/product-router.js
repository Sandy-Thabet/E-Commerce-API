const express = require('express');
const validationMiddlewares = require('../../middlewares/validateSchema');
const productController = require('../../controllers/Products/product-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');
const productValidation = require('../../validationSchemas/Products/product-validation');

const productRouter = express.Router();
const validation = validationMiddlewares.validateSchema;

// #Merchant

// create product
productRouter.post(
  '/create-product',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  validation(productValidation.createProduct),
  productController.createProduct
);

// update product
productRouter.patch(
  '/update-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  validation(productValidation.updateProduct),
  productController.updateProduct
);

// get product
productRouter.get(
  '/product-:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getProduct
);

// get all products
productRouter.get(
  '/products',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getAllProducts
);

// delete product
productRouter.get(
  '/delete-product/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.deleteProduct
);

// block product
productRouter.get(
  '/products/block/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.blockProduct
);

// get active products
productRouter.get(
  '/products/active',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getActiveProducts
);

// get pending products
productRouter.get(
  '/products/pendingAdminApproval',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getPendnigProducts
);

// get blocked products
productRouter.get(
  '/products/blocked',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getBlockedProducts
);

// #Admins

// approve product
productRouter.get('');

module.exports = productRouter;
