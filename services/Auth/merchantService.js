const merchantRepository = require('../../database/repositories/merchantRepository');
const sendEmail = require('../../utils/emails');
const ValidationCode = require('../../utils/validationCode');
const sharedAuthService = require('../../services/Auth/sharedService');
const Merchant = require('../../database/models/merchantModel');
const AppError = require('../../utils/appError');

exports.signUp = async (merchantData) => {
  try {
    const validationCode = ValidationCode.generateCode();

    const merchant = await merchantRepository.createMerchant({
      ...merchantData,
      validationCode,
    });

    const message = `Verify your account by ${validationCode}`;
    await sendEmail({
      email: merchant.email,
      subject: 'signed up',
      message,
    });

    const token = sharedAuthService.createToken(merchant);

    merchant.validationCode = undefined;
    merchant.password = undefined;

    return {
      merchant,
      token,
    };
  } catch (err) {
    throw err;
  }
};

exports.validateCode = async (merchantID, code) => {
  try {
    const merchant = await Merchant.findById(merchantID);

    if (merchant && code === merchant.validationCode) {
      await Merchant.updateOne(merchant, { status: 'active' });
      merchant.status = 'active';
      merchant.validationCode = undefined;
      merchant.password = undefined;

      // await merchant.save();
    } else {
      throw new AppError('Invalid validation code! Please try again.', 400);
    }
    return merchant;
  } catch (err) {
    throw err;
  }
};
