const Feedback = require('../models/Feedback');

exports.addFeedback = async (userId, productId, rating, review) => {
  await Feedback.addFeedback(userId, productId, rating, review);
};

exports.getFeedbackForProduct = async (productId) => {
  return await Feedback.getFeedbackForProduct(productId);
};
