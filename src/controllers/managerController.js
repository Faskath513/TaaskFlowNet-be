const { Manager } = require('../models/User');

// Create a Manager
const createManager = async (req, res) => {
  try {
    const { username, email, password, teamSize, projects } = req.body;

    const newManager = new Manager({
      username,
      email,
      password,
      role: 'manager',
      teamSize,
      projects,
    });

    await newManager.save();
    res.status(201).json({ message: 'Manager created successfully', data: newManager });
  } catch (error) {
    console.error('Error creating manager:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Managers
const getManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Manager by ID
const getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.status(200).json(manager);
  } catch (error) {
    console.error('Error fetching manager:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a Manager
const updateManager = async (req, res) => {
  try {
    const { teamSize, projects } = req.body;

    const updatedManager = await Manager.findByIdAndUpdate(
      req.params.id,
      { teamSize, projects },
      { new: true } // Return the updated document
    );

    if (!updatedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    res.status(200).json({ message: 'Manager updated successfully', data: updatedManager });
  } catch (error) {
    console.error('Error updating manager:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Manager
const deleteManager = async (req, res) => {
  try {
    const deletedManager = await Manager.findByIdAndDelete(req.params.id);
    if (!deletedManager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    res.status(200).json({ message: 'Manager deleted successfully' });
  } catch (error) {
    console.error('Error deleting manager:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager,
};
