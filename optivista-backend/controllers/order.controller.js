const { pool } = require('../config/db.config');

/**
 * Create a new order
 */
exports.createOrder = async (req, res) => {
  let connection;
  try {
    const { shipping_address, payment_method, items } = req.body;
    const userId = req.userId; // From auth middleware

    // Validate required fields
    if (!shipping_address || !payment_method || !items || !items.length) {
      return res.status(400).json({ 
        message: 'Shipping address, payment method, and order items are required' 
      });
    }

    // Start a transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Calculate order total and validate items
    let orderTotal = 0;
    for (const item of items) {
      if (!item.product_id || !item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: 'Each order item must include product_id and quantity' 
        });
      }

      // Get product price and check inventory
      const [products] = await connection.query(
        'SELECT price, in_stock FROM products WHERE id = ?', 
        [item.product_id]
      );

      if (products.length === 0 || !products[0].in_stock) {
        await connection.rollback();
        return res.status(400).json({
          message: `Product with ID ${item.product_id} is not available`
        });
      }

      orderTotal += products[0].price * item.quantity;
    }

    // Create order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, shipping_address, total_amount, payment_method, status, created_at) 
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [userId, shipping_address, orderTotal, payment_method]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, (SELECT price FROM products WHERE id = ?))`,
        [orderId, item.product_id, item.quantity, item.product_id]
      );
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        user_id: userId,
        shipping_address,
        total_amount: orderTotal,
        payment_method,
        status: 'pending',
        created_at: new Date(),
        items
      }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Get all orders for the authenticated user
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    // Get all orders for the user
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.image_url 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items };
    }));

    res.status(200).json({ orders: ordersWithItems });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

/**
 * Get a single order by ID (for user or admin)
 */
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId; // From auth middleware
    const userRole = req.userRole; // From auth middleware

    // Get order details (user can only view their own orders, admin can view any)
    let query = 'SELECT * FROM orders WHERE id = ?';
    let queryParams = [orderId];
    
    if (userRole !== 'admin') {
      query += ' AND user_id = ?';
      queryParams.push(userId);
    }

    const [orders] = await pool.query(query, queryParams);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    res.status(200).json({ 
      order: {
        ...orders[0],
        items
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

/**
 * Update order status (admin only)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    // Validate status value
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Valid status is required',
        validStatuses
      });
    }
    
    // Check if order exists
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );
    
    res.status(200).json({
      message: 'Order status updated successfully',
      order: {
        ...orders[0],
        status,
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};

/**
 * Get all orders (admin only)
 */
exports.getAllOrders = async (req, res) => {
  try {
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM orders';
    const queryParams = [];
    
    // Apply status filter if provided
    if (req.query.status) {
      query += ' WHERE status = ?';
      queryParams.push(req.query.status);
    }
    
    // Apply sorting
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    // Execute query
    const [orders] = await pool.query(query, queryParams);
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM orders');
    const total = countResult[0].total;
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.image_url 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      return { ...order, items };
    }));
    
    res.status(200).json({
      orders: ordersWithItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
}; 