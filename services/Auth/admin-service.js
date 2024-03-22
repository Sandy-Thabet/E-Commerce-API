const Admin = require('../../database/models/admin-model');
const adminRepository = require('../../database/repositories/admin-repository');
const AppError = require('../../utils/appError');
const ValidationCode = require('../../utils/validationCode');
const sharedAuthService = require('./sharedService');
const bcrypt = require('bcrypt');
const sendEmail = require('../../utils/emails');

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
      const pass = bcrypt.compare(password, admin.password);
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

    const code = ValidationCode.generateCode();
    await Admin.updateOne(admin, {
      validationCode: code,
      password: undefined,
    });

    sendEmail({
      email: newUser.email,
      subject: 'Welcome to our E-Commerce Platform!',
      template: 'reset-password-validation-code', // Use only the template name without the file extension
      data: {
        validationCode: code,
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
