const {
  getCheckout,
  createPayment,
} = require('../Payment/user-payment-service');
const Order = require('../../database/models/order-model');
const OrderItem = require('../../database/models/orderItem-model');
const { resetCart } = require('../Carts/user-cart-service');
const AppError = require('../../utils/appError');
const { default: mongoose } = require('mongoose');

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

      // Delete all cart items
      await resetCart(user.id);
      console.log('Cart Reset');

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
