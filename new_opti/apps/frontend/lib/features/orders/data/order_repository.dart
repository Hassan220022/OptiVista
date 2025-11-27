import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../domain/order_model.dart';

class OrderRepository {
  final Dio _dio;

  OrderRepository(this._dio);

  Future<List<Order>> getOrders() async {
    final response = await _dio.get('/orders/');
    return (response.data as List).map((json) => Order.fromJson(json)).toList();
  }

  Future<Order> createOrder({
    required Map<String, dynamic> shippingAddress,
    required String paymentProvider,
  }) async {
    final response = await _dio.post('/orders/', data: {
      'shipping_address': shippingAddress,
      'payment_provider': paymentProvider,
    });
    // The backend returns OrderSummary, but we might want full details.
    // However, for confirmation screen, we might just need ID.
    // Let's assume OrderSummary is enough or we fetch details later.
    // Actually, OrderSummary doesn't have items.
    // But OrderConfirmationScreen usually fetches details by ID.
    // So returning Order (which is OrderSummary structure mostly) is fine.
    // Wait, Order.fromJson expects items. OrderSummary doesn't have items.
    // I should update Order.fromJson to handle missing items or make them optional.
    // I already did that in step 969 (items defaults to []).
    return Order.fromJson(response.data);
  }

  Future<Order> getOrderDetails(String id) async {
    final response = await _dio.get('/orders/$id');
    return Order.fromJson(response.data);
  }
}

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  final dio = ref.watch(apiClientProvider);
  return OrderRepository(dio);
});
