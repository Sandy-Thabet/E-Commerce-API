const merchantProductService = require('../../services/Products/merchant-product-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

// #Products
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await merchantProductService.createProduct(
    req.merchant.id,
    body
  );

  return res.status(201).json(new SuccessResponse(product));
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await merchantProductService.updateProduct(
    req.params.id,
    body,
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(product));
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await merchantProductService.getProduct(req.params.id);

  return res.status(200).json(new SuccessResponse(product));
});

exports.getAllMyProducts = catchAsync(async (req, res, next) => {
  const products = await merchantProductService.getAllMyProducts(
    req.merchant.id
  );

  return res
    .status(200)
    .json(new SuccessResponse({ results: products.length, products }));
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await merchantProductService.deleteProduct(req.params.id, req.merchant.id);

  return res.status(204).json(new SuccessResponse());
});

exports.getActiveProducts = catchAsync(async (req, res, next) => {
  const products = await merchantProductService.getActiveProducts(
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(products));
});

exports.getPendnigProducts = catchAsync(async (req, res, next) => {
  const products = await merchantProductService.getPendnigProducts(
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(products));
});

exports.getBlockedProducts = catchAsync(async (req, res, next) => {
  const products = await merchantProductService.getBlockedProducts(
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(products));
});
