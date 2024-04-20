const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'merchants',
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admins',
  },
});

const Token = mongoose.model('tokens', tokenSchema);

module.exports = Token;
