const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

exports.createOrder = async (req, res) => {
  const { userId, items, shippingAddress, paymentMethod } = req.body;

  try {
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    const orderId = await Order.createOrder(userId, totalPrice, shippingAddress, paymentMethod);

    for (const item of items) {
      await OrderItem.addOrderItem(orderId, item.productId, item.quantity, item.price);
    }

    res.json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.getOrdersByUser(userId);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
