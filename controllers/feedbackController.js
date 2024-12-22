const Feedback = require('../models/Feedback');

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    const { reviewer, reviewee, reviewId, comments, rating } = req.body;

    const feedback = new Feedback({
      reviewer,
      reviewee,
      reviewId,
      comments,
      rating,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback', error });
  }
};

// Fetch all feedback for a specific user
const getFeedbackForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedbacks = await Feedback.find({ reviewee: userId }).populate('reviewer', 'name email');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
};

module.exports = { createFeedback, getFeedbackForUser };
