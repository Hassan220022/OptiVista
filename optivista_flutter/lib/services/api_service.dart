// lib/services/api_service.dart

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // Replace with your actual backend URL
  static const String baseUrl = 'http://196.221.151.195:3000/api';

  final FlutterSecureStorage _storage = FlutterSecureStorage();

  // Fetch JWT Token from secure storage
  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  // Set JWT Token
  Future<void> setToken(String token) async {
    await _storage.write(key: 'jwt_token', value: token);
  }

  // Clear JWT Token (e.g., on logout)
  Future<void> clearToken() async {
    await _storage.delete(key: 'jwt_token');
  }

  // Generic GET request
  Future<dynamic> get(String endpoint) async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return _processResponse(response);
  }

  // Generic POST request
  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final token = await getToken();
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    return _processResponse(response);
  }

  // Generic PUT request
  Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    final token = await getToken();
    final response = await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
    return _processResponse(response);
  }

  // Generic DELETE request
  Future<dynamic> delete(String endpoint) async {
    final token = await getToken();
    final response = await http.delete(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    return _processResponse(response);
  }

  // File upload using multipart/form-data
  Future<dynamic> uploadFile(
      String endpoint, String filePath, String fileName) async {
    final token = await getToken();
    var request = http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));

    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    request.files.add(
      await http.MultipartFile.fromPath(
        'file', // This should match the backend's expected field name
        filePath,
        filename: fileName,
        // Optionally, set content type
        // contentType: MediaType('image', 'jpeg'),
      ),
    );

    var streamedResponse = await request.send();
    var response = await http.Response.fromStream(streamedResponse);

    return _processResponse(response);
  }

  // Handle responses
  dynamic _processResponse(http.Response response) {
    final statusCode = response.statusCode;
    final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;

    if (statusCode >= 200 && statusCode < 300) {
      return body;
    } else {
      // You can customize error handling based on your backend's error structure
      throw Exception(body?['message'] ?? 'Error occurred');
    }
  }
}
