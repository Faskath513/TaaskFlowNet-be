const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  confirmPassword: {
    type: String
  },
  role: {
    type: String,
    enum: ['hr', 'manager', 'employee'],
    required: true
  }
});

// No pre-save middleware to hash password
// No password comparison method needed

const User = mongoose.model('User', userSchema);
// HR Schema
const hrSchema = new mongoose.Schema({
  managedDepartments: [
    {
      type: String,
    },
  ],
  companyPolicies: {
    type: String,
    default: 'No policies provided',
  },
});

// HR Model
const HR = User.discriminator(
  'HR', // Discriminator name for HR
  new mongoose.Schema(hrSchema, { discriminatorKey: 'role' })
);

// Manager Schema
const managerSchema = new mongoose.Schema({
  teamSize: {
    type: Number,
    default: 0,
  },
  projects: [
    {
      name: { type: String, required: true },
      deadline: { type: Date },
    },
  ],
});

// Manager Model
const Manager = User.discriminator(
  'Manager', // Discriminator name for Manager
  new mongoose.Schema(managerSchema, { discriminatorKey: 'role' })
);

// Employee Schema
const employeeSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [
    {
      description: { type: String, required: true },
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
      },
      dueDate: { type: Date },
    },
  ],
});

// Employee Model
const Employee = User.discriminator(
  'Employee', // Discriminator name for Employee
  new mongoose.Schema(employeeSchema, { discriminatorKey: 'role' })
);

module.exports = {
  User,
  HR,
  Manager,
  Employee,
};

