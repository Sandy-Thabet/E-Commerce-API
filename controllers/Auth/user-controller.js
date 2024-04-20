const userAuthService = require('../../services/Auth/userService');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await userAuthService.signUp(req.body);

  return res.status(201).json(new SuccessResponse(user));
});

exports.resendValidationCode = catchAsync(async (req, res, next) => {
  await userAuthService.resendValidationCode(req.user.id);

  return res.status(200).json(
    new SuccessResponse({
      message: 'Code has sent successfully 🚀',
    })
  );
});

exports.validateCode = catchAsync(async (req, res, next) => {
  const user = await userAuthService.validateCode(
    req.user.id,
    req.body.validationCode
  );

  return res.status(200).json(new SuccessResponse(user));
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userAuthService.login(email, password);

  return res.status(200).json(new SuccessResponse(user));
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  await userAuthService.forgetPassword(email);

  return res.status(200).json(new SuccessResponse());
});

exports.validateUserCode = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;

  await userAuthService.validateUserCode(email, code);

  return res.status(200).json(new SuccessResponse());
});

exports.setNewPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;
  const password = req.body.password;

  await userAuthService.setNewPassword(email, code, password);

  const message = `Your password updated successfully.`;
  return res.status(200).json(new SuccessResponse(message));
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await userAuthService.getMe(req.user.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { firstName, lastName, gender, password } = req.body;
  const data = { firstName, lastName, gender, password };

  const user = await userAuthService.updateMe(req.user.id, data);

  return res.status(200).json(new SuccessResponse(user));
});

exports.logout = catchAsync(async (req, res, next) => {
  await userAuthService.logout(req.user.id, req.user.token);

  return res.status(204).send();
});
