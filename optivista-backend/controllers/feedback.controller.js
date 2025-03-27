const { pool } = require('../config/db.config');

/**
 * Create new feedback/review
 */
exports.createFeedback = async (req, res) => {
  try {
    const { product_id, order_id, rating, review_text } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!product_id || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // If order_id is provided, verify it exists and belongs to the user
    if (order_id) {
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?',
        [order_id, userId]
      );

      if (orders.length === 0) {
        return res.status(404).json({ message: 'Order not found or does not belong to you' });
      }

      // Verify the product was part of this order
      const [orderItems] = await pool.query(
        'SELECT * FROM order_items WHERE order_id = ? AND product_id = ?',
        [order_id, product_id]
      );

      if (orderItems.length === 0) {
        return res.status(400).json({ message: 'Product was not part of this order' });
      }
    }

    // Check if product exists
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const [existingFeedback] = await pool.query(
      'SELECT * FROM feedback WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingFeedback.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Insert feedback
    const [result] = await pool.query(
      `INSERT INTO feedback 
       (user_id, product_id, order_id, rating, review_text, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, product_id, order_id || null, rating, review_text || null]
    );

    // Update product average rating
    await updateProductRating(product_id);

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: result.insertId,
        user_id: userId,
        product_id,
        order_id: order_id || null,
        rating,
        review_text: review_text || null,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

/**
 * Get feedback for a product
 */
exports.getProductFeedback = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Check if product exists
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get feedback with user details (excluding sensitive info)
    const [feedback] = await pool.query(
      `SELECT f.*, u.first_name, u.last_name 
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       WHERE f.product_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, limit, offset]
    );
    
    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM feedback WHERE product_id = ?',
      [productId]
    );
    const total = countResult[0].total;
    
    // Get rating summary
    const [ratingSummary] = await pool.query(
      `SELECT 
        ROUND(AVG(rating), 1) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
       FROM feedback
       WHERE product_id = ?`,
      [productId]
    );
    
    res.status(200).json({
      feedback,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      summary: ratingSummary[0]
    });
  } catch (error) {
    console.error('Get product feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};

/**
 * Get all feedback submitted by the user
 */
exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get feedback with product details
    const [feedback] = await pool.query(
      `SELECT f.*, p.name as product_name, p.image_url 
       FROM feedback f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    
    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM feedback WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;
    
    res.status(200).json({
      feedback,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};

/**
 * Update user's feedback
 */
exports.updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const userId = req.userId;
    const { rating, review_text } = req.body;
    
    // Validate required fields
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    
    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if feedback exists and belongs to user
    const [existingFeedback] = await pool.query(
      'SELECT * FROM feedback WHERE id = ?',
      [feedbackId]
    );
    
    if (existingFeedback.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    if (existingFeedback[0].user_id != userId) {
      return res.status(403).json({ message: 'You can only update your own feedback' });
    }
    
    // Update feedback
    await pool.query(
      `UPDATE feedback 
       SET rating = ?, review_text = ?, updated_at = NOW()
       WHERE id = ?`,
      [rating, review_text || null, feedbackId]
    );
    
    // Update product average rating
    await updateProductRating(existingFeedback[0].product_id);
    
    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback: {
        id: parseInt(feedbackId),
        user_id: userId,
        product_id: existingFeedback[0].product_id,
        order_id: existingFeedback[0].order_id,
        rating,
        review_text: review_text || null,
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Server error while updating feedback' });
  }
};

/**
 * Delete feedback
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const userId = req.userId;
    const userRole = req.userRole;
    
    // Check if feedback exists
    const [existingFeedback] = await pool.query(
      'SELECT * FROM feedback WHERE id = ?',
      [feedbackId]
    );
    
    if (existingFeedback.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only allow users to delete their own feedback or admins to delete any
    if (existingFeedback[0].user_id != userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own feedback' });
    }
    
    const productId = existingFeedback[0].product_id;
    
    // Delete feedback
    await pool.query('DELETE FROM feedback WHERE id = ?', [feedbackId]);
    
    // Update product average rating
    await updateProductRating(productId);
    
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ message: 'Server error while deleting feedback' });
  }
};

/**
 * Get all feedback (admin only)
 */
exports.getAllFeedback = async (req, res) => {
  try {
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get feedback with user and product details
    const [feedback] = await pool.query(
      `SELECT f.*, u.first_name, u.last_name, p.name as product_name
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       JOIN products p ON f.product_id = p.id
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM feedback');
    const total = countResult[0].total;
    
    res.status(200).json({
      feedback,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
};

/**
 * Update product average rating
 */
async function updateProductRating(productId) {
  try {
    // Calculate new average rating
    const [ratingResult] = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM feedback WHERE product_id = ?',
      [productId]
    );
    
    const avgRating = ratingResult[0].avg_rating || 0;
    
    // Update product's average rating
    await pool.query(
      'UPDATE products SET avg_rating = ? WHERE id = ?',
      [avgRating, productId]
    );
    
    return true;
  } catch (error) {
    console.error('Update product rating error:', error);
    return false;
  }
} 