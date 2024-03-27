const merchantAuthService = require('../../services/Auth/merchantService');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.signup = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    fullName,
    national_ID,
  } = req.body;
  const merchantData = { firstName, lastName, gender, email, password };

  const NationalData = { fullName, national_ID };

  const merchant = await merchantAuthService.signUp(
    merchantData,
    NationalData,
    req.file
  );

  return res.status(201).json(new SuccessResponse(merchant));
});

exports.resendValidationCode = catchAsync(async (req, res, next) => {
  await merchantAuthService.resendValidationCode(req.merchant.id);

  return res.status(200).json(new SuccessResponse());
});

exports.validateCode = catchAsync(async (req, res, next) => {
  const merchant = await merchantAuthService.validateCode(
    req.merchant.id,
    req.body.validationCode
  );

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await merchantAuthService.login(email, password);

  return res.status(200).json(new SuccessResponse(user));
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  await merchantAuthService.forgetPassword(email);

  return res.status(200).json(new SuccessResponse());
});

exports.validateMerchantCode = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;

  await merchantAuthService.validateMerchantCode(email, code);

  return res.status(200).json(new SuccessResponse());
});

exports.setNewPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const code = req.body.validationCode;
  const password = req.body.password;

  await merchantAuthService.setNewPassword(email, code, password);

  const message = `Password updated successfully.`;
  return res.status(200).json(new SuccessResponse(message));
});

exports.getMe = catchAsync(async (req, res, next) => {
  const merchant = await merchantAuthService.getMe(req.merchant.id);

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { firstName, lastName, gender, password } = req.body;
  const data = { firstName, lastName, gender, password };

  const merchant = await merchantAuthService.updateMe(req.merchant.id, data);

  return res.status(200).json(new SuccessResponse(merchant));
});
