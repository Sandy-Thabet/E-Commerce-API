const AppError = require('../../utils/appError');
const Product = require('../../database/models/product-model');
const ProductImages = require('../../database/models/product-images');

exports.approveProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);

    if (
      !product ||
      product.status === 'blocked' ||
      product.status === 'inactive'
    ) {
      throw new AppError('no product found by this id.', 404);
    }

    if (product.status === 'active') {
      throw new AppError('the product is already active.', 400);
    }

    if (product.status === 'pendingAdminApproval') {
      return await Product.findByIdAndUpdate(
        productId,
        {
          status: 'active',
        },
        { new: true }
      );
    }
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('no product found by this id.', 404);
    }
    const images = await ProductImages.find({ productId });
    console.log(images);

    return { product, images };
  } catch (err) {
    throw err;
  }
};

exports.getMerchantProducts = async (merchantId) => {
  try {
    const products = await Product.find({ merchant: merchantId });

    if (!products) {
      throw new AppError('no products found for merchant.', 404);
    }

    return { products, images };
  } catch (err) {
    throw err;
  }
};

exports.getAllProducts = async (filter, page, size, sort) => {
  try {
    const query = {};

    const { price_from, price_to, ...otherFilters } = filter;

    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    if (price_from && price_to) {
      query.price = { $gte: parseInt(price_from), $lte: parseInt(price_to) };
    }

    const totalProducts = await Product.find(query);
    const products = await Product.find(query)
      .select('-images')
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { totalProducts, products };
  } catch (err) {
    throw err;
  }
};
