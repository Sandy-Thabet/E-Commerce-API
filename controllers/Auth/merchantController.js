const merchantAuthService = require('../../services/Auth/merchantService');
const { catchAsync } = require('../../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const merchant = await merchantAuthService.signUp(req.body);

  return res.status(201).json({
    status: 'success',
    data: merchant,
  });
});

exports.validateCode = catchAsync(async (req, res, next) => {
  const merchant = await merchantAuthService.validateCode(
    req.merchant.id,
    req.body.validationCode
  );

  return res.status(200).json({
    status: 'success',
    data: merchant,
  });
});
