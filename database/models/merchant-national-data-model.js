const mongoose = require('mongoose');

const merchantNationalDataSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Merchant',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full Name can not be empty!'],
  },
  national_ID: {
    type: String,
    required: [true, 'National ID can cot be empty!'],
  },
  national_ID_Image: {
    type: String,
    required: [true, 'National ID Image can cot be empty!'],
  },
});

const MerchantNationalData = mongoose.model(
  'Merchant-National-Data',
  merchantNationalDataSchema
);
module.exports = MerchantNationalData;
