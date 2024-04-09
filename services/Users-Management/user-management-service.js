const AppError = require('../../utils/appError');
const User = require('../../database/models/userModel');

exports.getAllUsers = async (filter, page, size, sort) => {
  try {
    const query = {};

    const { ...otherFilters } = filter;

    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const totalUsers = await User.find(query);
    const users = await User.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { users, totalUsers };
  } catch (err) {
    throw err;
  }
};

exports.getUser = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

exports.blockUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user || user.status === 'blocked' || user.status === 'inactive') {
      throw new AppError('no user found by this id.', 404);
    }

    const blocked = await User.findByIdAndUpdate(id, { status: 'blocked' });
    blocked.status = 'blocked';
    blocked.validationCode = undefined;

    return blocked;
  } catch (err) {
    throw err;
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user || user.status === 'inactive' || user.status === 'blocked') {
      throw new AppError('no user found by this id.', 404);
    }

    const deleted = await User.findByIdAndUpdate(id, { status: 'inactive' });
    deleted.status = 'inactive';
    deleted.validationCode = undefined;

    return deleted;
  } catch (err) {
    throw err;
  }
};
