const Admin = require('../../database/models/admin-model');
const categoryRepository = require('../../database/repositories/category-repository');

exports.createCategory = async (adminId, name) => {
  try {
    const admin = await Admin.findById(adminId);

    const category = await categoryRepository.createCategory({ name });
    return { category, admin };
  } catch (err) {
    throw err;
  }
};

exports.getCategory = async (categoryId) => {
  try {
  } catch (err) {
    throw err;
  }
};
