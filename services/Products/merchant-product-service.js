const AppError = require('../../utils/appError');
const productRepository = require('../../database/repositories/product-repository');
const Product = require('../../database/models/product-model');
const Merchant = require('../../database/models/merchantModel');
const ProductImages = require('../../database/models/product-images');

// #Products
exports.createProduct = async (merchantId, data, mainImage) => {
  try {
    const product = await productRepository.createProduct({
      ...data,
      merchant: merchantId,
      main_Image: mainImage.filename,
      status: 'pendingAdminApproval',
    });
    return product;
  } catch (err) {
    throw err;
  }
};

exports.updateProduct = async (productId, data, merchantID, mainImage) => {
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

    const updatedData = {};
    if (data.name) updatedData.name = data.name;
    if (data.description) updatedData.description = data.description;
    if (data.price) updatedData.price = data.price;
    if (data.category) updatedData.category = data.category;
    if (mainImage) updatedData.main_Image = mainImage;

    let updated;
    if (product.status === 'active') {
      updated = await Product.findByIdAndUpdate(
        productId,
        {
          ...updatedData,
          main_Image: mainImage.filename,
          status: 'pendingAdminApproval',
        },
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

exports.getProduct = async (productId, merchantId) => {
  try {
    const product = await Product.findOne({
      _id: productId,
      merchant: merchantId,
    });

    if (!product || product.status === 'inactive') {
      throw new AppError('No product found by this id.', 404);
    }
    return product;
  } catch (err) {
    throw err;
  }
};

exports.getAllMyProducts = async (merchantId, filter, sort, page, size) => {
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

    const products = await Product.find({
      merchant: merchantId,
      query,
      status: { $ne: 'inactive' },
    });
    const totalProducts = await Product.find({ merchant: merchantId, query })
      .sort(sort)
      .limit(size)
      .skip((page - 1) * size);

    return { totalProducts, products };
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

exports.uploadProductImages = async (merchantId, productId, Images) => {
  try {
    const product = await Product.findById(productId);
    const merchant = product.merchant._id;

    if (merchant.toString() !== merchantId) {
      throw new AppError('You are not authorized to make this action.', 403);
    }

    if (
      !product ||
      product.status === 'inactive' ||
      product.status === 'blocked'
    ) {
      throw new AppError('no product found by this id.', 404);
    }

    await ProductImages.updateOne(
      { productId: productId },
      { images: Images },
      { upsert: true }
    );

    const uploaded = await ProductImages.findOne({ productId });

    console.log(uploaded);

    const updated = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        images: uploaded,
      },
      { new: true }
    );

    return { updated, uploaded: uploaded.images };
  } catch (err) {
    throw err;
  }
};
