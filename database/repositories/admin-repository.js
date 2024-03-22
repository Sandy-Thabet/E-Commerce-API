const Admin = require('../models/admin-model');

exports.createAdmin = async (admin) => {
  try {
    return await Admin.create(admin);
  } catch (err) {
    throw err;
  }
};
