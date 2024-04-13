const { getCheckout } = require('../Payment/user-payment-service');
const Order = require('../../database/models/order-model');
const OrderItem = require('../../database/models/orderItem-model');
const { resetCart } = require('../Carts/user-cart-service');

exports.placeOrder = async (userId, code) => {
  try {
    const checkout = await getCheckout(userId, code);

    const order = new Order({
      couponId: checkout.coupon?.id,
      createdAt: new Date(),
      discount: checkout.checkout.discount,
      subTotal: checkout.checkout.subTotal,
      total: checkout.checkout.totalPrice,
    });

    let items = [];

    await order.save();

    for (let item of checkout.checkout.items) {
      items.push(
        new OrderItem({
          price: item.product.price,
          product: item.product.id,
          quantity: item.quantity,
        })
      );
    }

    items = await OrderItem.bulkSave(items);

    order.items = Object.values(items.insertedIds);

    await order.save();

    // Delete all cart items
    await resetCart(userId);

    // Generate payment link

    return order;
  } catch (err) {
    throw err;
  }
};
