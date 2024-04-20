const jwt = require('jsonwebtoken');
const Token = require('../../database/models/token-model');

const signToken = async (id) => {
  const token = await Token.create({
    user: id,
    merchant: id,
    admin: id,
  });

  return jwt.sign({ id, token: token.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createToken = async (user) => {
  return await signToken(user._id);
};
