const userAuthService = require('../../services/Auth/userService');
const { catchAsync } = require('../../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await userAuthService.signUp(req.body);

  return res.status(201).json({
    status: 'success',
    data: user,
  });
});

exports.verificationCode = catchAsync(async (req, res, next) => {
  const user = await userAuthService.validateCode(
    req.user.id,
    req.body.validationCode
  );

  return res.status(200).json({
    status: 'success',
    data: user,
  });
});
