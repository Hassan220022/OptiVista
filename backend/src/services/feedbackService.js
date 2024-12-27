import { addFeedback as addFeedbackModel, getFeedbackForProduct as getFeedbackForProductModel } from '../models/Feedback.js';

export const addFeedback = async (userId, productId, rating, review) => {
  await addFeedbackModel(userId, productId, rating, review);
};

export const getFeedbackForProduct = async (productId) => {
  return await getFeedbackForProductModel(productId);
};