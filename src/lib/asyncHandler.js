// Wraps an async Express handler so rejected promises reach next(err) instead
// of becoming an unhandled rejection that crashes the process.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
