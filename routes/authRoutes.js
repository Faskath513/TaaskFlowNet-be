// authRoutes.js
const express = require('express');
const { register, login, resetPassword, logout } = require('../controllers/authController'); // Ensure logout is imported
const { authenticate } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole'); // Import checkRole middleware

const router = express.Router();

// Register Route - Only HR can create new users (Employee, Manager, or other HRs)
router.post('/register', register);

// Login Route - Any user (Employee, Manager, HR) can log in
router.post('/login', login);

// Reset Password Route - Any user (Employee, Manager, HR) can reset their password
router.post('/reset-password', authenticate, resetPassword);

// Logout Route - Log out the user (only client-side, no need for token invalidation in JWT)
router.post("/logout", logout); // Ensure logout function is defined in authController

module.exports = router;
