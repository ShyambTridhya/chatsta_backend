const User = require('../models/userModel');
const catchAsyncErrors = require('../middlerwere/catchAsyncError');
const sendToken = require('../utils/jwtToken');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//Register New User
exports.userSignup = catchAsyncErrors(async (req, res, next) => {
  const {username, password, pin} = req.body;
  const registerDate = moment().format('DD.MM.YYYY');
  const user = await User.create({
    username: username,
    password: password,
    pin: pin,
    registerDate,
  });
  res.status(201).json({
    success: true,
    user,
  });
});

//Login User
exports.adminLogin = async (req, res, next) => {
  const {email, password} = req.body;

  // Checking is user has given password and email both

  if (!email || !password) {
    return next(
      new ErrorHandler('Please enter a valid email and password', 400)
    );
  }

  //Checking with Database

  const user = await User.findOne({email}).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  if (user.role === 'admin') {
    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
  } else {
    return next(new ErrorHandler('User is not an admin', 401));
  }
};

//Forgot Password
exports.userForgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  //Get ResetPassword Token
  const resetToken = user.generateResetPasswordToken();

  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/Password/UserResetPassword/${resetToken}`;

  const message = `Your reset password link is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then, please ignore it😊`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ChatSta password recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully!`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpirationDate = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.userResetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log('94', resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpirationDate: {$gte: Date.now()},
  });
  console.log('99', user);
  if (!user) {
    return next(
      new ErrorHandler(
        'Reset password token is invalid or has been expired',
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHandler('Password does not match', 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpirationDate = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Logout User
exports.userLogout = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role === 'admin') {
    const lastLoginDate = moment().format('DD.MM.YYYY,h:mm:ss a');
    await User.findOneAndUpdate(req.user.email, {lastLogin: lastLoginDate});
  }

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    hhtpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User has been logged out',
  });
});

// ***************************** For ADMIN *****************************

// TO Get All Users List or Get All Paid Content Providers
exports.getUsersList = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);

  const userCount = await User.find({
    role: 'user',
    isPaidContentProvider: false,
  }).count();

  const usersList = await User.find({
    role: 'user',
    isPaidContentProvider: false,
  })
    .select('username createdAt email status registerDate')
    .limit(resultPerPage)
    .skip(skip)
    .sort({createdAt: -1});

  if (!usersList) {
    return next(new ErrorHandler('No Users are available', 401));
  }

  res.status(200).send({
    success: true,
    totalUsers: userCount,
    usersList,
  });
});

// Get user information by user id
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
  const data = await User.findById(req.params.id).select('+password');
  if (!data) return next(new ErrorHandler('User Not Found', 404));
  const user = {};
  if (data.isPaidContentProvider) {
    user.username = data.username;
    user.email = data.email;
    user.password = data.password;
    user.registerDate = data.registerDate;
    user.isPaidContentProvider = data.isPaidContentProvider;
    user.isBlocked = data.isBlocked;
    user.totalDonated = data.totalDonated;
    user.stripeKey = data.stripeKey;

    res.status(200).json({
      success: true,
      user,
    });
  } else {
    user.username = data.username;
    user.email = data.email;
    user.password = data.password;
    user.registerDate = data.registerDate;
    user.isPaidContentProvider = data.isPaidContentProvider;
    user.isBlocked = data.isBlocked;
    res.status(200).json({
      success: true,
      user,
    });
  }
});

// update User information or Update Paid Content Providers
exports.updateUserData = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isPaidContentProvider: req.body.isPaidContentProvider,
    },
    {new: true}
  );

  if (user) {
    res.status(200).json({message: 'User Updated', user});
  } else {
    return next(new ErrorHandler('User Not Found', 404));
  }
});

// delete a user from the database
exports.deleteUsers = catchAsyncErrors(async (req, res, next) => {
  const deletedUsers = await User.deleteMany({_id: {$in: req.body.users}});

  if (deletedUsers) {
    res.status(200).json({message: 'users are Deleted successfully'});
  } else {
    return next(new ErrorHandler('no users found', 404));
  }
});

// Block multiple user from the database
exports.blockUsers = catchAsyncErrors(async (req, res, next) => {
  const blockUsers = await User.updateMany(
    {_id: {$in: req.body.users}},
    {$set: {isBlocked: true}},
    {new: true}
  );

  if (blockUsers) {
    res.status(200).json({message: 'Users are Blocked successfully'});
  } else {
    return next(new ErrorHandler('no users found', 404));
  }
});

// ***************************** For ADMIN *****************************

//Get My Profile by Id
exports.getAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const profile = await User.findById(req.params.id).select(
    'username email password'
  );
  if (!profile) return next(new ErrorHandler('This Profile is Not Found', 404));
  res.status(200).json({
    success: true,
    profile,
  });
});

//Update Admin Profile
exports.updateAdminProfile = catchAsyncErrors(async (req, res, next) => {
  const profile = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
    },
    {new: true}
  );

  if (profile) {
    res.status(200).send({message: 'Profile Updated Successfully', profile});
  } else {
    return next(new ErrorHandler('Profile Not Found', 404));
  }
});

// Get All Paid Content provider
exports.getAllContentProvider = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);

  const totalPcpCount = await User.find({
    role: 'user',
    isPaidContentProvider: true,
  }).count();

  const paidContentProviders = await User.find({
    isPaidContentProvider: true,
    role: 'user',
  })
    .select('username registerDate email status')
    .limit(resultPerPage)
    .skip(skip)
    .sort({createdAt: -1});

  if (paidContentProviders) {
    res.status(200).json({totalPCP: totalPcpCount, paidContentProviders});
  } else {
    return next(new ErrorHandler('No Paid Content Providers Found', 404));
  }
});

// invite the Paid Content Providers
exports.invitePcpUser = catchAsyncErrors(async (req, res, next) => {
  try {
    await sendEmail({
      email: req.body.email,
      subject: `ChatSta Invitation`,
      message: req.body.message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${req.body.email} successfully!`,
    });
  } catch (error) {
    return next(new ErrorHandler('Invite Failed', error));
  }
});

// ***************************** For MOBILE APIS *****************************

//Update Profile after signUp
exports.userUpdateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      location: req.body.location,
      gender: req.body.gender,
      relationShipStatus: req.body.relationShipStatus,
      statSign: req.body.statSign,
      bio: req.body.bio,
      height: req.body.height,
      intrests: req.body.intrests,
      quotes: req.body.quotes,
      image: req.body.image,
    },
    {new: true}
  );

  if (user) {
    res.status(200).send({message: 'Profile Created', user});
  } else {
    return next(new ErrorHandler('This user is not found.', 404));
  }
});

//Login for mobile
exports.userLogin = async (req, res, next) => {
  const {username, password} = req.body;

  // Checking is user has given password and email both

  if (!username || !password) {
    return next(
      new ErrorHandler('Please enter a valid username and password', 400)
    );
  }

  //Checking with Database

  const user = await User.findOne({username}).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid username or password', 401));
  }
  const passwordMatched = await user.comparePassword(password);

  if (!passwordMatched) {
    return next(new ErrorHandler('Invalid username or password', 401));
  }

  res.status(200).json({success: true, user});
};

//Get User Profile
exports.getProfile = catchAsyncErrors(async (req, res, next) => {
  const profile = await User.findById(req.params.id);
  if (!profile) return next(new ErrorHandler('This Profile is Not Found', 404));
  res.status(200).json({
    success: true,
    profile,
  });
});
