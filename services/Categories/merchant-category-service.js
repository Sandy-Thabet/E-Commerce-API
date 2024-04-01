const Category = require('../../database/models/category-model');
const AppError = require('../../utils/appError');

exports.getCategory = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      return new AppError('No category found by this id.', 404);
    }

    return category;
  } catch (err) {
    throw err;
  }
};

exports.getAllCategories = async (size, page) => {
  try {
    const categories = await Category.find()
      .limit(size)
      .skip((page - 1) * size);
    return categories;
  } catch (err) {
    throw err;
  }
};
