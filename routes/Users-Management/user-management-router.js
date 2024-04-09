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

userManagementRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.blockUser
);

userManagementRouter.delete(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  userManagementController.deleteUser
);

module.exports = userManagementRouter;
