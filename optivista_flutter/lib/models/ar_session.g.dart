// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ar_session.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ARSession _$ARSessionFromJson(Map<String, dynamic> json) => ARSession(
      id: (json['id'] as num).toInt(),
      userId: (json['userId'] as num).toInt(),
      createdAt: json['createdAt'] as String,
      sessionData: json['sessionData'] as String,
    );

Map<String, dynamic> _$ARSessionToJson(ARSession instance) => <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'createdAt': instance.createdAt,
      'sessionData': instance.sessionData,
    };
