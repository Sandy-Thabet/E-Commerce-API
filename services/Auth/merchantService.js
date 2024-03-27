const merchantRepository = require('../../database/repositories/merchantRepository');
const sendEmail = require('../../utils/emails');
const ValidationCode = require('../../utils/validationCode');
const sharedAuthService = require('../../services/Auth/sharedService');
const Merchant = require('../../database/models/merchantModel');
const MerchantNationalDataRepository = require('../../database/repositories/merchant-national-data-repository');
const AppError = require('../../utils/appError');
const bcrypt = require('bcrypt');
const productRepository = require('../../database/repositories/product-repository');
const Product = require('../../database/models/product-model');

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
        validationCode: merchant.validationCode,
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
      await Merchant.updateOne(merchant, { status: 'pendingAdminApproval' });
      merchant.status = 'pendingAdminApproval';
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

exports.getMe = async (merchantId) => {
  try {
    const merchant = await Merchant.findById(merchantId);

    return merchant;
  } catch (err) {
    throw err;
  }
};

exports.updateMe = async (merchantId, data) => {
  try {
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      throw new Error('Merchant not found');
    }

    let newPassword;
    if (data.password) {
      newPassword = await bcrypt.hash(data.password, 12);
    }

    const updateData = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.gender) updateData.gender = data.gender;
    if (newPassword) updateData.password = newPassword;

    const newMerchant = await Merchant.findByIdAndUpdate(
      merchantId,
      updateData,
      { new: true }
    );

    if (!newMerchant) {
      throw new Error('Failed to update merchant');
    }

    const token = await sharedAuthService.createToken(newMerchant);

    return { newMerchant, token };
  } catch (err) {
    throw err;
  }
};

// #Products
exports.createProduct = async (merchantId, data) => {
  try {
    const product = await productRepository.createProduct({
      ...data,
      merchant: merchantId,
      status: 'pendingAdminApproval',
    });
    return product;
  } catch (err) {
    throw err;
  }
};

exports.updateProduct = async (productId, data, merchantID) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantID) {
      throw new AppError('You are not authorized to update this product.', 403);
    }
    if (
      !product ||
      product.status === 'inactive' ||
      product.status === 'blocked'
    ) {
      throw new AppError('no product found by this id.', 404);
    }

    //! can merchant update pending products ?
    if (product.status === 'pendingAdminApproval') {
      throw new AppError('can not update pending products');
    }

    const updatedData = {};
    if (data.name) updatedData.name = data.name;
    if (data.description) updatedData.description = data.description;
    if (data.price) updatedData.price = data.price;
    if (data.category) updatedData.category = data.category;

    let updated;
    if (product.status === 'active') {
      updated = await Product.findByIdAndUpdate(
        productId,
        { ...updatedData, status: 'pendingAdminApproval' },
        {
          new: true,
        }
      );
    }
    return updated;
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch (err) {
    throw err;
  }
};

exports.getAllProducts = async (merchantId) => {
  try {
    return await Product.find({ merchant: merchantId });
  } catch (err) {
    throw err;
  }
};

exports.deleteProduct = async (productId, merchantId) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantId) {
      throw new AppError('You are not authorized to delete this product.', 403);
    }
    if (!product || product.status === ('blocked' || 'inactive')) {
      throw new AppError('No product found by this id.', 404);
    }

    return await Product.findByIdAndUpdate(
      productId,
      { status: 'inactive' },
      { new: true }
    );
  } catch (err) {
    throw err;
  }
};

exports.blockProduct = async (productId, merchantId) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantId) {
      throw new AppError('You are not authorized to block this product.', 403);
    }
    if (
      !product ||
      product.status === 'blocked' ||
      product.status === 'inactive' //! do this for all (product.status === ('blocked' || 'inactive'))
    ) {
      throw new AppError('No product found by this id.', 404);
    }

    return await Product.findByIdAndUpdate(
      productId,
      { status: 'blocked' },
      { new: true }
    );
  } catch (err) {
    throw err;
  }
};

exports.getActiveProducts = async (merchantId) => {
  try {
    return await Product.find({ merchant: merchantId, status: 'active' });
  } catch (err) {
    throw err;
  }
};

exports.getPendnigProducts = async (merchantId) => {
  try {
    return await Product.find({
      merchant: merchantId,
      status: 'pendingAdminApproval',
    });
  } catch (err) {
    throw err;
  }
};

exports.getBlockedProducts = async (merchantId) => {
  try {
    return await Product.find({
      merchant: merchantId,
      status: 'blocked',
    });
  } catch (err) {
    throw err;
  }
};
