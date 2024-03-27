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

//
exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await adminAuthService.createCategory(req.admin.id, name);

  return res.status(201).json(new SuccessResponse(category));
});

// Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await adminAuthService.getAllUsers();

  return res
    .status(200)
    .json(new SuccessResponse({ results: users.length, users }));
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.getUser(req.params.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.getPendingUsers = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.getPendingUsers();

  return res.status(200).json(new SuccessResponse(user));
});

exports.getActiveUsers = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.getActiveUsers();

  return res.status(200).json(new SuccessResponse(user));
});

exports.getBlockedUsers = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.getBlockedUsers();

  return res.status(200).json(new SuccessResponse(user));
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.blockUser(req.params.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await adminAuthService.deleteUser(req.params.id);

  // return res.status(200).json(new SuccessResponse(user));
  return res.status(204).json(new SuccessResponse());
});

// Merchants
exports.approveMerchant = catchAsync(async (req, res, next) => {
  const merchant = await adminAuthService.approveMerchant(req.params.id);

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.getAllMerchants = catchAsync(async (req, res, next) => {
  const merchants = await adminAuthService.getAllMerchants();

  return res
    .status(200)
    .json(new SuccessResponse({ results: merchants.length, merchants }));
});

exports.getMerchant = catchAsync(async (req, res, next) => {
  const merchant = await adminAuthService.getMerchant(req.params.id);

  return res.status(200).json(new SuccessResponse({ merchant }));
});

exports.getPendingMerchants = catchAsync(async (req, res, next) => {
  const merchants = await adminAuthService.getPendingMerchants();

  return res.status(200).json(new SuccessResponse(merchants));
});

exports.getPendingApprovalMerchants = catchAsync(async (req, res, next) => {
  const merchants = await adminAuthService.getPendingApprovalMerchants();

  return res.status(200).json(new SuccessResponse(merchants));
});

exports.getActiveMerchant = catchAsync(async (req, res, next) => {
  const merchants = await adminAuthService.getActiveMerchant();

  return res.status(200).json(new SuccessResponse(merchants));
});

exports.blockMerchant = catchAsync(async (req, res, status) => {
  const merchant = await adminAuthService.blockMerchant(req.params.id);

  return res.status(200).json(new SuccessResponse(merchant));
});

exports.deleteMerchant = catchAsync(async (req, res, next) => {
  await adminAuthService.deleteMerchant(req.params.id);

  return res.status(202).json(new SuccessResponse('deleted.'));
});
