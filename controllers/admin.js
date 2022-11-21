const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const AppError = require("../utils/error");
const admins = require("../models/admin");
const users = require("../models/user");

const signAndSendToken = (id, admin, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_ADMIN,
  });

  admin.password = undefined;

  res.status(200).json({
    status: "success",
    message: "Logged in successfully",
    token,
    admin: admin,
  });
};

exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    console.log(req.body);
    const newAdmin = await admins.create({
      name,
      email,
      password,
      phoneNumber,
    });

    res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (err) {
    res.json(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email });
    if (admin && admin.password === password) {
      signAndSendToken(admin._id, admin, res);
    } else {
      const error = new AppError("Email or password is wrong", 401);
      return next(error);
    }
  } catch (err) {
    res.json(err);
  }
};

exports.createNewEmployee = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      role = "employee",
      kudos = "0",
    } = req.body;
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return next(new AppError("Employee with this email already exists", 400));
    }
    const newUser = await users.create({
      name,
      email,
      password,
      phoneNumber,
      role,
      kudos,
    });

    const employee = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      kudos: newUser.kudos,
    };

    res.status(201).json({
      status: "success",
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    res.json(err);
  }
};

exports.getAllEmployees = async (req, res, next) => {
  try {
    // Here we are getting the raw data from DB
    const rawEmployees = await users.find().lean();

    // Shaping the data in which we want it in the client side
    const beautifiedEmployees = rawEmployees.map((employee) => {
      return {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        image: employee.image,
        role: employee.role,
        kudos: employee.kudos,
        phoneNumber: employee.phoneNumber,
      };
    });
    res.status(200).json({
      status: "success",
      message: "List of al the employees",
      members: beautifiedEmployees,
    });
  } catch (err) {
    res.json(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, role, kudos } = req.body;
    const userId = req.params.memberId;
    if (!isValidObjectId(userId)) {
      return next(
        new AppError(
          "Invalid User Id. Please refresh the page and try again",
          401
        )
      );
    }
    const employee = await users.findById(userId);
    if (!employee) {
      return next(
        new AppError("No user found with this id. Please refresh the page", 404)
      );
    }

    const alreadyExistingEmail = await users.findOne({
      email,
      _id: { $ne: userId },
    });

    if (alreadyExistingEmail) {
      return next(
        new AppError(
          "This email belongs to another account. Please try another email",
          401
        )
      );
    }

    employee.name = name;
    employee.email = email;
    employee.phoneNumber = phoneNumber;
    employee.role = role ?? employee.role;
    employee.kudos = kudos === "" ? 0 : kudos;
    const updatedEmployee = await employee.save();

    res.status(200).json({
      status: "success",
      message: "Employee updated Successfully",
      updatedEmployee,
    });
  } catch (err) {
    if (err.errors.role && err.errors.role.kind === "enum") {
      return next(
        new AppError(
          `${err.errors.role.value} role cannot be assigned to a user account. User account can either be a 'manager' or 'employee'`,
          401
        )
      );
    } else {
      return next(new AppError("Something went wrong", 401));
    }
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const { email } = req.params;

    await users.findOneAndDelete({ email });

    res.status(200).json({
      status: "success",
      message: "User deleted successuflly",
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
