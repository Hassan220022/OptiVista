import 'dart:convert';
import '../models/user.dart';
import 'api_service.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb_auth;
import 'package:google_sign_in/google_sign_in.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  final fb_auth.FirebaseAuth _firebaseAuth = fb_auth.FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  // Register a new user
  Future<User> register({
    required String username,
    required String email,
    required String password,
    String role = 'customer', // Default role
  }) async {
    final data = {
      'username': username,
      'email': email,
      'password': password,
      'role': role,
    };

    final response = await _apiService.post('/auth/register', data);

    if (response['success']) {
      // Assuming the backend returns the user data and token
      User user = User.fromJson(response['data']);
      String token = response['token'];
      await _apiService.setToken(token);
      return user;
    } else {
      throw Exception(response['message'] ?? 'Registration failed');
    }
  }

  // Login an existing user
  Future<User> login({
    required String email,
    required String password,
  }) async {
    final data = {
      'email': email,
      'password': password,
    };

    final response = await _apiService.post('/auth/login', data);

    if (response['success']) {
      // Assuming the backend returns the user data and token
      User user = User.fromJson(response['data']);
      String token = response['token'];
      await _apiService.setToken(token);
      return user;
    } else {
      throw Exception(response['message'] ?? 'Login failed');
    }
  }

  // Logout the current user
  Future<void> logout() async {
    // If your backend has a logout endpoint, call it here
    // For example:
    // await _apiService.post('/auth/logout', {});
    await _apiService.clearToken();
  }

  // Fetch the current authenticated user
  Future<User> getCurrentUser() async {
    final response =
        await _apiService.get('/auth/me'); // Adjust endpoint as needed

    if (response['success']) {
      User user = User.fromJson(response['data']);
      return user;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch user');
    }
  }

  // Google Sign-In
  Future<User> signInWithGoogle() async {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    if (googleUser == null) {
      throw Exception('Google Sign-In aborted');
    }

    final GoogleSignInAuthentication googleAuth =
        await googleUser.authentication;

    final fb_auth.AuthCredential credential =
        fb_auth.GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );

    final fb_auth.UserCredential userCredential =
        await _firebaseAuth.signInWithCredential(credential);

    if (userCredential.user == null) {
      throw Exception('Google Sign-In failed');
    }

    // Assuming backend handles creating/fetching user and returning a token
    // You might need to send user details to your backend here

    // Example:
    final response = await _apiService.post('/auth/google', {
      'id': userCredential.user!.uid,
      'email': userCredential.user!.email,
      'username': userCredential.user!.displayName,
      // Add other necessary fields
    });

    if (response['success']) {
      User user = User.fromJson(response['data']);
      String token = response['token'];
      await _apiService.setToken(token);
      return user;
    } else {
      throw Exception(response['message'] ?? 'Google Sign-In failed');
    }
  }
}
