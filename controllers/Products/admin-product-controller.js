const { getMerchant } = require('../../services/Auth/admin-service');
const adminProductService = require('../../services/Products/admin-product-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.approveProduct = catchAsync(async (req, res, next) => {
  const product = await adminProductService.approveProduct(req.params.id);

  return res.status(200).json(new SuccessResponse(product));
});

exports.blockProduct = catchAsync(async (req, res, next) => {
  await adminProductService.blockProduct(req.params.id, req.merchant.id);

  return res.status(204).json(new SuccessResponse());
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await adminProductService.getProduct(req.params.id);

  return res.status(200).json(new SuccessResponse(product));
});

exports.getMerchantProducts = catchAsync(async (req, res, next) => {
  const products = await adminProductService.getMerchantProducts(req.params.id);
  const merchant = await getMerchant(req.params.id);

  return res.status(200).json(
    new SuccessResponse({
      merchant: merchant.merchant,
      results: products.length,
      products,
    })
  );
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { name, status, price, category, price_from, price_to } = req.query;
  const filter = { name, status, price, category, price_from, price_to };
  const products = await adminProductService.getAllProducts(
    filter,
    req.query.page,
    req.query.size,
    req.query.sort
  );

  return res.status(200).json(
    new SuccessResponse({
      results: products.length,
      products,
    })
  );
});

// exports.getMerchantActiveProducts = catchAsync(async (req, res, next) => {
//   const products = await adminProductService.getMerchantActiveProducts(
//     req.params.id
//   );
//   const merchant = await getMerchant(req.params.id);

//   return res.status(200).json(
//     new SuccessResponse({
//       merchant: merchant.merchant,
//       results: products.length,
//       products,
//     })
//   );
// });

// exports.getAllActiveProducts = catchAsync(async (req, res, next) => {
//   const products = await adminProductService.getAllActiveProducts();
//   console.log(products);
//   console.log(req.params);

//   return res.status(200).json(
//     new SuccessResponse({
//       results: products.length,
//       products,
//     })
//   );
// });