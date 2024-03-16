const AppError = require('../utils/appError');

const handleDuplicateKeyErrorDB = (err) => {
  // Extract the duplicate key field and value
  const key = Object.entries(err.keyValue)[0];

  const errorMessage = `The ${key[0]} '${key[1]}' is already in use. Please choose a different ${key[0]}.`;
  return new AppError(errorMessage, 400);
};

const handleValidationError = (err) => {
  const message = err.details[0].message;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err) => {
  const error = err.name;
  console.log(error);
  return new AppError(`Unauthorized`, 401);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, name: err.name, message: err.message };
  console.log(error.name, error.code, error);

  if (error.name === 'MongoServerError' && error.code === 11000)
    error = handleDuplicateKeyErrorDB(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'JsonWebTokenError')
    error = handleJsonWebTokenError(error);

  sendError(error, res);
};
