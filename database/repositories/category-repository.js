const Category = require('../models/category-model');

exports.createCategory = async (category) => {
  try {
    return await Category.create(category);
  } catch (err) {
    throw err;
  }
};
