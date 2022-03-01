const mongoose = require('mongoose');

const Infomativeschema = new mongoose.Schema(
  {
    AboutUs: {
      image: {
        data: Buffer,
        contentType: String,
      },
      description: {
        type: String,
      },
    },
    ContactUs: {
      generalInformation: {
        type: String,
      },
      email: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    TermsAndCondition: {
      text: {
        type: String,
      },
    },
    PrivacyPolicy: {
      text: {
        type: String,
      },
    },
  },

  {timestamps: true}
);

module.exports = mongoose.model('Information', Infomativeschema);
