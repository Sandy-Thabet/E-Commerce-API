const Order = require('../../database/models/order-model');
const AppError = require('../../utils/appError');

exports.getAllOrders = async (filter) => {
  try {
    // const query = {};
    //! to filter by status only
    const { sort, page, size, status, ...otherFilters } = filter;
    // Object.entries(otherFilters).forEach(([key, value]) => {
    //   if (value !== undefined) {
    //     query[key] = value;
    //   }
    // });

    const totalOrders = await Order.find({ status });
    const orders = await Order.find({ status })
      .populate({ path: 'user', select: 'firstName lastName' })
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { totalOrders, orders };
  } catch (err) {
    throw err;
  }
};

exports.getOrder = async (orderId) => {
  try {
    const isOrder = await Order.findById(orderId);

    if (!isOrder) throw new AppError('No order found by this id.', 404);

    const order = await Order.findById(orderId)
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
      .populate('user');

    return order;
  } catch (err) {
    throw err;
  }
};

exports.updateOrder = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('No order found by this id.', 404);
    }

    const updated = await Order.findByIdAndUpdate(orderId, { status });
    updated.status = status;

    await updated.save();

    return updated;
  } catch (err) {
    throw err;
  }
};
