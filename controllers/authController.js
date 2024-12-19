const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register function
exports.register = async (req, res) => {
  const { username, email, password, role, employeeDetails, managerDetails, hrDetails } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Validate role
    if (!['employee', 'manager', 'hr'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Role-specific validations
    if (role === 'employee' && !employeeDetails) {
      return res.status(400).json({ message: 'Employee details are required for the employee role' });
    }
    if (role === 'manager' && !managerDetails) {
      return res.status(400).json({ message: 'Manager details are required for the manager role' });
    }
    if (role === 'hr' && !hrDetails) {
      return res.status(400).json({ message: 'HR details are required for the HR role' });
    }

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password, // Plain text for now; hashing should be added in production
      role,
      employeeDetails: role === 'employee' ? employeeDetails : undefined,
      managerDetails: role === 'manager' ? managerDetails : undefined,
      hrDetails: role === 'hr' ? hrDetails : undefined,
    });

    await newUser.save();

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Simple password comparison (no hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with user data (including role)
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' } // Token valid for 10 days
    );

    // Prepare a custom success message based on the role
    let roleDetails = {};
    let roleMessage = '';

    if (user.role === 'hr') {
      roleDetails = user.hrDetails;
      roleMessage = 'HR login successful';
    } else if (user.role === 'manager') {
      roleDetails = user.managerDetails;
      roleMessage = 'Manager login successful';
    } else if (user.role === 'employee') {
      roleDetails = user.employeeDetails;
      roleMessage = 'Employee login successful';
    }

    // Return success response with token, user details, and role-specific data
    res.status(200).json({
      message: roleMessage,
      token,
      id: user._id,
      username: user.username,
      role: user.role,
      roleDetails,
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
