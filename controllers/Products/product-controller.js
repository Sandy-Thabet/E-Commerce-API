const productService = require('../../services/Products/product-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

// #Products
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await productService.createProduct(req.merchant.id, body);

  return res.status(201).json(new SuccessResponse(product));
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await productService.updateProduct(
    req.params.id,
    body,
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(product));
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await productService.getProduct(req.params.id);

  return res.status(200).json(new SuccessResponse(product));
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getAllProducts(req.merchant.id);

  return res
    .status(200)
    .json(new SuccessResponse({ results: products.length, products }));
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(req.params.id, req.merchant.id);

  return res.status(204).json(new SuccessResponse());
});
exports.blockProduct = catchAsync(async (req, res, next) => {
  await productService.blockProduct(req.params.id, req.merchant.id);

  return res.status(204).json(new SuccessResponse());
});

exports.getActiveProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getActiveProducts(req.merchant.id);

  return res.status(200).json(new SuccessResponse(products));
});

exports.getPendnigProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getPendnigProducts(req.merchant.id);

  return res.status(200).json(new SuccessResponse(products));
});

exports.getBlockedProducts = catchAsync(async (req, res, next) => {
  const products = await productService.getBlockedProducts(req.merchant.id);

  return res.status(200).json(new SuccessResponse(products));
});
