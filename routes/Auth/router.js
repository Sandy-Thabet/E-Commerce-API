const express = require('express');
const userRouter = require('./userRouter');

const authRouter = express.Router();

authRouter.use('/user', userRouter);

module.exports = authRouter;
