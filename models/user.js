const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee must have a name'],
    },
    email: {
      type: String,
      required: [true, 'Employee must have an email'],
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Please provide a password'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Employee must have a number'],
    },
    role: {
      type: String,
      enum: ['manager', 'employee'],
      default: 'employee',
    },
    kudos: {
      type: Number,
      default: 0,
    },
    image: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

employeeSchema.pre('save', async function (next) {
  // Dont hash the password if its not updated or modified on save
  if (!this.isModified('password')) return next();

  // hashing the password
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

module.exports = mongoose.model('employee', employeeSchema);
