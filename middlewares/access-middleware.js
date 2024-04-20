const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.accessMiddleware = (userType, userStatus) => {
  return catchAsync(async (req, res, next) => {
    const user = req[userType];

    if (!user || (userStatus && !userStatus.includes(user.status))) {
      throw new AppError('Forbidden!', 403);
    }
    next();
  });
};
