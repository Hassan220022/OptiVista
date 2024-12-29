import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://196.221.151.195:3000';
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  // POST request
  Future<Map<String, dynamic>> post(
      String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final token = await _storage.read(key: 'jwt_token');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: json.encode(data),
    );

    return json.decode(response.body);
  }

  // GET request
  Future<Map<String, dynamic>> get(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final token = await _storage.read(key: 'jwt_token');

    final response = await http.get(
      url,
      headers: {
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    return json.decode(response.body);
  }

  // Set JWT token
  Future<void> setToken(String token) async {
    await _storage.write(key: 'jwt_token', value: token);
  }

  // Clear JWT token
  Future<void> clearToken() async {
    await _storage.delete(key: 'jwt_token');
  }
}
