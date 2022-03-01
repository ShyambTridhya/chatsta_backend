const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      validate: [validator.isEmail, 'Please enter valid email address'],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
      required: [true, 'Please enter your username'],
      maxLength: [25, 'Name cannot exceed 25 characters'],
      minlength: [2, 'Name should have more than 2 characters'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minLength: [6, 'Please should be greater than 6 characters'],
      select: false,
    },
    pin: {
      type: String,
      required: [true, 'Please enter your pin'],
      maxLength: [4, 'Pin cannot exceed 4 numbers'],
      select: false,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary'],
    },
    relationShipStatus: {
      type: String,
      enum: [
        'Single',
        'In a relationship',
        'Engaged',
        'Married',
        'In Love',
        'Actively Searching',
        'In a civil union',
        "It's complicated",
        'Divorced',
      ],
    },
    statSign: {
      type: String,
      enum: [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ],
    },
    height: {
      type: Number,
    },
    intrests: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
    },
    quotes: {
      type: String,
    },
    images: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    role: {
      type: String,
      default: 'user',
    },
    status: {
      type: String,
      default: 'Active',
    },
    lastLogin: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isPaidContentProvider: {
      type: Boolean,
      default: false,
    },
    stripeKey: {
      type: String,
    },
    isPrivateAccount: {
      type: Boolean,
      default: false,
    },
    registerDate: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpirationDate: Date,
    totalDonated: Number,
    stripeKey: String,
  },
  {timestamps: true}
);

//Password - pin Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Pin Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('pin')) {
    next();
  }
  this.pin = await bcrypt.hash(this.pin, 5);
});

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Compare Pin
userSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

//Generate JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//Generate Reset Password token
userSchema.methods.generateResetPasswordToken = function () {
  //Generating resetPasswordToken
  const resetToken = crypto.randomBytes(20).toString('hex');
  //Hashing and adding the resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpirationDate = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('user', userSchema);
