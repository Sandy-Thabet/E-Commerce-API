const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    enum: ['male', 'female', 'ratherNotToSay'],
    required: true,
  },
  email: {
    type: String,
    required: [true, 'email can not be empty!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password can not be empty!'],
    select: false,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked', 'pending'],
    default: 'pending',
  },
  validationCode: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
