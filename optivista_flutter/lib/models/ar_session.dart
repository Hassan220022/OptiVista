import 'package:json_annotation/json_annotation.dart';

part 'ar_session.g.dart';

@JsonSerializable()
class ARSession {
  final int id;
  final int userId;
  final String createdAt;
  final String sessionData;

  ARSession({
    required this.id,
    required this.userId,
    required this.createdAt,
    required this.sessionData,
  });

  /// Creates a new `ARSession` instance from a JSON map.
  factory ARSession.fromJson(Map<String, dynamic> json) =>
      _$ARSessionFromJson(json);

  /// Converts the `ARSession` instance to a JSON map.
  Map<String, dynamic> toJson() => _$ARSessionToJson(this);
}
