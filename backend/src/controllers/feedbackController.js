import { addFeedback as addFeedbackModel, getFeedbackForProduct as getFeedbackForProductModel } from '../models/Feedback.js';

export const addFeedback = async (req, res) => {
  const { userId, productId, rating, review } = req.body;
  try {
    await addFeedbackModel(userId, productId, rating, review);
    res.json({ success: true, message: 'Feedback added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedbackForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const feedback = await getFeedbackForProductModel(productId);
    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};