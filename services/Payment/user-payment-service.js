const Cart = require('../../database/models/cart-model');
const { checkAndCreateCart } = require('../Carts/user-cart-service');
const userCouponService = require('../Coupons/user-coupon-service');

exports.getCheckout = async (userId, code) => {
  try {
    const userCart = await checkAndCreateCart(userId);

    let subTotal = 0;
    let discount = 0;

    for (const item of userCart.items) {
      if (!item.product) continue;
      subTotal += item.product.price * item.quantity;
    }
    if (code) {
      const coupon = await userCouponService.checkCode(code);

      discount = subTotal * (coupon.discount_percentage / 100);
    }

    const checkout = {
      items: userCart.items,
      subTotal: subTotal,
      discount: discount,
      totalPrice: subTotal - discount,
    };

    return checkout;
  } catch (err) {
    throw err;
  }
};
