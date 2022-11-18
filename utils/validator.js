const AppError = require('./error');
const {body, validationResult} = require('express-validator');

exports.validator = (method) => {
  switch (method) {
    // -----------------------
    // ADMIN validtion
    // -----------------------
    case 'admin': {
      return [
        body('name')
          .isLength({min: 3, max: 15})
          .withMessage('Name must be between 3-15'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password')
          .isLength({min: 6})
          .withMessage('Password must be at least 6 characters'),
        body('phoneNumber')
          .isLength({min: 11, max: 15})
          .withMessage('Phone number must be between 11-15 characters'),
      ];
    }

    // -----------------------
    // EMPLOYEE validtion
    // -----------------------
    case 'employee': {
      return [
        body('name')
          .isLength({min: 3, max: 15})
          .withMessage('Name must be between 3-15'),
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email')
          .toLowerCase(),
        body('password')
          .isLength({min: 6})
          .withMessage('Password must be at least 6 characters'),
        body('phoneNumber')
          .isLength({min: 11, max: 15})
          .withMessage('Phone number must be between 11-15 characters'),
      ];
    }

    // -----------------------
    // EMPLOYEE update validtion
    // -----------------------
    case 'updateEmployee': {
      return [
        body('name')
          .isLength({min: 3, max: 15})
          .withMessage('Name must be between 3-15'),
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email')
          .toLowerCase(),
        body('phoneNumber')
          .isLength({min: 11, max: 15})
          .withMessage('Phone number must be between 11-15 characters'),
      ];
    }
  }
};

exports.checkValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  const hasErrors = !errors.isEmpty();
  if (hasErrors) {
    const plainErrors = errors.array().map((err) => {
      return err.msg;
    });
    return next(new AppError(plainErrors[0], 401));
  }

  next();
};

exports.validate = (method) => {
  return [this.validator(method), this.checkValidationResults];
};
