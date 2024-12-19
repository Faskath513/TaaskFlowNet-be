const express = require('express');
const { register, login, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole'); // Import checkRole middleware

const router = express.Router();

// Register Route - Only HR can create new users (Employee, Manager, or other HRs)
router.post('/register', authenticate, checkRole(['HR']), register);

// Login Route - Any user (Employee, Manager, HR) can log in
router.post('/login', login);

// Reset Password Route - Any user (Employee, Manager, HR) can reset their password
router.post('/reset-password', authenticate, resetPassword);

module.exports = router;
