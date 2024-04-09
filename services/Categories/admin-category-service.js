const Admin = require('../../database/models/admin-model');
const Category = require('../../database/models/category-model');
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
    return await Category.findById(categoryId);
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

    return { totalCategories, categories };
  } catch (err) {
    throw err;
  }
};
