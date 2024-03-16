const userAuthService = require('../../services/Auth/userService');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await userAuthService.signUp(req.body);

  return res.status(201).json(new SuccessResponse(user));
});

exports.validateCode = catchAsync(async (req, res, next) => {
  const user = await userAuthService.validateCode(
    req.user.id,
    req.body.validationCode
  );

  return res.status(200).json(new SuccessResponse(user));
});

exports.resendValidationCode = catchAsync(async (req, res, next) => {
  await userAuthService.resendValidationCode(req.user.id);

  return res.status(200).json(
    new SuccessResponse({
      message: 'Code has sent successfully 🚀',
    })
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userAuthService.login(email, password);

  return res.status(200).json(new SuccessResponse(user));
});
