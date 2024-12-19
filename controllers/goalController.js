const Goal = require('../models/Goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  const { title, description, dueDate, priority, tags } = req.body;

  try {
    const newGoal = new Goal({
      userId: req.user.id, // Assuming `req.user` is set via authentication middleware
      title,
      description,
      dueDate,
      priority,
      tags,
    });

    await newGoal.save();
    res.status(201).json({ message: 'Goal created successfully', goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error creating goal', error });
  }
};

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error });
  }
};

// Get a specific goal by ID
exports.getGoalById = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findOne({ _id: id, userId: req.user.id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goal', error });
  }
};

// Update a goal by ID
exports.updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed, priority, tags } = req.body;

  try {
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, dueDate, completed, priority, tags },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) return res.status(404).json({ message: 'Goal not found' });

    res.status(200).json({ message: 'Goal updated successfully', goal: updatedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal', error });
  }
};


// Delete a goal by ID
exports.deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGoal = await Goal.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedGoal) return res.status(404).json({ message: 'Goal not found' });

    res.status(200).json({ message: 'Goal deleted successfully', goal: deletedGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting goal', error });
  }
};
