const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Admin must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Admin must have an email'],
  },
  password: {
    type: String,
    required: [true, 'Admin must have a password'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Admin must have a number'],
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  image: String,
});

module.exports = mongoose.model('Admin', adminSchema);
