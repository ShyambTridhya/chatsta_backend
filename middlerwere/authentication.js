const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please Login to access this resources', 401));
  }

  const decodedUserData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedUserData.id);

  next();
});

exports.authorizationRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:${req.user.role} is not allowed to access this resources`,
          403
        )
      );
    }
    next();
  };
};
