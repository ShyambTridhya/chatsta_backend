const catchAsyncErrors = require('../middlerwere/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const About = require('../models/informativeModel');

//Create All Informative Page
exports.createAllInformative = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword;
  if (keyword === 'aboutUs') {
    const aboutUs = await About.create(req.body);
    res.status(201).json({aboutUs});
  } else if (keyword === 'contactUs') {
    const contactUs = await About.create(req.body);
    res.status(201).json({message: 'this is contact us', contactUs});
  } else if (keyword === 'termsAndCondition') {
    const termsAndCondition = await About.create(req.body);
    res.status(201).json({message: 'this is contact us', termsAndCondition});
  } else if (keyword === 'privacy') {
    const privacy = await About.create(req.body);
    res.status(201).json({message: 'this is contact us', privacy});
  } else {
    return next(new ErrorHandler(' not found', 404));
  }
});

//Get All Informative Pages
exports.getAllInformative = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword;
  if (keyword === 'aboutUs') {
    const data = await About.find({});
    const aboutUs = data[3];
    res.status(200).json({aboutUs});
  } else if (keyword === 'contactUs') {
    const data = await About.find({});
    const contactUs = data[0];
    res.status(200).json({contactUs});
  } else if (keyword === 'termsAndCondition') {
    const data = await About.find({});
    const termsAndCondition = data[1];
    res.status(200).json({termsAndCondition});
  } else if (keyword === 'privacy') {
    const data = await About.find({});
    const privacy = data[2];
    res.status(200).json({privacy});
  }
});

//Update All Informative
exports.updateAllInformative = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword;
  if (keyword === 'aboutUs') {
    const aboutUs = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!aboutUs) {
      return next(new ErrorHandler('AboutUs not found', 404));
    }
    res.status(200).json({success: true, aboutUs});
  } else if (keyword === 'contactUs') {
    const contactUs = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!contactUs) {
      return next(new ErrorHandler('ContactUs not found', 404));
    }
    res.status(200).json({success: true, contactUs});
  } else if (keyword === 'termsAndCondition') {
    const termsAndCondition = await About.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!termsAndCondition) {
      return next(new ErrorHandler('Terms and conditions not found', 404));
    }
    res.status(200).json({success: true, termsAndCondition});
  } else if (keyword === 'privacy') {
    const privacy = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!privacy) {
      return next(new ErrorHandler('privacy not found', 404));
    }
    res.status(200).json({success: true, privacy});
  }
});
