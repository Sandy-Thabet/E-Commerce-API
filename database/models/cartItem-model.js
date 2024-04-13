const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartItem = mongoose.model('cart-items', cartItemSchema);

module.exports = CartItem;
