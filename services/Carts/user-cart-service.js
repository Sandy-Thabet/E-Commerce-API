const CartItem = require('../../database/models/cartItem-model');
const Cart = require('../../database/models/cart-model');
const { getProduct } = require('../Products/user-product-service');
const AppError = require('../../utils/appError');

exports.checkAndCreateCart = async (userId) => {
  try {
    const currentCart = await Cart.findOne({ user: userId }).populate({
      path: 'items',
      populate: { path: 'product', match: { status: 'active' } },
    });

    let cart;
    if (!currentCart) {
      cart = await Cart.create({ user: userId });
      return cart;
    }

    currentCart.items = currentCart.items.filter((item) => item.product);

    return currentCart;
  } catch (err) {
    throw err;
  }
};

exports.addProduct = async (userId, body) => {
  try {
    const { productId, quantity } = body;

    await getProduct(productId);

    const cart = await this.checkAndCreateCart(userId);

    const isItemExist = await CartItem.findOne({
      product: productId,
      _id: cart.items,
    });

    if (isItemExist) {
      return cart;
    }

    const newCartItem = await CartItem.create({
      cart: cart.id,
      product: productId,
      quantity: quantity,
    });

    cart.items.push(newCartItem);
    await cart.save();

    return cart;
  } catch (err) {
    throw err;
  }
};

exports.getCart = async (userId) => {
  try {
    return await this.checkAndCreateCart(userId);
  } catch (err) {
    throw err;
  }
};

exports.modifyProductQuantity = async (userId, productId, newQuantity) => {
  try {
    const cart = await this.checkAndCreateCart(userId);

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    // Find the cart item in the cart
    const cartItem = cart.items.find((item) => item.product.equals(productId));

    if (!cartItem) {
      throw new AppError('CartItem not found in the cart', 404);
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();

    return cart;
  } catch (err) {
    throw err;
  }
};

exports.removeCartProduct = async (userId, productId) => {
  try {
    const cart = await this.checkAndCreateCart(userId);

    // Find the cart item in the cart's items array
    const cartItem = cart.items.find((item) =>
      item.product._id.equals(productId)
    );

    if (!cartItem) {
      throw new AppError('CartItem not found in the cart', 404);
    }

    // Delete from items in "cart"
    cart.items = cart.items.filter((item) => item._id !== cartItem._id);
    await cart.save();

    // Delete the cart item from the CartItem model
    await CartItem.deleteOne({ _id: cartItem._id });

    await cart.save();

    return cart;
  } catch (err) {
    throw err;
  }
};

exports.resetCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      await CartItem.deleteMany({ cart: cart.id });
    }

    cart.items = [];

    await cart.save();

    return cart;
  } catch (err) {
    throw err;
  }
};
