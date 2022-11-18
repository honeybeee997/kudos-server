module.exports = (err, req, res, _) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status ?? 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went wrong',
  });
};
