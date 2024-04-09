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

exports.getAllCategories = async (filter, sort, page, size) => {
  try {
    const query = {};

    const { ...otherFilters } = filter;
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    const totalCategories = await Category.find(query);
    const categories = await Category.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { categories, totalCategories };
  } catch (err) {
    throw err;
  }
};
