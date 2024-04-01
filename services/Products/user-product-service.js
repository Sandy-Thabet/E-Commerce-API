const Product = require('../../database/models/product-model');
const AppError = require('../../utils/appError');

exports.getAllProducts = async (filter, page, size, sort) => {
  try {
    const query = {};

    const { price_from, price_to, ...otherFilters } = filter;

    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    if (price_from || price_to) {
      query.price = { $gte: parseInt(price_from), $lte: parseInt(price_to) };
    }

    query.status = 'active';

    console.log('Query:', query);

    const products = await Product.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size)
      .select('-status')
      .select('-__v')
      .populate({ path: 'category', select: '-__v' })
      .populate({ path: 'merchant', select: 'firstName lastName' });

    return products;
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId) => {
  try {
    const product = await Product.findById(productId)
      .populate({ path: 'category', select: '-__v' })
      .populate({ path: 'merchant', select: 'firstName lastName' })
      .select('-__v');

    if (product.status !== 'active') {
      throw new AppError('No product found by this id.', 404);
    }
    product.status = undefined;
    return product;
  } catch (err) {
    throw err;
  }
};
