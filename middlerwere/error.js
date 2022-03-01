const ErrorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  //Wrong MongoDb Id Error
  if (err.name === 'CastError') {
    const message = `Resource not found.Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicates key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT Error
  if (err.name === 'jsonwebTokenError') {
    const message = `JsonwebToken is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    const message = `JsonwebToken is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
