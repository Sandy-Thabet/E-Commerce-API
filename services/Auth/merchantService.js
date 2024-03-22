const merchantRepository = require('../../database/repositories/merchantRepository');
const sendEmail = require('../../utils/emails');
const ValidationCode = require('../../utils/validationCode');
const sharedAuthService = require('../../services/Auth/sharedService');
const Merchant = require('../../database/models/merchantModel');
const MerchantNationalDataRepository = require('../../database/repositories/merchant-national-data-repository');
const AppError = require('../../utils/appError');
const bcrypt = require('bcrypt');

exports.signUp = async (merchantData, nationalData, nationalImage) => {
  try {
    const validationCode = ValidationCode.generateCode();

    const merchant = await merchantRepository.createMerchant({
      ...merchantData,
      validationCode,
    });

    await MerchantNationalDataRepository.createMerchantNationalData({
      merchantId: merchant._id,
      ...nationalData,
      national_ID_Image: nationalImage.filename,
    });

    sendEmail({
      email: merchant.email,
      subject: 'Welcome to our E-Commerce Platform!',
      template: 'signup-validation-code', // Use only the template name without the file extension
      data: {
        validationCode: validationCode,
      },
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

exports.resendValidationCode = async (merchantID) => {
  try {
    const merchant = await Merchant.findById(merchantID);

    if (!merchant) {
      throw new AppError('Merchant is not exist!', 404);
    } else if (merchant && merchant.status !== 'pending') {
      throw new AppError('You are already verified!', 400);
    }

    // generate new validation code and update it in database
    const newValidationCode = ValidationCode.generateCode();
    await Merchant.updateOne(merchant, { validationCode: newValidationCode });

    // Pass the newValidationCode to the template
    await sendEmail({
      email: merchant.email,
      subject: 'Re-Send Verification Code',
      template: 'resend-verification-code',
      data: {
        newValidationCode: newValidationCode,
      },
    });
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

exports.login = async (email, password) => {
  try {
    const merchant = await Merchant.findOne({ email }).select('+password');

    if (merchant) {
      const pass = await bcrypt.compare(password, merchant.password);
      merchant.password = undefined;
      if (pass) {
        const token = sharedAuthService.createToken(merchant);
        return { merchant, token };
      }
    }
    throw new AppError('Invalid email or password!', 400);
  } catch (err) {
    throw err;
  }
};

exports.forgetPassword = async (email) => {
  try {
    const merchant = await Merchant.findOne({ email });

    if (!merchant) {
      throw new AppError('Email is not exist!', 404);
    }

    const newValidationCode = ValidationCode.generateCode();
    await Merchant.updateOne(merchant, { validationCode: newValidationCode });

    sendEmail({
      email: merchant.email,
      subject: 'Welcome to our E-Commerce Platform!',
      template: 'reset-password-validation-code', // Use only the template name without the file extension
      data: {
        validationCode: newValidationCode,
      },
    });
  } catch (err) {
    throw err;
  }
};

exports.validateMerchantCode = async (email, code) => {
  try {
    const merchant = await Merchant.findOne({ email });

    if (merchant && code !== merchant.validationCode) {
      throw new AppError('Invalid code!', 404);
    }
    return merchant;
  } catch (err) {
    throw err;
  }
};

exports.setNewPassword = async (email, code, password) => {
  try {
    const merchant = await this.validateMerchantCode(email, code);
    if (merchant) {
      const newPassword = await bcrypt.hash(password, 12);
      await Merchant.updateOne(merchant, {
        password: newPassword,
        validationCode: null,
      });
    }
  } catch (err) {
    throw err;
  }
};
