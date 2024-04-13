const crypto = require('crypto');
const Payment = require('../../database/models/payment-model');
const Order = require('../../database/models/order-model');

exports.handlePaymobCallback = async (
  paymobObj,
  paymobHMAC,
  paymobIntention
) => {
  try {
    const isValidHMAC = validatePaymobHMAC(paymobObj, paymobHMAC);
    if (!isValidHMAC) {
      // TODO: Throw error
    }

    if (!paymobObj.success) {
      return;
    }

    const payment = await Payment.findOne({
      paymob_transaction_id: paymobIntention.id,
    });

    if (!payment) {
      console.log(payment);
      return;
    }

    const order = await Order.findById(payment.order_id);

    if (!order) {
      console.log(order);
      return;
    }

    await Order.updateOne({ _id: order.id }, { status: 'new' });
  } catch (err) {
    throw err;
  }
};

const validatePaymobHMAC = (paymobObj, paymobHMAC) => {
  try {
    const concatenedString = `${paymobObj.amount_cents}${paymobObj.created_at}${paymobObj.currency}${paymobObj.error_occured}${paymobObj.has_parent_transaction}${paymobObj.id}${paymobObj.integration_id}${paymobObj.is_3d_secure}${paymobObj.is_auth}${paymobObj.is_capture}${paymobObj.is_refunded}${paymobObj.is_standalone_payment}${paymobObj.is_voided}${paymobObj.order.id}${paymobObj.owner}${paymobObj.pending}${paymobObj.source_data.pan}${paymobObj.source_data.sub_type}${paymobObj.source_data.type}${paymobObj.success}`;

    console.log(concatenedString);

    const hmac = crypto.createHmac('sha512', process.env.PAYMOB_HMAC);

    hmac.update(concatenedString);

    const hash = hmac.digest('hex');

    console.log('Result HMAC ', hash);

    return hash === paymobHMAC;
  } catch (err) {
    throw err;
  }
};
