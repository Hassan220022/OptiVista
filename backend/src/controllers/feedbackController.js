const Feedback = require('../models/Feedback');

exports.addFeedback = async (req, res) => {
  const { userId, productId, rating, review } = req.body;
  try {
    await Feedback.addFeedback(userId, productId, rating, review);
    res.json({ success: true, message: 'Feedback added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeedbackForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const feedback = await Feedback.getFeedbackForProduct(productId);
    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
