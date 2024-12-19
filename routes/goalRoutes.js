const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
console.log(authenticateUser); // This should not be undefined
 // Authentication middleware
const goalController = require('../controllers/goalController');

router.post('/create', authenticateUser, goalController.createGoal);
router.get('/', authenticateUser, goalController.getGoals);
router.get('/:id', authenticateUser, goalController.getGoalById);
router.put('/:id', authenticateUser, goalController.updateGoal);
router.delete('/:id', authenticateUser, goalController.deleteGoal);

module.exports = router;
