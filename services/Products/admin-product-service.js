const AppError = require('../../utils/appError');
const Product = require('../../database/models/product-model');

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

    return product;
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

    return products;
  } catch (err) {
    throw err;
  }
};

exports.getAllProducts = async (filter, page, size, sort) => {
  try {
    console.log('Filter...', filter);

    const query = {};

    // Extract price_from and price_to from filter if available
    const { price_from, price_to, ...otherFilters } = filter;

    // Add other filter parameters to the query object
    Object.entries(otherFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        query[key] = value;
      }
    });

    // Add price range condition to the query if both price_from and price_to are provided
    if (price_from && price_to) {
      query.price = { $gte: parseInt(price_from), $lte: parseInt(price_to) };
    }

    console.log('Query:', query);

    const products = await Product.find(query)
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return products;
  } catch (err) {
    throw err;
  }
};
