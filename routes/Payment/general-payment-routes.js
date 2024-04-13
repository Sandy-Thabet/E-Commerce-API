const express = require('express');
const {
  handlePaymobCallback,
} = require('../../controllers/Payment/general-payment-controller');

const generalPaymentRouter = express.Router();

generalPaymentRouter.post('/paymob/callback', handlePaymobCallback);

module.exports = generalPaymentRouter;
