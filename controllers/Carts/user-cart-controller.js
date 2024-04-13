const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');
const userCartService = require('../../services/Carts/user-cart-service');

exports.addProduct = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const body = { productId, quantity };

  const cart = await userCartService.addProduct(req.user.id, body);

  return res
    .status(200)
    .json(new SuccessResponse({ items: cart.items.length, cart }));
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await userCartService.getCart(req.user.id);

  return res
    .status(200)
    .json(new SuccessResponse({ items: cart.items.length, cart }));
});

exports.modifyProductQuantity = catchAsync(async (req, res, next) => {
  const cart = await userCartService.modifyProductQuantity(
    req.user.id,
    req.params.id,
    req.body.quantity
  );

  return res
    .status(200)
    .json(new SuccessResponse({ items: cart.items.length, cart }));
});

exports.removeCartProduct = catchAsync(async (req, res, next) => {
  const cart = await userCartService.removeCartProduct(
    req.user.id,
    req.params.id
  );

  return res
    .status(200)
    .json(new SuccessResponse({ items: cart.items.length, cart }));
});

exports.resetCart = catchAsync(async (req, res, next) => {
  const cart = await userCartService.resetCart(req.user.id);

  return res.status(200).json(new SuccessResponse(cart));
});
