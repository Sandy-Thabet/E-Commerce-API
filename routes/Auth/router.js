const express = require('express');
const userRouter = require('./userRouter');
const merchantRouter = require('./merchantRouter');
const adminRouter = require('./admin-router');
const productRouter = require('../Products/product-router');

const authRouter = express.Router();

authRouter.use('/user', userRouter);
authRouter.use('/merchant', merchantRouter, productRouter);
authRouter.use('/admin', adminRouter, productRouter);

module.exports = authRouter;
