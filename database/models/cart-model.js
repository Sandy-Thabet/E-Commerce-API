const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cart-items',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('remove', async function (next) {
  try {
    // Delete all cartItems associated with this cart
    await CartItem.deleteMany({ cart: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
