import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

/// Price breakdown widget for checkout
class PriceBreakdown extends StatelessWidget {
  final double subtotal;
  final double shippingCost;
  final double? taxAmount;
  final double? discountAmount;
  final double total;
  final bool showDivider;

  const PriceBreakdown({
    super.key,
    required this.subtotal,
    required this.shippingCost,
    this.taxAmount,
    this.discountAmount,
    required this.total,
    this.showDivider = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        children: [
          _PriceRow(
            label: 'Subtotal',
            value: '\$${(subtotal / 100).toStringAsFixed(2)}',
          ),
          const SizedBox(height: 12),
          _PriceRow(
            label: 'Shipping',
            value: shippingCost > 0
                ? '\$${(shippingCost / 100).toStringAsFixed(2)}'
                : 'Free',
            valueColor: shippingCost == 0 ? AppColors.success : null,
          ),
          if (taxAmount != null && taxAmount! > 0) ...[
            const SizedBox(height: 12),
            _PriceRow(
              label: 'Tax',
              value: '\$${(taxAmount! / 100).toStringAsFixed(2)}',
            ),
          ],
          if (discountAmount != null && discountAmount! > 0) ...[
            const SizedBox(height: 12),
            _PriceRow(
              label: 'Discount',
              value: '-\$${(discountAmount! / 100).toStringAsFixed(2)}',
              valueColor: AppColors.success,
            ),
          ],
          if (showDivider) ...[
            const SizedBox(height: 16),
            Divider(color: Colors.white.withValues(alpha: 0.1)),
            const SizedBox(height: 16),
          ] else
            const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total',
                style: AppTextStyles.titleLarge.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                '\$${(total / 100).toStringAsFixed(2)}',
                style: AppTextStyles.headlineSmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _PriceRow({
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: AppTextStyles.bodyMedium.copyWith(
            color: valueColor ?? AppColors.textPrimary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
