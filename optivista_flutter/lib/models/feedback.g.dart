// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserFeedback _$UserFeedbackFromJson(Map<String, dynamic> json) => UserFeedback(
      id: (json['id'] as num).toInt(),
      userId: (json['userId'] as num).toInt(),
      productId: (json['productId'] as num).toInt(),
      rating: (json['rating'] as num).toInt(),
      review: json['review'] as String,
      createdAt: json['createdAt'] as String,
      user: json['user'] == null
          ? null
          : User.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$UserFeedbackToJson(UserFeedback instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'productId': instance.productId,
      'rating': instance.rating,
      'review': instance.review,
      'createdAt': instance.createdAt,
      'user': instance.user?.toJson(),
    };
