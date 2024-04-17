const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      // required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupons',
    },
    status: {
      type: String,
      enum: ['unpaid', 'new', 'preparing', 'onWay', 'completed', 'cancelled'],
      default: 'unpaid',
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order-items',
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
