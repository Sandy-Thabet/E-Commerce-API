const Merchant = require('../models/merchantModel');

exports.createMerchant = async (merchant) => {
  try {
    return await Merchant.create(merchant);
  } catch (err) {
    throw err;
  }
};
