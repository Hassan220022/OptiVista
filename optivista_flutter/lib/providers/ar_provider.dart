import 'package:flutter/material.dart';
import '../models/ar_session.dart';
import '../services/ar_service.dart';

class ARProvider with ChangeNotifier {
  final ARService _arService = ARService();

  List<ARSession> _sessions = [];
  bool _isLoading = false;
  String? _error;

  List<ARSession> get sessions => _sessions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Initialize a new AR session
  Future<bool> initializeARSession(int userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      ARSession session = await _arService.initializeARSession(userId);
      _sessions.add(session);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Fetch AR sessions for a specific user
  Future<void> fetchARSessions(int userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _sessions = await _arService.fetchARSessions(userId);
      _error = null;
    } catch (e) {
      _error = e.toString();
      _sessions = [];
    }

    _isLoading = false;
    notifyListeners();
  }
}
