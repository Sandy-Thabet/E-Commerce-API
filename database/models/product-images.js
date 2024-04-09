const mongoose = require('mongoose');

const productImagesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

const ProductImages = mongoose.model('product-images', productImagesSchema);

module.exports = ProductImages;
