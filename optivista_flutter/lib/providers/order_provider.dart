// lib/providers/order_provider.dart

import 'package:flutter/material.dart';
import '../models/order.dart';
import '../services/order_service.dart';

class OrderProvider with ChangeNotifier {
  final OrderService _orderService = OrderService();

  List<Order> _orders = [];
  bool _isLoading = false;
  String? _error;

  List<Order> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Fetch orders for a specific user
  Future<void> fetchUserOrders(int userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _orders = await _orderService.fetchUserOrders(userId);
      _error = null;
    } catch (e) {
      _error = e.toString();
      _orders = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  // Place a new order
  Future<bool> placeOrder({
    required int userId,
    required List<OrderItem> items,
    required String shippingAddress,
    required String paymentMethod,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      int orderId = await _orderService.createOrder(
        userId: userId,
        items: items,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      );
      // Optionally, fetch the updated order list
      await fetchUserOrders(userId);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
