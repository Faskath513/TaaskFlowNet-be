const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const {
    createManager,
  getManagers,
  getManagerById,
  updateManager,
  deleteManager
}=require('../controllers/managerController');
// Employee routes
router.post('/employees', createEmployee); // Create employee
router.get('/employees', getEmployees); // Get all employees
router.get('/employees/:id', getEmployeeById); // Get employee by ID
router.put('/employees/:id', updateEmployee); // Update employee
router.delete('/employees/:id', deleteEmployee); // Delete employee


// Manager routes
router.post('/managers', createManager); // Create manager
router.get('/managers', getManagers); // Get all managers
router.get('/managers/:id', getManagerById); // Get manager by ID
router.put('/managers/:id', updateManager); // Update manager
router.delete('/managers/:id', deleteManager); // Delete manager

module.exports = router;



