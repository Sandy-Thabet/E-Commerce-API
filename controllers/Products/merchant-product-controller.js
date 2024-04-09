const merchantProductService = require('../../services/Products/merchant-product-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

// #Products
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await merchantProductService.createProduct(
    req.merchant.id,
    body,
    req.file
  );

  return res.status(201).json(new SuccessResponse(product));
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category } = req.body;
  const body = { name, description, price, category };

  const product = await merchantProductService.updateProduct(
    req.params.id,
    body,
    req.merchant.id,
    req.file
  );

  return res.status(200).json(new SuccessResponse(product));
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await merchantProductService.getProduct(
    req.params.id,
    req.merchant.id
  );

  return res.status(200).json(new SuccessResponse(product));
});

exports.getAllMyProducts = catchAsync(async (req, res, next) => {
  const { name, status, price, category } = req.query;
  const filter = { name, status, price, category };

  const { totalProducts, products } =
    await merchantProductService.getAllMyProducts(
      req.merchant.id,
      filter,
      req.query.sort,
      req.query.page,
      req.query.size
    );

  return res.status(200).json(
    new SuccessResponse({
      total: totalProducts.length,
      results: products.length,
      products,
    })
  );
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await merchantProductService.deleteProduct(req.params.id, req.merchant.id);

  return res.status(204).json(new SuccessResponse());
});

exports.uploadProductImages = catchAsync(async (req, res, next) => {
  const Images = req.files.map((file) => file.path);

  const { uploaded, updated } =
    await merchantProductService.uploadProductImages(
      req.merchant.id,
      req.params.id,
      Images
    );

  console.log({ Images: uploaded, updated });

  return res.status(200).json(
    new SuccessResponse({
      no_images: uploaded.length,
      Images: uploaded,
      product: updated,
    })
  );
});
