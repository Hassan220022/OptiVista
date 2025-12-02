import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

/// Cart summary panel showing totals and checkout button
class CartSummaryPanel extends StatelessWidget {
  final double subtotal;
  final double? shipping;
  final double? discount;
  final VoidCallback? onCheckout;
  final VoidCallback? onContinueShopping;
  final bool isLoading;

  const CartSummaryPanel({
    super.key,
    required this.subtotal,
    this.shipping,
    this.discount,
    this.onCheckout,
    this.onContinueShopping,
    this.isLoading = false,
  });

  double get total => subtotal + (shipping ?? 0) - (discount ?? 0);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Drag handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            // Summary rows
            _SummaryRow(
              label: 'Subtotal',
              value: '\$${(subtotal / 100).toStringAsFixed(2)}',
            ),
            const SizedBox(height: 8),
            _SummaryRow(
              label: 'Shipping',
              value: shipping != null
                  ? '\$${(shipping! / 100).toStringAsFixed(2)}'
                  : 'Calculated at checkout',
              isSecondary: shipping == null,
            ),
            if (discount != null && discount! > 0) ...[
              const SizedBox(height: 8),
              _SummaryRow(
                label: 'Discount',
                value: '-\$${(discount! / 100).toStringAsFixed(2)}',
                valueColor: AppColors.success,
              ),
            ],
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Divider(color: Colors.white12),
            ),
            // Total
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
            const SizedBox(height: 20),
            // Checkout button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: isLoading ? null : onCheckout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: AppColors.primary.withValues(alpha: 0.5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  elevation: 0,
                ),
                child: isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Proceed to Checkout',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, size: 20),
                        ],
                      ),
              ),
            ),
            // Continue shopping
            if (onContinueShopping != null) ...[
              const SizedBox(height: 12),
              TextButton(
                onPressed: onContinueShopping,
                child: Text(
                  'Continue Shopping',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isSecondary;
  final Color? valueColor;

  const _SummaryRow({
    required this.label,
    required this.value,
    this.isSecondary = false,
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
            color: valueColor ?? (isSecondary ? AppColors.textTertiary : AppColors.textPrimary),
            fontWeight: isSecondary ? FontWeight.normal : FontWeight.w500,
            fontStyle: isSecondary ? FontStyle.italic : FontStyle.normal,
          ),
        ),
      ],
    );
  }
}
