const { catchAsync } = require('../../utils/catchAsync');
const generalPaymentService = require('../../services/Payment/general-payment-service');

exports.handlePaymobCallback = catchAsync(async (req, res, next) => {
  console.log(req.body.transaction, req.body.hmac);

  await generalPaymentService.handlePaymobCallback(
    req.body.transaction,
    req.body.hmac
  );

  return res.status(200).send();
});
