const Admin = require('../../database/models/admin-model');
const adminRepository = require('../../database/repositories/admin-repository');
const AppError = require('../../utils/appError');
const ValidationCode = require('../../utils/validationCode');
const sharedAuthService = require('./sharedService');
const bcrypt = require('bcrypt');
const sendEmail = require('../../utils/emails');
const categoryRepository = require('../../database/repositories/category-repository');
const User = require('../../database/models/userModel');
const Merchant = require('../../database/models/merchantModel');
const MerchantNationalData = require('../../database/models/merchant-national-data-model');

exports.signup = async (adminData) => {
  try {
    const admin = await adminRepository.createAdmin({ ...adminData });

    const token = sharedAuthService.createToken(admin);

    admin.password = undefined;

    return {
      admin,
      token,
    };
  } catch (err) {
    throw err;
  }
};

exports.login = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email }).select('+password');

    if (admin) {
      const pass = await bcrypt.compare(password, admin.password);
      admin.password = undefined;

      if (pass) {
        const token = sharedAuthService.createToken(admin);
        return { admin, token };
      }
    }
    throw new AppError('Invalid email or password!', 400);
  } catch (err) {
    throw err;
  }
};

exports.forgetPassword = async (email) => {
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      throw new AppError('Email is not exist!', 400);
    }

    const newValidationCode = ValidationCode.generateCode();
    await Admin.updateOne(admin, {
      validationCode: newValidationCode,
      password: undefined,
    });

    sendEmail({
      email: admin.email,
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

exports.validateAdminCode = async (email, code) => {
  try {
    const admin = await Admin.findOne({ email });

    if (!admin || code !== admin.validationCode) {
      throw new AppError('Invalid code!', 400);
    }
    return admin;
  } catch (err) {
    throw err;
  }
};

exports.setNewPassword = async (email, code, password) => {
  try {
    const admin = await this.validateAdminCode(email, code);

    const pass = await bcrypt.hash(password, 12);
    return await Admin.updateOne(admin, {
      password: pass,
      validationCode: null,
    });
  } catch (err) {
    throw err;
  }
};

exports.getMe = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);

    // if (!admin) {
    //   throw new AppError('Unauthorized!', 401);
    // }

    return admin;
  } catch (err) {
    throw err;
  }
};

exports.updateMe = async (adminId, data) => {
  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      throw new Error('Admin not found');
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

    const newAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
    });

    if (!newAdmin) {
      throw new Error('Failed to update admin');
    }

    const token = sharedAuthService.createToken(newAdmin);

    return { newAdmin, token };
  } catch (err) {
    throw err;
  }
};

exports.createCategory = async (adminId, name) => {
  const admin = await Admin.findById(adminId);

  const category = await categoryRepository.createCategory({ name });
  return category;
};

exports.getAllUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw err;
  }
};

exports.getUser = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    throw err;
  }
};

exports.getPendingUsers = async () => {
  try {
    return await User.find({ status: 'pending' });
  } catch (err) {
    throw err;
  }
};

exports.getActiveUsers = async () => {
  try {
    return await User.find({ status: 'active' });
  } catch (err) {
    throw err;
  }
};

exports.getBlockedUsers = async () => {
  try {
    return await User.find({ status: 'blocked' });
  } catch (err) {
    throw err;
  }
};

exports.blockUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user || user.status === 'blocked' || user.status === 'inactive') {
      throw new AppError('no user found by this id.', 404);
    }

    const blocked = await User.findByIdAndUpdate(id, { status: 'blocked' });
    blocked.status = 'blocked';
    blocked.validationCode = undefined;

    return blocked;
  } catch (err) {
    throw err;
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user || user.status === 'inactive' || user.status === 'blocked') {
      throw new AppError('no user found by this id.', 404);
    }

    const deleted = await User.findByIdAndUpdate(id, { status: 'inactive' });
    deleted.status = 'inactive';
    deleted.validationCode = undefined;

    return deleted;
  } catch (err) {
    throw err;
  }
};

//! too much if conditions ?
exports.approveMerchant = async (merchantId) => {
  try {
    const merchant = await Merchant.findById(merchantId);

    if (!merchant) {
      throw new AppError('No merchant found by this id!', 404);
    }

    if (merchant.status === 'pending') {
      throw new AppError('user is not activated yet!', 400);
    }

    if (merchant.status === 'active') {
      throw new AppError('user is already activated.', 400);
    }

    let activatedMerchant;
    if (merchant.status === 'pendingAdminApproval') {
      activatedMerchant = await Merchant.findByIdAndUpdate(merchantId, {
        status: 'active',
      });
      activatedMerchant.status = 'active';
      activatedMerchant.validationCode = undefined;
      return { activatedMerchant };
    }

    throw new AppError('ERROR', 400);
  } catch (err) {
    throw err;
  }
};

exports.getAllMerchants = async () => {
  try {
    return await Merchant.find();
  } catch (err) {
    throw err;
  }
};

exports.getMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id);
    const NationalData = await MerchantNationalData.find({ merchantId: id });

    merchant.validationCode = undefined;

    return { merchant, NationalData };
  } catch (err) {
    throw err;
  }
};

//! return validationCode
//(we can't put in model {select:false } it makes a pug in another function)
exports.getPendingMerchants = async () => {
  try {
    // const merchant = await Merchant.find();
    // merchant.validationCode = undefined;

    return await Merchant.find({ status: 'pending' });
  } catch (err) {
    throw err;
  }
};

//! return validationCode
exports.getPendingApprovalMerchants = async () => {
  try {
    return await Merchant.find({ status: 'pendingAdminApproval' });
  } catch (err) {
    throw err;
  }
};

//! return validationCode
exports.getActiveMerchant = async () => {
  try {
    return await Merchant.find({ status: 'active' });
  } catch (err) {
    throw err;
  }
};

exports.blockMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id);

    if (
      !merchant ||
      merchant.status === 'inactive' ||
      merchant.status === 'blocked'
    ) {
      throw new AppError('no merchant found by this id!', 404);
    }

    // if (merchant.status === 'blocked') {
    //   throw new AppError('user is already blocked.', 400);
    // }

    const blockedM = await Merchant.findByIdAndUpdate(id, {
      status: 'blocked',
    });
    blockedM.status = 'blocked';
    blockedM.validationCode = undefined;

    return blockedM;
  } catch (err) {
    throw err;
  }
};

exports.deleteMerchant = async (id) => {
  try {
    const merchant = await Merchant.findById(id);

    if (
      !merchant ||
      merchant.status === 'inactive' ||
      merchant.status === 'blocked'
    ) {
      throw new AppError('no merchant found by this id!', 404);
    }

    const deleted = await Merchant.findByIdAndUpdate(id, {
      status: 'inactive',
    });
    deleted.status = 'inactive';
    deleted.validationCode = undefined;

    return deleted;
  } catch (err) {
    throw err;
  }
};
