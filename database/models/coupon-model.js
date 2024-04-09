const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
  },
  active_from: {
    type: Date,
  },
  active_to: {
    type: Date,
  },
  total_usage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['enabled', 'disabled'],
    default: 'enabled',
  },
});

const Coupon = mongoose.model('coupons', couponSchema);
module.exports = Coupon;
