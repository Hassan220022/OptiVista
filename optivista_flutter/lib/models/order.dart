import 'package:json_annotation/json_annotation.dart';

part 'order.g.dart';

@JsonSerializable(explicitToJson: true)
class Order {
  final int id;
  final int userId;
  final List<OrderItem> items;
  final double totalPrice;
  final String shippingAddress;
  final String paymentMethod;
  final String createdAt;

  Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.totalPrice,
    required this.shippingAddress,
    required this.paymentMethod,
    required this.createdAt,
  });

  /// Creates a new `Order` instance from a JSON map.
  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);

  /// Converts the `Order` instance to a JSON map.
  Map<String, dynamic> toJson() => _$OrderToJson(this);
}

@JsonSerializable()
class OrderItem {
  final int productId;
  final String productName;
  final double price;
  final int quantity;

  OrderItem({
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
  });

  /// Creates a new `OrderItem` instance from a JSON map.
  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);

  /// Converts the `OrderItem` instance to a JSON map.
  Map<String, dynamic> toJson() => _$OrderItemToJson(this);
}
