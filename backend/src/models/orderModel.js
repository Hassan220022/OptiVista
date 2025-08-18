import { supabase } from '../config/supabase.js';

export const createOrder = async (orderData) => {
  try {
    // Start a Supabase transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.userId,
        total_amount: orderData.totalAmount,
        status: orderData.status || 'pending',
        shipping_address: orderData.shippingAddress,
        payment_method: orderData.paymentMethod
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Update product stock
    for (const item of orderData.items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_id: item.productId,
        quantity: item.quantity
      });

      if (stockError) console.error('Stock update error:', stockError);
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(name, price, pictures(url))
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting orders by user ID:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(name, price, pictures(url))
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(name, price)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

// Create RPC function in Supabase for stock decrement
export const createStockDecrementFunction = `
CREATE OR REPLACE FUNCTION decrement_stock(p_id INT, quantity INT)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity - quantity
  WHERE id = p_id AND stock_quantity >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
`;