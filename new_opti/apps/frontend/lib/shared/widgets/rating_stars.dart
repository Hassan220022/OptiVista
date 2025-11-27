import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Display rating stars (read-only)
class RatingStars extends StatelessWidget {
  final double rating;
  final double size;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool showValue;

  const RatingStars({
    super.key,
    required this.rating,
    this.size = 20,
    this.activeColor,
    this.inactiveColor,
    this.showValue = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        ...List.generate(5, (index) {
          final starValue = index + 1;
          IconData icon;
          Color color;

          if (rating >= starValue) {
            icon = Icons.star;
            color = activeColor ?? Colors.amber;
          } else if (rating >= starValue - 0.5) {
            icon = Icons.star_half;
            color = activeColor ?? Colors.amber;
          } else {
            icon = Icons.star_border;
            color = inactiveColor ?? Colors.grey.shade400;
          }

          return Icon(icon, size: size, color: color);
        }),
        if (showValue) ...[
          const SizedBox(width: 8),
          Text(
            rating.toStringAsFixed(1),
            style: TextStyle(
              fontSize: size * 0.7,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ],
    );
  }
}

/// Interactive rating input widget
class RatingInput extends StatelessWidget {
  final double rating;
  final ValueChanged<double> onRatingChanged;
  final double size;
  final Color? activeColor;
  final Color? inactiveColor;
  final bool allowHalf;

  const RatingInput({
    super.key,
    required this.rating,
    required this.onRatingChanged,
    this.size = 36,
    this.activeColor,
    this.inactiveColor,
    this.allowHalf = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        final starValue = index + 1;
        IconData icon;
        Color color;

        if (rating >= starValue) {
          icon = Icons.star;
          color = activeColor ?? Colors.amber;
        } else if (allowHalf && rating >= starValue - 0.5) {
          icon = Icons.star_half;
          color = activeColor ?? Colors.amber;
        } else {
          icon = Icons.star_border;
          color = inactiveColor ?? Colors.grey.shade400;
        }

        return GestureDetector(
          onTap: () => onRatingChanged(starValue.toDouble()),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Icon(icon, size: size, color: color),
          ),
        );
      }),
    );
  }
}

/// Rating summary widget showing average rating and breakdown
class RatingSummary extends StatelessWidget {
  final double averageRating;
  final int totalReviews;
  final Map<int, int>? ratingDistribution;

  const RatingSummary({
    super.key,
    required this.averageRating,
    required this.totalReviews,
    this.ratingDistribution,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Average rating display
        Column(
          children: [
            Text(
              averageRating.toStringAsFixed(1),
              style: const TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
              ),
            ),
            RatingStars(rating: averageRating, size: 16),
            const SizedBox(height: 4),
            Text(
              '$totalReviews reviews',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 12,
              ),
            ),
          ],
        ),
        // Rating distribution bars
        if (ratingDistribution != null) ...[
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              children: List.generate(5, (index) {
                final star = 5 - index;
                final count = ratingDistribution![star] ?? 0;
                final percentage =
                    totalReviews > 0 ? count / totalReviews : 0.0;

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Row(
                    children: [
                      Text(
                        '$star',
                        style: const TextStyle(fontSize: 12),
                      ),
                      const Icon(Icons.star, size: 12, color: Colors.amber),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: percentage,
                            backgroundColor: AppColors.surfaceLight,
                            valueColor: const AlwaysStoppedAnimation<Color>(
                              Colors.amber,
                            ),
                            minHeight: 8,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      SizedBox(
                        width: 30,
                        child: Text(
                          '$count',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ),
          ),
        ],
      ],
    );
  }
}
