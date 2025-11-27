import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/rating_stars.dart';

/// Feedback type enum
enum FeedbackType {
  appExperience('App Experience', Icons.phone_android),
  arAccuracy('AR Accuracy', Icons.view_in_ar),
  orderIssue('Order Issue', Icons.local_shipping),
  featureRequest('Feature Request', Icons.lightbulb),
  bugReport('Bug Report', Icons.bug_report),
  other('Other', Icons.help_outline);

  final String label;
  final IconData icon;
  const FeedbackType(this.label, this.icon);
}

/// Enhanced feedback screen with type selector and AR rating
class FeedbackScreenEnhanced extends ConsumerStatefulWidget {
  const FeedbackScreenEnhanced({super.key});

  @override
  ConsumerState<FeedbackScreenEnhanced> createState() =>
      _FeedbackScreenEnhancedState();
}

class _FeedbackScreenEnhancedState
    extends ConsumerState<FeedbackScreenEnhanced> {
  final _messageController = TextEditingController();
  FeedbackType? _selectedType;
  double _arRating = 0;
  bool _isSubmitting = false;
  bool _isSuccess = false;

  bool get _showArRating =>
      _selectedType == FeedbackType.arAccuracy ||
      _selectedType == FeedbackType.appExperience;

  bool get _isValid =>
      _selectedType != null &&
      _messageController.text.trim().length >= 10 &&
      (!_showArRating || _arRating > 0);

  Future<void> _submitFeedback() async {
    if (!_isValid) return;

    setState(() => _isSubmitting = true);

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() {
        _isSubmitting = false;
        _isSuccess = true;
      });
    }
  }

  void _reset() {
    setState(() {
      _selectedType = null;
      _messageController.clear();
      _arRating = 0;
      _isSuccess = false;
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isSuccess) {
      return _buildSuccessView();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Send Feedback'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'We value your feedback',
              style: AppTextStyles.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Help us improve your experience by sharing your thoughts.',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 32),

            // Feedback type selector
            Text(
              'What type of feedback is this?',
              style: AppTextStyles.titleMedium,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: FeedbackType.values.map((type) {
                final isSelected = _selectedType == type;
                return GestureDetector(
                  onTap: () => setState(() => _selectedType = type),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppColors.primary.withOpacity(0.1)
                          : AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primary
                            : Colors.white.withOpacity(0.1),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          type.icon,
                          size: 20,
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.textSecondary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          type.label,
                          style: AppTextStyles.labelMedium.copyWith(
                            color: isSelected
                                ? AppColors.primary
                                : AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 32),

            // AR Rating (shown for AR-related feedback)
            if (_showArRating) ...[
              Text(
                'How accurate was the AR try-on?',
                style: AppTextStyles.titleMedium,
              ),
              const SizedBox(height: 16),
              Center(
                child: RatingInput(
                  rating: _arRating,
                  onRatingChanged: (value) =>
                      setState(() => _arRating = value),
                  size: 40,
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  _arRating == 0
                      ? 'Tap to rate'
                      : _arRating <= 2
                          ? 'Needs Improvement'
                          : _arRating <= 3
                              ? 'Average'
                              : _arRating <= 4
                                  ? 'Good'
                                  : 'Excellent',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],

            // Message input
            Text(
              'Your feedback',
              style: AppTextStyles.titleMedium,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _messageController,
              maxLines: 5,
              maxLength: 1000,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Tell us what\'s on your mind...',
                filled: true,
                fillColor: AppColors.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primary),
                ),
              ),
            ),
            if (_messageController.text.trim().length < 10 &&
                _messageController.text.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  'Please enter at least 10 characters',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.error,
                  ),
                ),
              ),
            const SizedBox(height: 32),

            // Submit button
            AppButton(
              text: 'Submit Feedback',
              onPressed: _isValid && !_isSubmitting ? _submitFeedback : null,
              isLoading: _isSubmitting,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessView() {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_outline,
                  size: 80,
                  color: Colors.green,
                ),
              ),
              const SizedBox(height: 32),
              Text(
                'Thank You!',
                style: AppTextStyles.displaySmall,
              ),
              const SizedBox(height: 16),
              Text(
                'Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.',
                textAlign: TextAlign.center,
                style: AppTextStyles.bodyLarge.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 48),
              AppButton(
                text: 'Done',
                onPressed: () => context.pop(),
                width: 200,
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _reset,
                child: const Text('Submit Another'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
