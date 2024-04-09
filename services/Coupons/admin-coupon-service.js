const Coupon = require('../../database/models/coupon-model');
const AppError = require('../../utils/appError');

exports.createCoupon = async (data) => {
  try {
    const coupon = await Coupon.create({
      ...data,
      active_from: new Date(data.active_from),
      active_to: new Date(data.active_to),
    });
    return coupon;
  } catch (err) {
    throw err;
  }
};

exports.getCoupon = async (couponId) => {
  try {
    const coupon = await Coupon.findById(couponId);
    console.log(coupon);

    if (!coupon) {
      throw new AppError('No Coupon found by this id.', 404);
    }

    return coupon;
  } catch (err) {
    throw err;
  }
};

exports.checkCode = async (code) => {
  try {
    console.log(code);
    const coupon = await Coupon.findOne({ code });
    console.log(coupon);

    if (!coupon) {
      throw new AppError('No Coupon found by this id.', 404);
    }

    return coupon;
  } catch (err) {
    throw err;
  }
};

exports.getAllCoupons = async (filter) => {
  try {
    const query = {};

    const { page, size, sort, ...otherFilters } = filter;
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const totalCoupons = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { totalCoupons, coupons };
  } catch (err) {
    throw err;
  }
};

exports.updateCoupon = async (data, couponId) => {
  try {
    console.log(data);
    const { discount_percentage, code } = data;

    const newData = {};

    if (discount_percentage)
      newData.discount_percentage = data.discount_percentage;

    if (code) newData.code = data.code;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new AppError('No Coupons found by this id.', 404);
    }

    console.log(newData);
    await Coupon.updateOne({ _id: coupon.id }, newData);

    const updated = await Coupon.findById(coupon.id);

    return updated;
  } catch (err) {
    throw err;
  }
};

exports.enableCoupon = async (couponId) => {
  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new AppError('No Coupons found by this id.', 404);
    }

    if (coupon.status === 'enabled') {
      throw new AppError('Coupon is already enabled.', 404);
    }

    const enabled = await Coupon.findOneAndUpdate(coupon, {
      status: 'enabled',
    });
    enabled.status = 'enabled';

    return enabled;
  } catch (err) {
    throw err;
  }
};

exports.disableCoupon = async (couponId) => {
  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new AppError('No Coupons found by this id.', 404);
    }

    if (coupon.status === 'disabled') {
      throw new AppError('Coupon is already disabled.', 404);
    }

    const disabled = await Coupon.findOneAndUpdate(coupon, {
      status: 'disabled',
    });
    disabled.status = 'disabled';

    return disabled;
  } catch (err) {
    throw err;
  }
};
