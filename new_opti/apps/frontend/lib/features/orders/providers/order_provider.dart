import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/order_repository.dart';
import '../domain/order_model.dart';

final ordersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  final repository = ref.watch(orderRepositoryProvider);
  return repository.getOrders();
});

final orderDetailsProvider =
    FutureProvider.family.autoDispose<Order, String>((ref, id) async {
  final repository = ref.watch(orderRepositoryProvider);
  return repository.getOrderDetails(id);
});
