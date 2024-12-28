import '../models/order.dart';
import 'api_service.dart';

class OrderService {
  final ApiService _apiService = ApiService();

  // Create a new order
  Future<int> createOrder({
    required int userId,
    required List<OrderItem> items,
    required String shippingAddress,
    required String paymentMethod,
  }) async {
    final data = {
      'userId': userId,
      'items': items.map((item) => item.toJson()).toList(),
      'shippingAddress': shippingAddress,
      'paymentMethod': paymentMethod,
    };

    final response = await _apiService.post('/orders/', data);

    if (response['success']) {
      // Assuming the backend returns the created order's ID
      return response['data']['id'];
    } else {
      throw Exception(response['message'] ?? 'Failed to create order');
    }
  }

  // Fetch all orders for a user
  Future<List<Order>> fetchUserOrders(int userId) async {
    final response = await _apiService.get('/orders/user/$userId');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<Order> orders = data.map((item) => Order.fromJson(item)).toList();
      return orders;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch orders');
    }
  }

  // Optionally, fetch a single order by ID
  Future<Order> fetchOrderById(int orderId) async {
    final response = await _apiService.get('/orders/$orderId');

    if (response['success']) {
      Order order = Order.fromJson(response['data']);
      return order;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch order');
    }
  }
}
