const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return emailRegex.test(v); // Validate email format
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['employee', 'manager', 'hr'], // Define valid roles
  },
  employeeDetails: {
    department: { type: String },
    designation: { type: String },
    joiningDate: { type: Date },
    // Add more fields as required for employees
  },
  managerDetails: {
    department: { type: String },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to employees
    // Add more fields as required for managers
  },
  hrDetails: {
    assignedDepartments: [{ type: String }],
    // Add more fields as required for HR
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
