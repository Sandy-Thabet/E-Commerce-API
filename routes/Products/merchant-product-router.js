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
  '/',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  uploadProductImage.single('main_Image'),
  validation(productValidation.createProduct),
  productController.createProduct
);

// get all products
merchantProductRouter.get(
  '/my-products',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getAllMyProducts
);

merchantProductRouter.post(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  uploadProductImage.array('images', 10),
  productController.uploadProductImages
);

// update product
merchantProductRouter.patch(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  uploadProductImage.single('main_Image'),
  validation(productValidation.updateProduct),
  productController.updateProduct
);

// get product
merchantProductRouter.get(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.getProduct
);

// delete product
merchantProductRouter.delete(
  '/:id',
  authorization.verifyTokenMerchant,
  accessMiddleware('merchant', ['active']),
  productController.deleteProduct
);

module.exports = merchantProductRouter;
