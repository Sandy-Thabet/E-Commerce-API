const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    required: true,
  },
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
