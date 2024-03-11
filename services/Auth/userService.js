const userRepository = require('../../database/repositories/userRepository');
const sharedAuthService = require('./sharedService');
const sendEmail = require('../../utils/emails');
const ValidationCode = require('../../utils/validationCode');
const User = require('../../database/models/userModel');
const AppError = require('../../utils/appError');

exports.signUp = async (userData) => {
  try {
    // Generate Validation Code
    const validationCode = ValidationCode.generateCode();

    const newUser = await userRepository.createUser({
      ...userData,
      validationCode,
    });

    // Send email with validation code
    const message = `Verify your account by ${validationCode}`;
    await sendEmail({
      email: newUser.email,
      subject: 'signed up',
      message,
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
        validationCode: null,
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
