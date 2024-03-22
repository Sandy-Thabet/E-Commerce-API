const MerchantNationalData = require('../models/merchant-national-data-model');

exports.createMerchantNationalData = async (nationalData) => {
  try {
    return await MerchantNationalData.create(nationalData);
  } catch (err) {
    throw err;
  }
};
