import 'api_service.dart';
import '../models/order.dart';

class OrderService {
  final ApiService _apiService = ApiService();

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
      return response['data']['orderId']; // Assuming backend returns orderId
    } else {
      throw Exception(response['message']);
    }
  }

  Future<List<Order>> fetchUserOrders(int userId) async {
    final response = await _apiService.get('/orders/$userId');
    if (response['success']) {
      List<Order> orders = [];
      for (var item in response['data']) {
        orders.add(Order.fromJson(item));
      }
      return orders;
    } else {
      throw Exception(response['message']);
    }
  }
}
