const Category = require('../../database/models/category-model');

exports.getCategory = async (categoryId) => {
  try {
    return await Category.findById(categoryId);
  } catch (err) {
    throw err;
  }
};

exports.getAllCategory = async (page, size) => {
  try {
    return await Category.find()
      .limit(size)
      .skip((page - 1) * size);
  } catch (err) {
    throw err;
  }
};
