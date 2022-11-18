const jwt = require('jsonwebtoken');
const admins = require('../models/admin');
const AppError = require('./error');

exports.authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.split('Bearer ')[1]) {
    return next(
      new AppError(
        "You're not allowed for this action. Please login first",
        401
      )
    );
  }

  const token = authHeader.split('Bearer ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return next(new AppError('Invalid Token. Please login', 401));
    }

    const id = decodedToken.id;
    const document = await admins.findById({_id: id});
    if (!document) {
      return next(
        new AppError(
          'Account belonging to this token does not exist. Pleas login again',
          400
        )
      );
    }
    //   Checking if the resulted document is really an admin
    if (!document.isAdmin) {
      return next(
        new AppError(
          'You are not allowed for this action. Please login as an admin',
          400
        )
      );
    }

    req.admin = document;
    next();
  });
};

exports.authenticateEmployee = (req, res, next) => {
  console.log(req.headers);
  console.log('hello employee');
};

module.exports = (userType) => {
  if (userType === 'admin') {
    return this.authenticateAdmin;
  } else {
    return this.authenticateEmployee;
  }
};
