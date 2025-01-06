import { createOrder as createOrderModel, getOrdersByUser as getOrdersByUserModel } from '../models/Order.js';
import { addOrderItem } from '../models/OrderItem.js';

export const createOrder = async (req, res) => {
  const { userId, items, shippingAddress, paymentMethod } = req.body;

  try {
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    const orderId = await createOrderModel(userId, totalPrice, shippingAddress, paymentMethod);

    for (const item of items) {
      await addOrderItem(orderId, item.productId, item.quantity, item.price);
    }

    res.json({ success: true, orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await getOrdersByUserModel(userId);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
