const userRepository = require('../../database/repositories/userRepository');
const sharedAuthService = require('./sharedService');
const sendEmail = require('../../utils/emails');
const ValidationCode = require('../../utils/validationCode');
const User = require('../../database/models/userModel');
const AppError = require('../../utils/appError');
const bcrypt = require('bcrypt');

exports.signUp = async (userData) => {
  try {
    // Generate Validation Code
    const validationCode = ValidationCode.generateCode();

    const newUser = await userRepository.createUser({
      ...userData,
      validationCode,
    });

    // Send email with validation code
    sendEmail({
      email: newUser.email,
      subject: 'Welcome to our E-Commerce Platform!',
      template: 'signup-validation-code', // Use only the template name without the file extension
      data: {
        validationCode: validationCode,
      },
    });

    // generate tokens and return user with jwt tokens
    const token = sharedAuthService.createToken(newUser);

    newUser.password = undefined;
    newUser.validationCode = undefined;

    return {
      newUser,
      token,
    };
  } catch (err) {
    throw err;
  }
};

exports.validateCode = async (userId, code) => {
  try {
    const user = await User.findById(userId);

    if (user && code === user.validationCode) {
      await User.updateOne(user, {
        status: 'active',
        validationCode: undefined,
      });

      user.password = undefined;
      user.status = 'active';
      user.validationCode = undefined;

      return user;
    } else {
      throw new AppError('Invalid validation code! Please try again.', 400);
    }
  } catch (err) {
    throw err;
  }
};

exports.resendValidationCode = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError('User is not exist!', 404);
    } else if (user.status !== 'pending') {
      throw new AppError('You already verified!', 400);
    }

    const newValidationCode = ValidationCode.generateCode();

    await User.updateOne(user, {
      validationCode: newValidationCode,
    });

    sendEmail({
      email: newUser.email,
      subject: 'Welcome to our E-Commerce Platform!',
      template: 'resend-verification-code', // Use only the template name without the file extension
      data: {
        validationCode: newValidationCode,
      },
    });
    return;
  } catch (err) {
    throw err;
  }
};

exports.login = async (email, password) => {
  try {
    const currentUser = await User.findOne({ email }).select('+password');

    if (currentUser) {
      const pass = await bcrypt.compare(password, currentUser.password);
      currentUser.password = undefined;

      if (pass) {
        const token = sharedAuthService.createToken(currentUser);
        return { user: currentUser, token };
      }
    }
    throw new AppError('Invalid email or password.', 401);
  } catch (err) {
    throw err;
  }
};

exports.forgetPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Email is not exist.', 404);
    }

    const newValidationCode = ValidationCode.generateCode();
    await User.updateOne(user, { validationCode: newValidationCode });

    sendEmail({
      email: newUser.email,
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

exports.validateUserCode = async (email, code) => {
  try {
    const user = await User.findOne({ email });

    if (!user || code !== user.validationCode) {
      throw new AppError('Invalid code!', 400);
    }
    return user;
  } catch (err) {
    throw err;
  }
};

exports.setNewPassword = async (email, code, Password) => {
  try {
    const user = await this.validateUserCode(email, code);
    const newPassword = await bcrypt.hash(Password, 12);
    return await User.updateOne(user, {
      password: newPassword,
      validationCode: null,
      // $unset: { validationCode: 1 },
    });
  } catch (err) {
    throw err;
  }
};
