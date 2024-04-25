const userManagementService = require('../../services/Users-Management/user-management-service');
const { catchAsync } = require('../../utils/catchAsync');
const SuccessResponse = require('../../utils/successResponse');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { firstName, lastName, gender, email, status } = req.query;
  const filter = { firstName, lastName, gender, email, status };

  const { totalUsers, users } = await userManagementService.getAllUsers(
    filter,
    req.query.page,
    req.query.size,
    req.query.sort
  );

  return res.status(200).json(
    new SuccessResponse({
      total: totalUsers.length,
      results: users.length,
      users,
    })
  );
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userManagementService.getUser(req.params.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await userManagementService.blockUser(req.params.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await userManagementService.unblockUser(req.params.id);

  return res.status(200).json(new SuccessResponse(user));
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await userManagementService.deleteUser(req.params.id);

  return res.status(204).json(new SuccessResponse());
});
