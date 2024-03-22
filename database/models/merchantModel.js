const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name can not be empty!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name can not be empty!'],
  },
  gender: {
    type: String,
    required: [true, 'gender can not be empty!'],
    enum: ['male', 'female', 'ratherNotToSay'],
  },
  email: {
    type: String,
    required: [true, 'Email can not be empty!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password can not br empty!'],
    select: false,
  },
  status: {
    type: String,
    enum: ['pending', 'pendingAdminApproval', 'active', 'blocked', 'inactive'],
    default: 'pending',
  },
  validationCode: {
    type: String,
    required: true,
  },
});

merchantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Merchant = mongoose.model('merchants', merchantSchema);
module.exports = Merchant;
