const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
    required: true,
  },
  paymob_transaction_id: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model('payments', paymentSchema);

module.exports = Payment;
