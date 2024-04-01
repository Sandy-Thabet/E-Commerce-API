const AppError = require('../../utils/appError');
const productRepository = require('../../database/repositories/product-repository');
const Product = require('../../database/models/product-model');

// #Products
exports.createProduct = async (merchantId, data) => {
  try {
    const product = await productRepository.createProduct({
      ...data,
      merchant: merchantId,
      status: 'pendingAdminApproval',
    });
    return product;
  } catch (err) {
    throw err;
  }
};

exports.updateProduct = async (productId, data, merchantID) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantID) {
      throw new AppError('You are not authorized to update this product.', 403);
    }
    if (
      !product ||
      product.status === 'inactive' ||
      product.status === 'blocked'
    ) {
      throw new AppError('no product found by this id.', 404);
    }

    //! can merchant update pending products ? true
    if (product.status === 'pendingAdminApproval') {
      throw new AppError('can not update pending products');
    }

    const updatedData = {};
    if (data.name) updatedData.name = data.name;
    if (data.description) updatedData.description = data.description;
    if (data.price) updatedData.price = data.price;
    if (data.category) updatedData.category = data.category;

    let updated;
    if (product.status === 'active') {
      updated = await Product.findByIdAndUpdate(
        productId,
        { ...updatedData, status: 'pendingAdminApproval' },
        {
          new: true,
        }
      );
    }
    return updated;
  } catch (err) {
    throw err;
  }
};

exports.getProduct = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch (err) {
    throw err;
  }
};

exports.getAllMyProducts = async (merchantId) => {
  try {
    return await Product.find({ merchant: merchantId });
  } catch (err) {
    throw err;
  }
};

exports.deleteProduct = async (productId, merchantId) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantId) {
      throw new AppError('You are not authorized to delete this product.', 403);
    }
    if (
      !product ||
      product.status === 'blocked' ||
      product.status === 'inactive'
    ) {
      throw new AppError('No product found by this id.', 404);
    }

    return await Product.findByIdAndUpdate(
      productId,
      { status: 'inactive' },
      { new: true }
    );
  } catch (err) {
    throw err;
  }
};

exports.blockProduct = async (productId, merchantId) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantId) {
      throw new AppError('You are not authorized to block this product.', 403);
    }
    if (
      !product ||
      product.status === 'blocked' ||
      product.status === 'inactive'
    ) {
      throw new AppError('No product found by this id.', 404);
    }

    return await Product.findByIdAndUpdate(
      productId,
      { status: 'blocked' },
      { new: true }
    );
  } catch (err) {
    throw err;
  }
};

exports.getActiveProducts = async (merchantId) => {
  try {
    return await Product.find({ merchant: merchantId, status: 'active' });
  } catch (err) {
    throw err;
  }
};

exports.getPendnigProducts = async (merchantId) => {
  try {
    return await Product.find({
      merchant: merchantId,
      status: 'pendingAdminApproval',
    });
  } catch (err) {
    throw err;
  }
};

exports.getBlockedProducts = async (merchantId) => {
  try {
    return await Product.find({
      merchant: merchantId,
      status: 'blocked',
    });
  } catch (err) {
    throw err;
  }
};
