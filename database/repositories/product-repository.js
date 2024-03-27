const Product = require('../models/product-model');

exports.createProduct = async (product) => {
  try {
    return await Product.create(product);
  } catch (err) {
    throw err;
  }
};
