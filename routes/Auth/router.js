const express = require('express');
const userRouter = require('./userRouter');
const merchantRouter = require('./merchantRouter');
const adminRouter = require('./admin-router');

const authRouter = express.Router();

authRouter.use('/user', userRouter);
authRouter.use('/merchant', merchantRouter);
authRouter.use('/admin', adminRouter);

module.exports = authRouter;
