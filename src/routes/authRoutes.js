const express = require('express');
const {
  registerUser,
  resetPassword,
  loginUser
} = require('../controllers/authController');

const router = express.Router();

// POST route for user registration (Create)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/resetPassword',resetPassword);


module.exports = router;
