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

//get merchant
merchantManagementRouter.get(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.getMerchant
);

// approve merchant
merchantManagementRouter.patch(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.approveMerchant
);

// block merchant
merchantManagementRouter.patch(
  '/:id/block',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.blockMerchant
);

// unblock merchant
merchantManagementRouter.patch(
  '/:id/unblock',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.unblockMerchant
);

// delete merchant
merchantManagementRouter.delete(
  '/:id',
  authorization.verifyTokenAdmin,
  accessMiddleware('admin'),
  merchantManagementController.deleteMerchant
);

module.exports = merchantManagementRouter;
