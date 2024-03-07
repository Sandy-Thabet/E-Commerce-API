const mongoose = require('mongoose');

exports.connectMongoDB = async function () {
  const DB = `${process.env.DATABASE}${process.env.DATABASE_NAME}`;
  await mongoose.connect(DB);
};
