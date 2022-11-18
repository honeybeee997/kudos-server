const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const {validate} = require('../utils/validator');
const authenticate = require('../utils/authenticator');

router.post('/create', validate('admin'), adminController.createAdmin); // enable this route if you want to create a new admin
router.post('/login', adminController.login);

// All the routes below are protected Routes and are useable just by an admin
router.use(authenticate('admin')); //--> verifying the token and checking the admin

// Protected routes
router.get('/all-members', adminController.getAllEmployees);

router.post(
  '/add-new-member',
  validate('employee'),
  adminController.createNewEmployee
);

router.put(
  '/edit-member/:memberId',
  validate('updateEmployee'),
  adminController.updateEmployee
);

router.delete('/delete/:email', adminController.deleteEmployee);

module.exports = router;
