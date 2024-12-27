import { createOrder as createOrderModel, getOrdersByUser as getOrdersByUserModel } from '../models/Order.js';
import { addOrderItem } from '../models/OrderItem.js';

export const createOrder = async (userId, items, shippingAddress, paymentMethod) => {
  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  const orderId = await createOrderModel(userId, totalPrice, shippingAddress, paymentMethod);

  for (const item of items) {
    await addOrderItem(orderId, item.productId, item.quantity, item.price);
  }

  return orderId;
};

export const getOrdersByUser = async (userId) => {
  return await getOrdersByUserModel(userId);
};