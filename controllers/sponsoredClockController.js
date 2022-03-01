const Clock = require('../models/sponsoredClockModel');
const catchAsyncErrors = require('../middlerwere/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

//Create new sponsored Clock
exports.createSponsoredClock = catchAsyncErrors(async (req, res, next) => {
  const {CompanyName} = req.body;
  const clock = await Clock.create({
    CompanyName: CompanyName,
  });
  res.status(201).json({
    success: true,
    clock,
  });
});

//Get All Sponsored Clock
exports.getAllSponsoredClock = catchAsyncErrors(async (req, res, next) => {
  const clockList = await Clock.find({}).select(
    'CompanyName startDate endDate status'
  );
  const count = await Clock.count();

  if (!clockList) {
    return next(new ErrorHandler('No Sponsored Clock available', 401));
  }

  res.status(200).json({
    success: true,
    clockList,
    count,
  });
});

//Get Single Sponsored Clock By ID
exports.getSponsoredClockById = catchAsyncErrors(async (req, res, next) => {
  const clock = await Clock.findById(req.params.id).select(
    'CompanyName startDate endDate CompanyLogo CompanyAd'
  );
  if (!clock)
    return next(new ErrorHandler('This Sponsored Clock is Not Found', 404));
  res.status(200).json({
    success: true,
    clock,
  });
});

//Update Sponsored Clock
exports.updateSponsoredClock = catchAsyncErrors(async (req, res, next) => {
  const clock = await Clock.findByIdAndUpdate(
    req.params.id,
    {
      CompanyName: req.body.CompanyName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    {new: true}
  );

  if (clock) {
    res.status(200).send({message: 'Clock Updated Successfully', clock});
  } else {
    return next(new ErrorHandler('Clock Not Found', 404));
  }
});

//Delete Sponsored Clock
exports.deleteSponsoredClock = catchAsyncErrors(async (req, res, next) => {
  const deleteSponsoredClock = await Clock.deleteMany({
    _id: {$in: req.body.clocks},
  });
  if (deleteSponsoredClock) {
    res.status(200).json({
      success: true,
      message: 'Sponsored clock deleted sucessfully',
    });
  } else {
    return next(new ErrorHandler('Sponsored clock not found', 404));
  }
});
