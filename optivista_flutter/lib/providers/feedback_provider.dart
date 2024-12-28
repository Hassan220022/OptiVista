// lib/providers/feedback_provider.dart

import 'package:flutter/material.dart';
import '../models/feedback.dart';
import '../services/feedback_service.dart';

class FeedbackProvider with ChangeNotifier {
  final FeedbackService _feedbackService = FeedbackService();

  List<UserFeedback> _feedbacks = [];
  bool _isLoading = false;
  String? _error;

  List<UserFeedback> get feedbacks => _feedbacks;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Submit new feedback
  Future<bool> submitFeedback({
    required int userId,
    required int productId,
    required int rating,
    required String review,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _feedbackService.addFeedback(
        userId: userId,
        productId: productId,
        rating: rating,
        review: review,
      );
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

  // Fetch feedback for a specific product
  Future<void> fetchFeedbackForProduct(int productId) async {
    _isLoading = true;
    notifyListeners();

    try {
      _feedbacks = await _feedbackService.fetchProductFeedback(productId);
      _error = null;
    } catch (e) {
      _error = e.toString();
      _feedbacks = [];
    }

    _isLoading = false;
    notifyListeners();
  }
}
