import '../../catalog/domain/product_model.dart';

enum OrderStatus {
  pending,
  processing,
  shipped,
  delivered,
  cancelled,
}

class Order {
  final String id;
  final DateTime date;
  final OrderStatus status;
  final double total;
  final List<OrderItem> items;
  final String trackingNumber;

  const Order({
    required this.id,
    required this.date,
    required this.status,
    required this.total,
    required this.items,
    this.trackingNumber = '',
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      date: DateTime.parse(json['created_at']),
      status: OrderStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => OrderStatus.pending,
      ),
      total: (json['total_amount_cents'] ?? 0) / 100.0,
      items: (json['items'] as List<dynamic>?)
              ?.map((item) => OrderItem.fromJson(item))
              .toList() ??
          [],
      trackingNumber: json['tracking_number'] ?? '',
    );
  }
}

class OrderItem {
  final Product product;
  final int quantity;
  final double price;

  const OrderItem({
    required this.product,
    required this.quantity,
    required this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      product: json['product'] != null
          ? Product.fromJson(json['product'])
          : Product(
              id: json['product_id'] ?? '',
              name: json['product_name'] ?? 'Unknown Product',
              description: '',
              price: json['unit_price_cents'] ?? 0,
              currency: 'USD',
              brand: '',
              modelNumber: '',
              frameColor: '',
              lensColor: '',
              frameMaterial: '',
              style: '',
              gender: '',
              faceShape: '',
              images: [],
              isVirtualTryOnEnabled: false,
              rating: 0,
              reviewCount: 0,
            ),
      quantity: json['quantity'] ?? 1,
      price: (json['unit_price_cents'] ?? 0) / 100.0,
    );
  }
}
