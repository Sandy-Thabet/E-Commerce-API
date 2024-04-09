const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorageMerchant = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../utils/media/merchant-national-data`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}-${ext}`);
  },
});

const multerStorageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../utils/media/user-images`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}-${ext}`);
  },
});

const multerStorageAdmin = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../utils/media/admin-images`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}-${ext}`);
  },
});

const multerStorageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../utils/media/product-images`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${Date.now()}-${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Upload only images!', 400), false);
  }
};

exports.uploadNationalImage = multer({
  storage: multerStorageMerchant,
  fileFilter: multerFilter,
});

// #Product Images
exports.uploadProductImage = multer({
  storage: multerStorageProduct,
  fileFilter: multerFilter,
});

exports.uploadAdminImage = multer({
  storage: multerStorageAdmin,
  fileFilter: multerFilter,
});

exports.uploadUserImage = multer({
  storage: multerStorageUser,
  fileFilter: multerFilter,
});
