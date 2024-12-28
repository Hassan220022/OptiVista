import '../models/ar_session.dart';
import 'api_service.dart';

class ARService {
  final ApiService _apiService = ApiService();

  // Initialize a new AR session
  Future<ARSession> initializeARSession(int userId) async {
    final data = {
      'userId': userId,
      // Include any additional data required to initialize the AR session
    };

    final response = await _apiService.post('/ar/sessions', data);

    if (response['success']) {
      ARSession session = ARSession.fromJson(response['data']);
      return session;
    } else {
      throw Exception(response['message'] ?? 'Failed to initialize AR session');
    }
  }

  // Fetch all AR sessions for a specific user
  Future<List<ARSession>> fetchARSessions(int userId) async {
    final response = await _apiService.get('/ar/sessions/user/$userId');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<ARSession> sessions =
          data.map((item) => ARSession.fromJson(item)).toList();
      return sessions;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch AR sessions');
    }
  }

  // Optionally, fetch a single AR session by ID
  Future<ARSession> fetchARSessionById(int sessionId) async {
    final response = await _apiService.get('/ar/sessions/$sessionId');

    if (response['success']) {
      ARSession session = ARSession.fromJson(response['data']);
      return session;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch AR session');
    }
  }

  // Optionally, end an AR session
  Future<void> endARSession(int sessionId) async {
    final response = await _apiService.post('/ar/sessions/$sessionId/end', {});

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to end AR session');
    }
  }
}
