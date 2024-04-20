const adminAuthService = require('../../services/Auth/admin-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.signup = catchAsync(async (req, res, next) => {
  const admin = await adminAuthService.signup(req.body);

  return res.status(201).json(new SuccessResponse(admin));
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const admin = await adminAuthService.login(email, password);

  return res.status(200).json(new SuccessResponse(admin));
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  await adminAuthService.forgetPassword(email);

  return res.status(200).json(new SuccessResponse());
});

exports.validateAdminCode = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;

  await adminAuthService.validateAdminCode(email, code);

  return res.status(200).json(new SuccessResponse());
});

exports.setNewPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;
  const password = req.body.password;

  await adminAuthService.setNewPassword(email, code, password);

  return res.status(200).json(new SuccessResponse());
});

exports.getMe = catchAsync(async (req, res, next) => {
  const admin = await adminAuthService.getMe(req.admin.id);

  return res.status(200).json(new SuccessResponse(admin));
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { firstName, lastName, gender, password } = req.body;
  const data = { firstName, lastName, gender, password };

  const admin = await adminAuthService.updateMe(req.admin.id, data);

  return res.status(200).json(new SuccessResponse(admin));
});

exports.logout = catchAsync(async (req, res, next) => {
  await adminAuthService.logout(req.admin.id, req.admin.token);

  return res.status(204).send();
});
