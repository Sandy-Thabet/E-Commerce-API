const User = require('../models/userModel');
const mongoose = require('mongoose');

exports.createUser = async (user) => {
  try {
    return await User.create(user);
  } catch (err) {
    throw err;
  }
};
