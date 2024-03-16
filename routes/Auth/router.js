const express = require('express');
const userRouter = require('./userRouter');
const merchantRouter = require('./merchantRouter');

const authRouter = express.Router();

authRouter.use('/user', userRouter);
authRouter.use('/merchant', merchantRouter);

module.exports = authRouter;
