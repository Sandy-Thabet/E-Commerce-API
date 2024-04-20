const User = require('../database/models/userModel');
const jwt = require('jsonwebtoken');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Merchant = require('../database/models/merchantModel');
const Admin = require('../database/models/admin-model');
const Token = require('../database/models/token-model');

// Sign Up user and sending token
exports.verifyTokenUser = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const isTokenExist = await Token.findOne({
    _id: decoded.token,
    user: decoded.id,
  });

  if (!isTokenExist) throw new AppError('Unauthorized', 401);

  const user = await User.findById(decoded.id);
  if (!user || !token) {
    throw new AppError('Unauthorized', 401);
  }

  req.user = user;
  user.token = isTokenExist;

  next();
});

exports.verifyTokenMerchant = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const isTokenExist = await Token.findOne({
    _id: decoded.token,
    merchant: decoded.id,
  });

  if (!isTokenExist) {
    throw new AppError('Unauthorized', 401);
  }

  const merchant = await Merchant.findById(decoded.id);
  if (!merchant || !token) {
    throw new AppError('Unauthorized', 401);
  }

  req.merchant = merchant;
  merchant.token = isTokenExist;

  next();
});

exports.verifyTokenAdmin = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const isTokenExist = await Token.findOne({
    _id: decoded.token,
    admin: decoded.id,
  });

  if (!isTokenExist) throw new AppError('Unauthorized', 401);

  const admin = await Admin.findById(decoded.id);
  if (!admin || !token) {
    throw new AppError('Unauthorized!', 401);
  }

  req.admin = admin;
  admin.token = isTokenExist;

  next();
});
