module.exports = (theAsyncErrorFunction) => (req, res, next) => {
  Promise.resolve(theAsyncErrorFunction(req, res, next)).catch(next);
};
