const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

exports.createOrder = async (userId, items, shippingAddress, paymentMethod) => {
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  const orderId = await Order.createOrder(userId, totalPrice, shippingAddress, paymentMethod);

  for (const item of items) {
    await OrderItem.addOrderItem(orderId, item.productId, item.quantity, item.price);
  }

  return orderId;
};

exports.getOrdersByUser = async (userId) => {
  return await Order.getOrdersByUser(userId);
};
