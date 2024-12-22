const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// 🔐 **Register User with Password Hashing**
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

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
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

// 🔑 **Login User with Password Verification**
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Prepare role-specific details
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

// 🔄 **Reset Password with Hashing**
exports.resetPassword = async (req, res) => {
  const { username, email, newPassword } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !newPassword) {
      return res.status(400).json({ message: 'Username, email, and new password are required' });
    }

    // Find the user by username and email
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(400).json({ message: 'User with the provided username and email not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🚪 **Logout**
exports.logout = async (req, res) => {
  try {
    res.setHeader('Set-Cookie', 'authToken=; Max-Age=0; path=/; HttpOnly; SameSite=Strict');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
