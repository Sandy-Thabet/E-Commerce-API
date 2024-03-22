const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name can not be empty!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name can not be empty!'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'ratherNotToSay'],
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Email can not be empty!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password can not be empty!'],
  },
  validationCode: {
    type: String,
  },
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const Admin = mongoose.model('admins', adminSchema);
module.exports = Admin;
