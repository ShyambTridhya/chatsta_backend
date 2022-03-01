const mongoose = require('mongoose');

const sponsoredClockSchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
      required: [true, 'Please enter companyName'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please enter start Date'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'Please enter end Date'],
      default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    // CompanyLogo: Joi.image().minDimensions(40, 40), //40*40
    // CompanyAd: Joi.image().minDimensions(354, 40), //354*40
    CompanyLogo: {
      data: Buffer,
      contentType: String,
    },
    CompanyAd: {
      data: Buffer,
      contentType: String,
    },
    status: {
      type: String,
      default: 'Scheduled',
      enum: ['Active', 'Scheduled', 'Completed'],
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model('clock', sponsoredClockSchema);
