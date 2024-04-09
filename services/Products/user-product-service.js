const ProductImages = require('../../database/models/product-images');
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

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .and({ status: { $ne: 'inactive' } })
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size)
      .select('-images')
      .select('-status')
      .select('-__v')
      .populate({ path: 'category', select: '-__v' })
      .populate({ path: 'merchant', select: 'firstName lastName' });

    console.log(products, totalProducts);
    return { totalProducts, products };
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId) => {
  try {
    const product = await Product.findOne({ _id: productId, status: 'active' })
      .populate({ path: 'category', select: '-__v' })
      .populate({ path: 'merchant', select: 'firstName lastName' })
      .select('-__v');

    if (!product || product.status !== 'active') {
      throw new AppError('No product found by this id.', 404);
    }

    const images = await ProductImages.findOne({ productId });

    product.status = undefined;
    return { product, images };
  } catch (err) {
    throw err;
  }
};
