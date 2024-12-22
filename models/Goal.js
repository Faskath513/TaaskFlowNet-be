const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true, // Removes leading and trailing whitespace
  },
  description: {
    type: String,
    trim: true, // Removes leading and trailing whitespace
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'], // Define allowed priority levels
    default: 'medium',
  },
  tags: {
    type: [String], // Array of tags for categorization
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


// Middleware to set updatedAt before saving
goalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
