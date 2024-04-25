const express = require('express');
const userManagementController = require('../../controllers/Users-Management/user-management-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const userManagementRouter = express.Router();

// get all users
userManagementRouter.get(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.getAllUsers
);

// get user
userManagementRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.getUser
);

// block user
userManagementRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.blockUser
);

// block user
userManagementRouter.patch(
  '/:id/unblock',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.unblockUser
);

// delte user
userManagementRouter.delete(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.deleteUser
);

module.exports = userManagementRouter;
