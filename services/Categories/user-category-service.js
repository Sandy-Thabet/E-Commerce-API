const Category = require('../../database/models/category-model');

exports.getCategory = async (categoryId) => {
  try {
    return await Category.findById(categoryId);
  } catch (err) {
    throw err;
  }
};

exports.getAllCategories = async (filter, sort, page, size) => {
  try {
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
