import '../models/feedback.dart';
import 'api_service.dart';

class FeedbackService {
  final ApiService _apiService = ApiService();

  // Submit new feedback for a product
  Future<void> addFeedback({
    required int userId,
    required int productId,
    required int rating,
    required String review,
  }) async {
    final data = {
      'userId': userId,
      'productId': productId,
      'rating': rating,
      'review': review,
    };

    final response = await _apiService.post('/feedback/', data);

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to submit feedback');
    }
  }

  // Fetch all feedback for a specific product
  Future<List<UserFeedback>> fetchProductFeedback(int productId) async {
    final response = await _apiService.get('/feedback/product/$productId');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<UserFeedback> feedbacks =
          data.map((item) => UserFeedback.fromJson(item)).toList();
      return feedbacks;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch feedback');
    }
  }

  // Optionally, fetch all feedback by a user
  Future<List<UserFeedback>> fetchUserFeedback(int userId) async {
    final response = await _apiService.get('/feedback/user/$userId');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<UserFeedback> feedbacks =
          data.map((item) => UserFeedback.fromJson(item)).toList();
      return feedbacks;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch user feedback');
    }
  }
}
