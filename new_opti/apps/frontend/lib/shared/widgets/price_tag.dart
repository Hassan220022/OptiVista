import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text_styles.dart';

/// Price display widget with optional discount
class PriceTag extends StatelessWidget {
  final double price;
  final double? originalPrice;
  final String currencySymbol;
  final bool showDiscountBadge;
  final TextStyle? priceStyle;
  final TextStyle? originalPriceStyle;

  const PriceTag({
    super.key,
    required this.price,
    this.originalPrice,
    this.currencySymbol = '\$',
    this.showDiscountBadge = true,
    this.priceStyle,
    this.originalPriceStyle,
  });

  bool get hasDiscount =>
      originalPrice != null && originalPrice! > price;

  int get discountPercentage =>
      hasDiscount ? ((1 - price / originalPrice!) * 100).round() : 0;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(
          '$currencySymbol${price.toStringAsFixed(2)}',
          style: priceStyle ??
              AppTextStyles.titleLarge.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
              ),
        ),
        if (hasDiscount) ...[
          const SizedBox(width: 8),
          Text(
            '$currencySymbol${originalPrice!.toStringAsFixed(2)}',
            style: originalPriceStyle ??
                AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textTertiary,
                  decoration: TextDecoration.lineThrough,
                ),
          ),
          if (showDiscountBadge) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 8,
                vertical: 4,
              ),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: AppColors.error.withOpacity(0.3),
                ),
              ),
              child: Text(
                '-$discountPercentage%',
                style: AppTextStyles.labelSmall.copyWith(
                  color: AppColors.error,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ],
      ],
    );
  }
}

/// Compact price display for lists
class PriceTagCompact extends StatelessWidget {
  final double price;
  final double? originalPrice;
  final String currencySymbol;

  const PriceTagCompact({
    super.key,
    required this.price,
    this.originalPrice,
    this.currencySymbol = '\$',
  });

  @override
  Widget build(BuildContext context) {
    final hasDiscount = originalPrice != null && originalPrice! > price;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          '$currencySymbol${price.toStringAsFixed(2)}',
          style: AppTextStyles.titleMedium.copyWith(
            color: AppColors.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        if (hasDiscount)
          Text(
            '$currencySymbol${originalPrice!.toStringAsFixed(2)}',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textTertiary,
              decoration: TextDecoration.lineThrough,
            ),
          ),
      ],
    );
  }
}
