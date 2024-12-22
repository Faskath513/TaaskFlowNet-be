const express = require('express');
const { createFeedback, getFeedbackForUser } = require('../controllers/feedbackController');

const router = express.Router();

router.post('/', createFeedback); // Route to create feedback
router.get('/:userId', getFeedbackForUser); // Route to get feedback for a specific user

module.exports = router;
