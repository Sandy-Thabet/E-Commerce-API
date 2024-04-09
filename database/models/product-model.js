const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name can not be empty!'],
  },
  main_Image: {
    type: String,
    required: true,
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product-images',
    },
  ],
  status: {
    type: String,
    enum: ['pendingAdminApproval', 'active', 'blocked', 'inactive'],
    default: 'pendingAdminApproval',
  },
  description: {
    type: String,
    required: [true, 'description can not be empty!'],
  },
  price: {
    type: Number,
    required: [true, 'price can not be empty!'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'merchants',
  },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
