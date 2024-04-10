const Coupon = require('../../database/models/coupon-model');
const AppError = require('../../utils/appError');

exports.checkCode = async (code) => {
  try {
    const coupon = await Coupon.findOne({ code, status: 'enabled' });

    if (!coupon) {
      throw new AppError('Invalid Coupon Code.', 400);
    }

    if (coupon.active_from && new Date() < new Date(coupon.active_from)) {
      throw new AppError('Invalid Coupon Code.', 400);
    }

    if (coupon.active_to && new Date() > new Date(coupon.active_to)) {
      throw new AppError('Invalid Coupon Code.', 400);
    }

    return coupon;
  } catch (err) {
    throw err;
  }
};
