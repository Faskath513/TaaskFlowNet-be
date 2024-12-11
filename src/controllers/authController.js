const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/auth');

// Helper function to validate email format
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
};

const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;
  
    try {
      // Input validation
      if (!username || !email || !password || !confirmPassword || !role) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      // Check if the user already exists
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user object with the plaintext password
      const newUser = new User({
        username,
        email: email.toLowerCase(),
        password, // Save password in plaintext
        role,
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email (case-insensitive)
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: 'Invalid user email' });
      }
  
      // Log user data for debugging
      console.log('User Name:', user.username);
      console.log('User Password (DB):', user.password);
      console.log('Input Password:', password);
  
      // Compare the entered password with the plaintext password stored in the database
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate JWT token for the authenticated user
      const token = generateToken(user._id);
  
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;
  
    try {
      // Validate input fields
      if (!email || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'Please provide email and both password fields' });
      }
  
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
  
      // Check if the user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Directly update the user's password in the database (no hashing)
      await User.findByIdAndUpdate(user._id, { password: newPassword });
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    
  };
  