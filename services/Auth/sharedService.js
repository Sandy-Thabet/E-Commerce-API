const jwt = require('jsonwebtoken');
const User = require('../../database/models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createToken = (user) => {
  const token = signToken(user._id);
  return token;
};
