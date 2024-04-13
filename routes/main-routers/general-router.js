const express = require('express');
const generalPaymentRouter = require('../Payment/general-payment-routes');

const generalRouter = express.Router();

generalRouter.use('/payments', generalPaymentRouter);

module.exports = generalRouter;
