const {
  getCheckout,
  createPayment,
} = require('../Payment/user-payment-service');
const Order = require('../../database/models/order-model');
const OrderItem = require('../../database/models/orderItem-model');
const { resetCart } = require('../Carts/user-cart-service');
const AppError = require('../../utils/appError');
const { default: mongoose } = require('mongoose');
const Coupon = require('../../database/models/coupon-model');

// exports.placeOrder = async (user, code) => {
//   const session = await mongoose.connection.startSession();
//   console.log('Start Session');

//   try {
//     console.log('Start Transaction');
//     session.startTransaction();

//     const checkout = await getCheckout(user.id, code);

//     if (checkout.checkout.items.length === 0) {
//       throw new AppError('Please add items to cart.', 400);
//     }

//     const order = new Order(
//       {
//         _id: new mongoose.Types.ObjectId(),
//         couponId: checkout.coupon?.id,
//         // createdAt: new Date(),
//         discount: checkout.checkout.discount,
//         subTotal: checkout.checkout.subTotal,
//         total: checkout.checkout.totalPrice,
//       },
//       { session }
//     );
//     console.log(order);
//     console.log('Order Created');

//     let items = [];

//     await order.save({ session });
//     console.log('Order Saved');

//     for (let item of checkout.checkout.items) {
//       items.push(
//         new OrderItem(
//           {
//             price: item.product.price,
//             product: item.product.id,
//             quantity: item.quantity,
//           },
//           { session }
//         ).$session(session)
//       );
//       console.log('OrderItem Loop');
//     }

//     items = await OrderItem.bulkSave(items);

//     order.items = Object.values(items.insertedIds);

//     await order.save({ session });
//     console.log('Order Saved');

//     // Delete all cart items
//     await resetCart(user.id);

//     console.log('here');

//     // Generate payment link
//     const link = await createPayment(user, order);

//     await session.commitTransaction();
//     console.log('Commit Transaction');

//     return { order, link };
//   } catch (err) {
//     await session.abortTransaction();
//     console.log('Abort Transaction');
//     throw err;
//   } finally {
//     await session.endSession();
//     console.log('End Session');
//   }
// };

exports.placeOrder = async (user, code) => {
  const session = await mongoose.connection.startSession();

  let order;
  let link;

  try {
    await session.withTransaction(async () => {
      console.log('Start Transaction');

      const checkout = await getCheckout(user.id, code);

      if (checkout.checkout.items.length === 0) {
        throw new AppError('Please add items to cart.', 400);
      }

      order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: user.id,
        couponId: checkout.coupon?.id,
        discount: checkout.checkout.discount,
        subTotal: checkout.checkout.subTotal,
        total: checkout.checkout.totalPrice,
      });

      console.log('Order Created:', order);

      let items = [];

      for (let item of checkout.checkout.items) {
        items.push(
          new OrderItem({
            price: item.product.price,
            product: item.product.id,
            quantity: item.quantity,
          })
        );
        console.log('OrderItem Loop');
      }

      items = await OrderItem.bulkSave(items);

      order.items = Object.values(items.insertedIds);

      await order.save();

      console.log('Order Saved:', order);

      const couponId = order.couponId;
      const coupon = await Coupon.findById(couponId);
      if (coupon) {
        coupon.total_usage += 1;
        await coupon.save();
      }

      // Delete all cart items
      await resetCart(user.id);
      console.log('Cart Reset');

      if (order.total === 0) {
        order.status = 'new';
        await order.save();
        return order;
      }

      // Generate payment link
      link = await createPayment(user, order);
      console.log('Payment Link Generated:', link);

      return { order, link };
    });
    return { order, link };
  } catch (err) {
    console.log('Abort Transaction');
    throw err;
  } finally {
    await session.endSession();
    console.log('End Session');
  }
};

exports.getAllMyOrders = async (userId, filter) => {
  try {
    const query = { user: userId };

    const { size, page, sort, ...otherFilters } = filter;
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const orders = await Order.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return orders;
  } catch (err) {
    throw err;
  }
};

exports.repayOrder = async (user, orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('No order found by this id.', 404);
    }

    if (order.status !== 'unpaid') {
      throw new AppError('invalid api', 400);
    }

    if (order.total === 0) {
      order.status = 'new';
      await order.save();
      return order;
    }

    link = await createPayment(user, order);
    console.log('Payment Link Generated:', link);

    return { order, link };
  } catch (err) {
    throw err;
  }
};

exports.getOrder = async (userId, orderId) => {
  try {
    const order = await Order.find({ _id: orderId }, { user: userId })
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          match: { status: 'active' },
          populate: { path: 'category' },
        },
      })
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          populate: {
            path: 'merchant',
            match: { status: 'active' },
            select: '-validationCode',
          },
        },
      })
      .select('-user'); //!NOT WORKING

    return order;
  } catch (err) {
    throw err;
  }
};
