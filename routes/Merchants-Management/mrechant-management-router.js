const express = require('express');
const merchantManagementController = require('../../controllers/Merchants-Management/merchant-management-controller');
const authorization = require('../../middlewares/authorization');
const { accessMiddleware } = require('../../middlewares/access-middleware');

const merchantManagementRouter = express.Router();

// get all merchants
merchantManagementRouter.get(
  '/',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.getAllMerchants
);

// approve merchant
merchantManagementRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.approveMerchant
);

//get merchant
merchantManagementRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.getMerchant
);

merchantManagementRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.blockMerchant
);

merchantManagementRouter.delete(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.deleteMerchant
);

module.exports = merchantManagementRouter;
