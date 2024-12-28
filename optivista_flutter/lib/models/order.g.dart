// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Order _$OrderFromJson(Map<String, dynamic> json) => Order(
      id: (json['id'] as num).toInt(),
      userId: (json['userId'] as num).toInt(),
      items: (json['items'] as List<dynamic>)
          .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalPrice: (json['totalPrice'] as num).toDouble(),
      shippingAddress: json['shippingAddress'] as String,
      paymentMethod: json['paymentMethod'] as String,
      createdAt: json['createdAt'] as String,
    );

Map<String, dynamic> _$OrderToJson(Order instance) => <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'items': instance.items.map((e) => e.toJson()).toList(),
      'totalPrice': instance.totalPrice,
      'shippingAddress': instance.shippingAddress,
      'paymentMethod': instance.paymentMethod,
      'createdAt': instance.createdAt,
    };

OrderItem _$OrderItemFromJson(Map<String, dynamic> json) => OrderItem(
      productId: (json['productId'] as num).toInt(),
      productName: json['productName'] as String,
      price: (json['price'] as num).toDouble(),
      quantity: (json['quantity'] as num).toInt(),
    );

Map<String, dynamic> _$OrderItemToJson(OrderItem instance) => <String, dynamic>{
      'productId': instance.productId,
      'productName': instance.productName,
      'price': instance.price,
      'quantity': instance.quantity,
    };
