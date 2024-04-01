const userProductService = require('../../services/Products/user-product-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { name, price, category, merchant, price_from, price_to } = req.query;
  const filter = {
    name,
    price,
    category,
    merchant,
    price_from,
    price_to,
  };

  const products = await userProductService.getAllProducts(
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

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await userProductService.getProduct(req.params.id);

  return res.status(200).json(new SuccessResponse(product));
});
