const express = require('express');
const adminAuthRouter = require('../Auth/admin-auth-router');
const userManagementRouter = require('../Users-Management/user-management-router');
const merchantManagementRouter = require('../Merchants-Management/mrechant-management-router');
const adminProductRouter = require('../Products/admin-product-router');
const adminCategoryRouter = require('./../Categories/admin-category-router');
const adminCouponRouter = require('../Coupons/admin-coupon-router');

const adminsRouter = express.Router();

adminsRouter.use('/auth', adminAuthRouter);
adminsRouter.use('/users', userManagementRouter);
adminsRouter.use('/merchants', merchantManagementRouter);
adminsRouter.use('/products', adminProductRouter);
adminsRouter.use('/categories', adminCategoryRouter);
adminsRouter.use('/coupons', adminCouponRouter);

module.exports = adminsRouter;
