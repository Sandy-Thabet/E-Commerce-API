const User = require('../database/models/userModel');
const jwt = require('jsonwebtoken');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split('Bearer ')[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || !token) {
    throw new AppError('Unauthorized', 401);
  }

  req.user = user;
  next();
});
