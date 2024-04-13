const { catchAsync } = require('../../utils/catchAsync');
const generalPaymentService = require('../../services/Payment/general-payment-service');

exports.handlePaymobCallback = catchAsync(async (req, res, next) => {
  console.log('BODY = ', req.body);
  console.log('QUERY = ', req.query);

  await generalPaymentService.handlePaymobCallback(
    req.body.obj,
    req.query.hmac
  );

  return res.status(200).send();
});
