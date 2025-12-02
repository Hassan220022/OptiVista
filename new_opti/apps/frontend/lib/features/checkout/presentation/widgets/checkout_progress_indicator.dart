import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

enum CheckoutStep { shipping, payment, review }

/// Progress indicator for checkout flow
class CheckoutProgressIndicator extends StatelessWidget {
  final CheckoutStep currentStep;
  final ValueChanged<CheckoutStep>? onStepTap;

  const CheckoutProgressIndicator({
    super.key,
    required this.currentStep,
    this.onStepTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          _buildStep(
            step: CheckoutStep.shipping,
            label: 'Shipping',
            icon: Icons.local_shipping_outlined,
          ),
          _buildConnector(CheckoutStep.shipping),
          _buildStep(
            step: CheckoutStep.payment,
            label: 'Payment',
            icon: Icons.payment_outlined,
          ),
          _buildConnector(CheckoutStep.payment),
          _buildStep(
            step: CheckoutStep.review,
            label: 'Review',
            icon: Icons.receipt_long_outlined,
          ),
        ],
      ),
    );
  }

  Widget _buildStep({
    required CheckoutStep step,
    required String label,
    required IconData icon,
  }) {
    final isActive = step.index <= currentStep.index;
    final isCompleted = step.index < currentStep.index;
    final isCurrent = step == currentStep;

    return Expanded(
      child: GestureDetector(
        onTap: isCompleted ? () => onStepTap?.call(step) : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: isActive ? AppColors.primaryGradient : null,
                color: isActive ? null : AppColors.surfaceLight,
                border: isCurrent
                    ? Border.all(color: AppColors.primary, width: 2)
                    : null,
                boxShadow: isActive
                    ? [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ]
                    : null,
              ),
              child: Center(
                child: isCompleted
                    ? const Icon(
                        Icons.check,
                        color: Colors.white,
                        size: 20,
                      )
                    : Icon(
                        icon,
                        color: isActive ? Colors.white : AppColors.textTertiary,
                        size: 20,
                      ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: AppTextStyles.labelSmall.copyWith(
                color: isActive ? AppColors.textPrimary : AppColors.textTertiary,
                fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConnector(CheckoutStep beforeStep) {
    final isCompleted = beforeStep.index < currentStep.index;

    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 24),
        decoration: BoxDecoration(
          gradient: isCompleted ? AppColors.primaryGradient : null,
          color: isCompleted ? null : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(1),
        ),
      ),
    );
  }
}
