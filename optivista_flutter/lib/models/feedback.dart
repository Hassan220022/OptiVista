// lib/models/feedback.dart

import 'package:json_annotation/json_annotation.dart';
import 'user.dart';

part 'feedback.g.dart';

@JsonSerializable(explicitToJson: true)
class UserFeedback {
  final int id;
  final int userId;
  final int productId;
  final int rating;
  final String review;
  final String createdAt;
  final User? user; // Optional: Include user details if provided by backend

  UserFeedback({
    required this.id,
    required this.userId,
    required this.productId,
    required this.rating,
    required this.review,
    required this.createdAt,
    this.user,
  });

  /// Creates a new `UserFeedback` instance from a JSON map.
  factory UserFeedback.fromJson(Map<String, dynamic> json) =>
      _$UserFeedbackFromJson(json);

  /// Converts the `UserFeedback` instance to a JSON map.
  Map<String, dynamic> toJson() => _$UserFeedbackToJson(this);
}
